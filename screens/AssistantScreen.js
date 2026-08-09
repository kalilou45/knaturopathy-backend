import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const API_URL = 'http://192.0.0.2:5001';

export default function AssistantScreen({ onBack }) {
  const [question, setQuestion] = useState('');
  const [reponse, setReponse] = useState('');
  const [loading, setLoading] = useState(false);

  const poserQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setReponse(data.answer || data.error || "Réponse vide");
    } catch (error) {
      console.error(error);
      setReponse('Erreur : impossible de contacter l’assistant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🌿 Assistant Naturopathe</Text>
      <Text style={styles.subtitle}>Posez votre question sur les plantes, la santé naturelle, etc.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Que dit votre formation sur le curcuma ?"
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={poserQuestion} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Envoyer'}</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />}

      {reponse !== '' && (
        <View style={styles.reponseContainer}>
          <Text style={styles.reponseTitle}>Réponse :</Text>
          <Text style={styles.reponseText}>{reponse}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  backButton: { marginBottom: 10, paddingVertical: 10 },
  backButtonText: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 15, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#4CAF50', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loader: { marginVertical: 20 },
  reponseContainer: { backgroundColor: '#E8F5E9', borderRadius: 10, padding: 15, marginTop: 10 },
  reponseTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10 },
  reponseText: { fontSize: 16, color: '#333', lineHeight: 24 },
});
