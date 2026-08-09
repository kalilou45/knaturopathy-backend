#!/bin/bash
IP=$(ipconfig getifaddr en0)
echo "IP detectee: $IP"
sed -i '' "s|const API_URL = '.*'|const API_URL = 'http://$IP:3000'|" App.js
sed -i '' "s|const API_URL = '.*'|const API_URL = 'http://$IP:3000'|" screens/AssistantScreen.js
echo "App.js mis a jour avec $IP:3000"
echo "AssistantScreen.js mis a jour avec $IP:3000"
