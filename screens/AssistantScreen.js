import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Image, PanResponder, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import Constants from 'expo-constants';

const API_URL = 'https://knaturopathy-backend.onrender.com';

export default function AssistantScreen({ onBack, conversationId, onShowHistory, deviceId }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const scrollViewRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx > 20 && Math.abs(gestureState.dy) < 40;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 80) onBack();
      },
    })
  ).current;

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const loadMessages = async (convId) => {
    try {
      const res = await fetch(`${API_URL}/api/conversations/${convId}/messages`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    }
  };

  const poserQuestion = async () => {
    if (!question.trim()) return;
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg.content,
          conversation_id: currentConversationId || null,
          device_id: deviceId,
        }),
      });
      const data = await response.json();
      const assistantMsg = { role: 'assistant', content: data.reponse || data.error || "Désolé, je n'ai pas pu répondre." };
      setMessages(prev => [...prev, assistantMsg]);
      
      if (data.conversation_id && !currentConversationId) {
        setCurrentConversationId(data.conversation_id);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur : impossible de contacter K Naturo" }]);
    } finally {
      setLoading(false);
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setQuestion('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
      {...panResponder.panHandlers}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Image source={require('../assets/logo.jpeg')} style={styles.headerLogo} />
        <Text style={styles.headerTitle}>K Naturo</Text>
        <TouchableOpacity onPress={onShowHistory} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>📜</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <Text style={styles.emptyText}>Posez votre première question sur les plantes médicinales...</Text>
        )}
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text style={msg.role === 'user' ? styles.userText : styles.assistantText}>
              {msg.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingBubble}>
            <Animated.Image
              source={require('../assets/logo.jpeg')}
              style={[styles.loaderLogo, { transform: [{ rotate: spin }] }]}
            />
            <Text style={styles.loadingText}>K Naturo réfléchit...</Text>
          </View>
        )}
      </ScrollView>

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
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={poserQuestion}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.newConvButton} onPress={startNewConversation}>
        <Text style={styles.newConvButtonText}>+ Nouvelle conversation</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 15, paddingBottom: 10,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd',
  },
  headerButton: { padding: 8 },
  headerButtonText: { fontSize: 20 },
  headerLogo: { width: 32, height: 32, borderRadius: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1B4332', flex: 1, textAlign: 'center' },
  messagesContainer: { flex: 1, paddingHorizontal: 12, paddingTop: 10 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontStyle: 'italic' },
  messageBubble: { maxWidth: '85%', padding: 12, borderRadius: 16, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2D6A4F', borderBottomRightRadius: 4 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#ddd' },
  userText: { color: '#fff', fontSize: 15, lineHeight: 20 },
  assistantText: { color: '#333', fontSize: 15, lineHeight: 20 },
  loadingBubble: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', padding: 10, borderRadius: 12, marginBottom: 10 },
  loadingText: { color: '#2D6A4F', fontStyle: 'italic' },
  loaderLogo: { width: 50, height: 50, borderRadius: 25, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd',
  },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendButton: { marginLeft: 10, backgroundColor: '#2D6A4F', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#8FB3A0' },
  sendButtonText: { color: '#fff', fontSize: 18 },
  newConvButton: { backgroundColor: '#fff', paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee' },
  newConvButtonText: { color: '#2D6A4F', fontWeight: '600' },
});
