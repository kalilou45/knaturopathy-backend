const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'data/database.db');
const db = new Database(dbPath);

// ===== TABLES CONVERSATIONS =====
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    title TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  );
`);

app.use('/real', express.static(path.join(__dirname, '../assets/real')));

// Normalisation : minuscules + sans accents
const normalize = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

app.get('/api/plants', (req, res) => {
  try {
    const plants = db.prepare('SELECT * FROM plants').all();
    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur base de données" });
  }
});

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const searchNormalized = normalize(q);
    const allPlants = db.prepare('SELECT * FROM plants').all();
    const plants = allPlants.filter(p => {
      const text = normalize([p.name, p.description, p.usage, p.contraindications].join(' '));
      return text.includes(searchNormalized);
    });
    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur recherche" });
  }
});

app.post('/ask', async (req, res) => {
  const { question, conversation_id, device_id } = req.body;
  console.log('Question reçue (backend):', question);
  
  if (!question || question.trim().length === 0) {
    return res.status(400).json({ reponse: "Veuillez poser une question." });
  }

  let convId = conversation_id;

  try {
    // Créer une nouvelle conversation si besoin
    if (!convId && device_id) {
      const title = question.length > 50 ? question.substring(0, 50) + '...' : question;
      const result = db.prepare('INSERT INTO conversations (device_id, title) VALUES (?, ?)').run(device_id, title);
      convId = result.lastInsertRowid;
    }

    // Sauvegarder la question
    if (convId) {
      db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)')
        .run(convId, 'user', question);
    }

    const allPlants = db.prepare('SELECT * FROM plants').all();
    const searchNormalized = normalize(question);
    const keywords = searchNormalized.split(/\s+/).filter(k => k.length > 2);
    
    let relevantPlants = [];
    if (keywords.length > 0) {
      relevantPlants = allPlants.filter(p => {
        const text = normalize([p.name, p.description, p.usage, p.contraindications].join(' '));
        return keywords.some(k => text.includes(k));
      });
    }
    
    const contextPlants = relevantPlants.length > 0 
      ? relevantPlants.slice(0, 8) 
      : allPlants.slice(0, 5);
    
    const context = contextPlants.map(p => 
      `🌿 ${p.name}: ${p.description} | Usage: ${p.usage} | Contre-indications: ${p.contraindications || 'Aucune connue'}`
    ).join('\n\n');

    const systemContent = `Tu es PhytoHelp, un naturopathe expert et bienveillant. Tu réponds UNIQUEMENT en te basant sur les plantes médicinales suivantes. N'invente jamais de plantes. Si aucune plante ne correspond, dis-le honnêtement et suggère de consulter un professionnel de santé.\n\nPLANTES DISPONIBLES:\n${context}\n\nRègles:\n- Réponds en français\n- Sois concis (max 3-4 phrases)\n- Mentionne les contre-indications si pertinent\n- Ne diagnosticque pas de maladies graves`;

    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'open-mistral-nemo',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: question }
        ],
        temperature: 0.3,
        max_tokens: 512
      })
    });

    if (!mistralResponse.ok) {
      const errText = await mistralResponse.text();
      console.error('Mistral API error:', mistralResponse.status, errText);
      throw new Error(`Mistral API ${mistralResponse.status}`);
    }

    const data = await mistralResponse.json();
    const reponse = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
    
    // Sauvegarder la réponse
    if (convId) {
      db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)')
        .run(convId, 'assistant', reponse);
      db.prepare('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(convId);
    }
    
    res.json({ reponse, conversation_id: convId });
  } catch (error) {
    console.error('Erreur appel IA:', error.message);
    res.status(500).json({ reponse: "L'assistant naturopathe est temporairement indisponible. Veuillez réessayer plus tard." });
  }
});
// ===== CONVERSATIONS =====
app.post('/api/conversations', (req, res) => {
  const { device_id, title } = req.body;
  if (!device_id) return res.status(400).json({ error: 'device_id requis' });
  try {
    const result = db.prepare('INSERT INTO conversations (device_id, title) VALUES (?, ?)').run(device_id, title || 'Nouvelle conversation');
    res.json({ id: result.lastInsertRowid, device_id, title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/conversations', (req, res) => {
  const { device_id } = req.query;
  if (!device_id) return res.status(400).json({ error: 'device_id requis' });
  try {
    const conversations = db.prepare('SELECT * FROM conversations WHERE device_id = ? ORDER BY updated_at DESC').all(device_id);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/conversations/:id/messages', (req, res) => {
  const { id } = req.params;
  try {
    const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/conversations/:id/messages', (req, res) => {
  const { id } = req.params;
  const { role, content } = req.body;
  if (!role || !content) return res.status(400).json({ error: 'role et content requis' });
  try {
    db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)').run(id, role, content);
    db.prepare('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SYMPTOMES MAPPING =====
const { rechercherParSymptome, getTousSymptomes, normaliser } = require('./symptomes');

// Endpoint recherche par symptome


app.listen(process.env.PORT || PORT, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let localIP = 'localhost';
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
      }
    }
  }
  console.log(`Serveur PhytoHelp lancé sur http://${localIP}:${PORT}`);
});

// Endpoint recherche par symptome
// Endpoint recherche par symptome
app.get('/api/plantes/symptome', (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Parametre q manquant' });
  
  const nomsPlantes = rechercherParSymptome(q);
  
  if (nomsPlantes.length === 0) {
    return res.json({ symptome: q, plantes: [], message: 'Aucune plante trouvee pour ce symptome' });
  }
  
  try {
    // Chargement de toutes les plantes + filtrage cote JS (robuste aux accents)
    const allPlants = db.prepare('SELECT * FROM plants').all();
    
    const results = allPlants.filter(plant => {
      const normalizedName = normaliser(plant.name || '');
      const normalizedDesc = normaliser(plant.description || '');
      const normalizedUsage = normaliser(plant.usage || '');
      
      return nomsPlantes.some(nom => 
        normalizedName.includes(nom) || 
        normalizedDesc.includes(nom) || 
        normalizedUsage.includes(nom)
      );
    });
    
    res.json({ symptome: q, count: results.length, plantes: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/symptomes', (req, res) => {
  res.json(getTousSymptomes());
});
