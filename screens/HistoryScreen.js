import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';

const API_URL = 'https://knaturopathy-backend.onrender.com';

export default function HistoryScreen({ onBack, onOpenConversation, deviceId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/conversations?device_id=${encodeURIComponent(deviceId)}`);
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement historique:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.convItem}
      onPress={() => onOpenConversation(item.id)}
    >
      <Text style={styles.convTitle} numberOfLines={1}>
        {item.title || 'Conversation sans titre'}
      </Text>
      <Text style={styles.convDate}>{formatDate(item.created_at)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📜 Historique</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2D6A4F" style={{ marginTop: 50 }} />
      ) : conversations.length === 0 ? (
        <Text style={styles.emptyText}>Aucune conversation pour le moment.</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 15, paddingBottom: 15,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd',
  },
  backBtn: { padding: 8 },
  backBtnText: { fontSize: 16, color: '#2D6A4F', fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1B4332' },
  convItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#2D6A4F',
  },
  convTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  convDate: { fontSize: 13, color: '#888' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
});
