#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent RAG KNaturopathy
- Reçoit une question
- Cherche dans les chunks WHO
- Interroge Ollama (Mistral ou autre)
- Retourne une réponse en français
"""

import os
import json
import sqlite3
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

OLLAMA_URL = os.environ.get('OLLAMA_URL', 'http://localhost:11434')
MODEL = os.environ.get('OLLAMA_MODEL', 'mistral:7b')
DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'database.db')

def get_context(question, top_k=8):
    """Recherche les chunks WHO + plantes les plus pertinents."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Mots-clés (même courts, on garde tout)
    words = [w.strip('?!.,;') for w in question.lower().split() if len(w.strip('?!.,;')) >= 2]
    if not words:
        words = [question.lower().strip()]
    
    # --- Étape 1 : Chercher dans WHO_chunks ---
    rows = []
    try:
        for w in words:
            c.execute("SELECT content, source FROM who_chunks WHERE LOWER(content) LIKE ? LIMIT ?", (f'%{w}%', top_k))
            rows.extend(c.fetchall())
    except sqlite3.OperationalError:
        pass
    
    # --- Étape 2 : Si peu de résultats WHO, chercher dans les plantes (description/usage) ---
    if len(rows) < 3:
        try:
            for w in words:
                c.execute("SELECT name || ' : ' || description || ' Usage: ' || usage || ' Contre-indications: ' || contraindications as content, 'Base Plantes' as source FROM plants WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(usage) LIKE ? LIMIT ?", (f'%{w}%', f'%{w}%', f'%{w}%', 3))
                rows.extend(c.fetchall())
        except:
            pass
    
    conn.close()
    # Dédoublonnage
    seen = set()
    unique = []
    for r in rows:
        key = r[0][:100]
        if key not in seen:
            seen.add(key)
            unique.append(r)
    return unique[:top_k]

@app.route('/api/agent', methods=['POST'])
def agent():
    data = request.get_json() or {}
    question = data.get('question', '').strip()
    
    if not question:
        return jsonify({'error': 'Question vide'}), 400
    
    # 1. Récupérer le contexte WHO
    chunks = get_context(question)
    context = '\n\n'.join([f"[{src}] {txt}" for txt, src in chunks]) if chunks else 'Aucun document WHO trouvé.'
    
    # 2. Construire le prompt STRICT
    prompt = f"""Tu es un naturopathe certifié et expert. Tu réponds UNIQUEMENT à partir des documents de formation suivants. Tu ne dois PAS utiliser tes connaissances générales. Si les documents ne contiennent pas la réponse, dis-le honnêtement.

Documents de formation :
{context}

Question du patient : {question}

Instructions :
- Base ta réponse EXCLUSIVEMENT sur les documents ci-dessus.
- Cite les plantes ou remèdes mentionnés dans les documents.
- Sois précis, structuré et bienveillant.
- Ne commence PAS par "Je suis un assistant virtuel" ou "Je ne suis pas un médecin". Parle en tant que naturopathe expert.

Réponse :"""
    
    # 3. Appeler Ollama
    try:
        r = requests.post(
            f'{OLLAMA_URL}/api/generate',
            json={
                'model': MODEL,
                'prompt': prompt,
                'stream': False,
                'options': {'temperature': 0.7}
            },
            timeout=120
        )
        r.raise_for_status()
        result = r.json()
        answer = result.get('response', '').strip()
    except Exception as e:
        answer = f"Erreur agent : {str(e)}"
    
    return jsonify({
        'question': question,
        'answer': answer,
        'sources': [src for _, src in chunks]
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': MODEL})

if __name__ == '__main__':
    print(f"🤖 Agent KNaturopathy lancé sur http://192.168.1.134:5001")
    print(f"   Modèle Ollama : {MODEL}")
    app.run(host='0.0.0.0', port=5001, debug=False)
