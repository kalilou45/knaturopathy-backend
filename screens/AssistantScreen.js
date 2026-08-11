import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  PanResponder,
} from 'react-native';

const API_URL = 'https://knaturopathy-backend.onrender.com';

export default function AssistantScreen({ onBack }) {
  const [question, setQuestion] = useState('');
  const [reponse, setReponse] = useState('');
  const [loading, setLoading] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx > 20 && Math.abs(gestureState.dy) < 40;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 80) {
          onBack();
        }
      },
    })
  ).current;

  const poserQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setReponse('');
    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setReponse(data.reponse || data.error || 'Réponse vide');
    } catch (error) {
      console.error(error);
      setReponse("Erreur : impossible de contacter K Naturo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Animated.View style={styles.content} {...panResponder.panHandlers}>
        {/* Header avec logo */}
        <View style={styles.titleContainer}>
          <Image source={require('../assets/logo.jpeg')} style={styles.titleLogo} />
          <Text style={styles.title}>K Naturo</Text>
        </View>

        <Text style={styles.subtitle}>Posez votre question sur les plantes, la santé naturelle, etc.</Text>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Quelle plante pour dormir mieux ?"
            placeholderTextColor="#888"
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={poserQuestion}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Envoyer'}</Text>
          </TouchableOpacity>
        </View>

        {/* Loader avec logo */}
        {loading && (
          <View style={styles.loaderContainer}>
            <Animated.Image
              source={require('../assets/logo.jpeg')}
              style={styles.loaderLogo}
            />
            <Text style={styles.loaderText}>K Naturo réfléchit...</Text>
          </View>
        )}

        {/* Réponse */}
        {reponse !== '' && !loading && (
          <View style={styles.reponseContainer}>
            <Text style={styles.reponseTitle}>Réponse :</Text>
            <Text style={styles.reponseText}>{reponse}</Text>
          </View>
        )}

        {/* Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  titleLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B4332',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#8FB3A0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loaderLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: '#2D6A4F',
    fontStyle: 'italic',
  },
  reponseContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2D6A4F',
  },
  reponseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 8,
  },
  reponseText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  backButton: {
    marginTop: 30,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2D6A4F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  backButtonText: {
    color: '#2D6A4F',
    fontSize: 16,
    fontWeight: '600',
  },
});
