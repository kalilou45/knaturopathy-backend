#!/bin/bash

APP_DIR="$HOME/Desktop/KNaturopathy"
BACKEND_DIR="$APP_DIR/backend"
VENV="$HOME/Desktop/venv_naturo/bin/activate"

# Vérifie si Ollama tourne déjà
if lsof -i :11434 >/dev/null 2>&1; then
    echo "🧠 Ollama déjà lancé (OK)"
    OLLAMA_CMD="echo 'Ollama déjà actif sur :11434'"
else
    OLLAMA_CMD="ollama serve"
fi

echo "🌿 Ouverture des 4 terminaux KNaturopathy..."

osascript -e 'tell application "Terminal"
    do script "cd '$BACKEND_DIR' && echo \"🧠 === TERMINAL OLLAMA ===\" && echo \"Ne ferme jamais ce terminal.\" && '$OLLAMA_CMD'"
end tell'

sleep 2

osascript -e 'tell application "Terminal"
    do script "cd '$BACKEND_DIR' && echo \"🟢 === TERMINAL BACKEND ===\" && echo \"Port 3000 - API plantes & symptômes\" && node server.js"
end tell'

sleep 1

osascript -e 'tell application "Terminal"
    do script "cd '$BACKEND_DIR' && echo \"🤖 === TERMINAL AGENT ===\" && echo \"Port 5001 - Agent RAG Mistral\" && source '$VENV' && python3 agent_server.py"
end tell'

sleep 1

osascript -e 'tell application "Terminal"
    do script "cd '$APP_DIR' && echo \"📱 === TERMINAL EXPO ===\" && echo \"Scan le QR code avec Expo Go\" && npx expo start"
end tell'

echo ""
echo "✅ 4 terminaux ouverts. Règle d'or :"
echo "   🧠 OLLAMA   = NE JAMAIS FERMER"
echo "   🟢 BACKEND  = Port 3000 (API)"
echo "   🤖 AGENT    = Port 5001 (RAG)"
echo "   📱 EXPO     = Ton appli mobile"
echo ""
echo "Pour tout fermer : pkill -f \"ollama serve\"; pkill -f \"node server.js\"; pkill -f \"agent_server.py\"; pkill -f \"expo start\""
