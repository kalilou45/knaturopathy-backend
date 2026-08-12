import SplashScreen from './screens/SplashScreen';

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, ScrollView
} from 'react-native';
import AssistantScreen from './screens/AssistantScreen';
import { Share } from 'react-native';

const API_URL = 'https://knaturopathy-backend.onrender.com';

export default function App() {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showSplash, setShowSplash] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [viewAssistant, setViewAssistant] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const res = await fetch(`${API_URL}/api/plants`);
      const data = await res.json();
      setPlants(data);
    } catch (err) {
      console.error('Erreur fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchPlants = async () => {
    if (!searchQuery.trim()) {
      fetchPlants();
      return;
    }
    setLoading(true);
    try {
      // 1. Essaie recherche par symptome
      const resSymptome = await fetch(`${API_URL}/api/plantes/symptome?q=${encodeURIComponent(searchQuery)}`);
      const dataSymptome = await resSymptome.json();
      
      if (dataSymptome.plantes && dataSymptome.plantes.length > 0) {
        setPlants(dataSymptome.plantes);
        return;
      }
      
      // 2. Fallback : recherche normale par nom
      const res = await fetch(`${API_URL}/api/search?q=${searchQuery}`);
      const data = await res.json();
      setPlants(data);
    } catch (err) {
      console.error('Erreur recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  
  const loadFavorites = () => {
    // Stockage memoire uniquement pour l'instant
    setFavorites([]);
  };

  const toggleFavorite = (plant) => {
    const isFav = favorites.some(f => f.id === plant.id);
    const updated = isFav 
      ? favorites.filter(f => f.id !== plant.id)
      : [...favorites, plant];
    setFavorites(updated);
  };

  const sharePlant = async (plant) => {
    try {
      await Share.share({
        message: `🌿 ${plant.name} — ${plant.description}\n\nUsage: ${plant.usage}\n\nDécouvre plus sur K Naturopathy !`,
      });
    } catch (e) { console.error(e); }
  };

const getImage = (imageFile) => {
    if (!imageFile) return null;
    const clean = imageFile.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const images = {
      'absinthe': require('./assets/characters/absinthe.jpeg'),
      'acanthe': require('./assets/characters/acanthe.jpeg'),
      'acerola': require('./assets/characters/acerola.jpeg'),
      'achillee': require('./assets/characters/achillee.jpeg'),
      'aloe': require('./assets/characters/aloe.jpeg'),
      'angelique': require('./assets/characters/angelique.jpeg'),
      'anis': require('./assets/characters/anis.jpeg'),
      'arnica': require('./assets/characters/arnica.jpeg'),
      'ashwagandha': require('./assets/characters/ashwagandha.jpeg'),
      'aubepine': require('./assets/characters/aubepine.jpeg'),
      'baobab': require('./assets/characters/baobab.jpeg'),
      'bardane': require('./assets/characters/bardane.jpeg'),
      'basilic': require('./assets/characters/basilic.jpeg'),
      'boldo': require('./assets/characters/boldo.jpeg'),
      'bourrache': require('./assets/characters/bourrache.jpeg'),
      'cacao': require('./assets/characters/cacao.jpeg'),
      'camomille': require('./assets/characters/camomille.jpeg'),
      'camucamu': require('./assets/characters/camucamu.jpeg'),
      'cannelle': require('./assets/characters/cannelle.jpeg'),
      'cardamome': require('./assets/characters/cardamome.jpeg'),
      'cassis': require('./assets/characters/cassis.jpeg'),
      'chardon': require('./assets/characters/chardon.jpeg'),
      'chataignier': require('./assets/characters/chataignier.jpeg'),
      'chiendent': require('./assets/characters/chiendent.jpeg'),
      'chlorella': require('./assets/characters/chlorella.jpeg'),
      'citronnelle': require('./assets/characters/citronnelle.jpeg'),
      'coco': require('./assets/characters/coco.jpeg'),
      'coquelicot': require('./assets/characters/coquelicot.jpeg'),
      'cordyceps': require('./assets/characters/cordyceps.jpeg'),
      'coriandre': require('./assets/characters/coriandre.jpeg'),
      'cumin': require('./assets/characters/cumin.jpeg'),
      'curcuma': require('./assets/characters/curcuma.jpeg'),
      'curry': require('./assets/characters/curry.jpeg'),
      'echinacee': require('./assets/characters/echinacee.jpeg'),
      'eleutherocoque': require('./assets/characters/eleutherocoque.jpeg'),
      'estragon': require('./assets/characters/estragon.jpeg'),
      'eucalyptus': require('./assets/characters/eucalyptus.jpeg'),
      'eupatoire': require('./assets/characters/eupatoire.jpeg'),
      'fenouil': require('./assets/characters/fenouil.jpeg'),
      'fenugrec': require('./assets/characters/fenugrec.jpeg'),
      'framboisier': require('./assets/characters/framboisier.jpeg'),
      'fumeterre': require('./assets/characters/fumeterre.jpeg'),
      'galega': require('./assets/characters/galega.jpeg'),
      'gentiane': require('./assets/characters/gentiane.jpeg'),
      'gingembre': require('./assets/characters/gingembre.jpeg'),
      'ginkgo': require('./assets/characters/ginkgo.jpeg'),
      'ginseng': require('./assets/characters/ginseng.jpeg'),
      'girofle': require('./assets/characters/girofle.jpeg'),
      'goji': require('./assets/characters/goji.jpeg'),
      'grindelia': require('./assets/characters/grindelia.jpeg'),
      'hamamelis': require('./assets/characters/hamamelis.jpeg'),
      'haricot': require('./assets/characters/haricot.jpeg'),
      'harpagophytum': require('./assets/characters/harpagophytum.jpeg'),
      'hibiscus': require('./assets/characters/hibiscus.jpeg'),
      'houblon': require('./assets/characters/houblon.jpeg'),
      'hydraste': require('./assets/characters/hydraste.jpeg'),
      'karkade': require('./assets/characters/karkade.jpeg'),
      'lavande': require('./assets/characters/lavande.jpeg'),
      'lierre': require('./assets/characters/lierre.jpeg'),
      'lin': require('./assets/characters/lin.jpeg'),
      'lupin': require('./assets/characters/lupin.jpeg'),
      'maca': require('./assets/characters/maca.jpeg'),
      'marjolaine': require('./assets/characters/marjolaine.jpeg'),
      'mate': require('./assets/characters/mate.jpeg'),
      'mauve': require('./assets/characters/mauve.jpeg'),
      'melilot': require('./assets/characters/melilot.jpeg'),
      'melisse': require('./assets/characters/melisse.jpeg'),
      'menthe': require('./assets/characters/menthe.jpeg'),
      'millepertuis': require('./assets/characters/millepertuis.jpeg'),
      'moringa': require('./assets/characters/moringa.jpeg'),
      'myrtille': require('./assets/characters/myrtille.jpeg'),
      'noyer': require('./assets/characters/noyer.jpeg'),
      'olive': require('./assets/characters/olive.jpeg'),
      'ortie': require('./assets/characters/ortie.jpeg'),
      'palmier': require('./assets/characters/palmier.jpeg'),
      'pamplemousse': require('./assets/characters/pamplemousse.jpeg'),
      'papaye': require('./assets/characters/papaye.jpeg'),
      'passiflore': require('./assets/characters/passiflore.jpeg'),
      'persil': require('./assets/characters/persil.jpeg'),
      'petasite': require('./assets/characters/petasite.jpeg'),
      'pin': require('./assets/characters/pin.jpeg'),
      'pissenlit': require('./assets/characters/pissenlit.jpeg'),
      'plantain': require('./assets/characters/plantain.jpeg'),
      'polygala': require('./assets/characters/polygala.jpeg'),
      'prele': require('./assets/characters/prele.jpeg'),
      'quassia': require('./assets/characters/quassia.jpeg'),
      'reglisse': require('./assets/characters/reglisse.jpeg'),
      'reishi': require('./assets/characters/reishi.jpeg'),
      'rhodiola': require('./assets/characters/rhodiola.jpeg'),
      'romarin': require('./assets/characters/romarin.jpeg'),
      'sauge': require('./assets/characters/sauge.jpeg'),
      'schisandra': require('./assets/characters/schisandra.jpeg'),
      'spiruline': require('./assets/characters/spiruline.jpeg'),
      'thym': require('./assets/characters/thym.jpeg'),
      'tilleul': require('./assets/characters/tilleul.jpeg'),
      'tribulus': require('./assets/characters/tribulus.jpeg'),
      'valeriane': require('./assets/characters/valeriane.jpeg'),
      'vergedor': require('./assets/characters/vergedor.jpeg')
    };

    for (const [key, img] of Object.entries(images)) {
      if (clean.includes(key)) return img;
    }
    return null;
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (viewAssistant) {
    return <AssistantScreen onBack={() => setViewAssistant(false)} />;
  }

  
        {view === 'favorites' && (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => setView('home')} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Retour</Text>
            </TouchableOpacity>
            <Text style={styles.header}>❤️ Mes Favoris</Text>
            <Text style={styles.subHeader}>Vos plantes sauvegardées</Text>
            {favorites.length === 0 ? (
              <Text style={styles.emptyText}>Aucune plante en favoris. Cliquez sur ❤️ dans une fiche pour en ajouter !</Text>
            ) : (
              <ScrollView>
                <View style={styles.grid}>
                  {favorites.map(plant => (
                    <TouchableOpacity key={plant.id} style={[styles.plantCard, favorites.some(f => f.id === plant.id) && styles.plantCardFavorited]} onPress={() => { setSelectedPlant(plant); setView('detail'); }}>
                      {plant.image_file && getImage(plant.image_file) && (
                        <Image source={getImage(plant.image_file)} style={styles.cardImage} />
                      )}
                      <Text style={styles.cardName}>{plant.name}</Text>
                      <Text style={styles.cardDesc} numberOfLines={2}>{plant.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        )}

if (view === 'detail' && selectedPlant) {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setView('home')} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <View style={styles.detailCard}>
          {selectedPlant.image_file && getImage(selectedPlant.image_file) && (
            <Image source={getImage(selectedPlant.image_file)} style={styles.detailImage} />
          )}
          {selectedPlant.image_real && (
            <Image source={{ uri: `${API_URL}/real/${selectedPlant.image_real}` }} style={styles.realImage} />
          )}
          <Text style={styles.detailName}>{selectedPlant.name}</Text>
          <Text style={styles.detailDescription}>{selectedPlant.description}</Text>
          <Text style={styles.sectionTitle}>💡 Usage</Text>
          <Text style={styles.detailText}>{selectedPlant.usage}</Text>
          <Text style={styles.sectionTitle}>⚠️ Contre-indications</Text>
          <Text style={styles.detailText}>{selectedPlant.contraindications}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => toggleFavorite(selectedPlant)} style={styles.favButton}>
              <Text style={styles.favButtonText}>
                {favorites.some(f => f.id === selectedPlant.id) ? '❤️ Favori' : '🤍 Ajouter aux favoris'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sharePlant(selectedPlant)} style={styles.shareButton}>
              <Text style={styles.shareButtonText}>📤 Partager</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('./assets/logo.jpeg')} style={styles.headerLogo} />
        <Text style={styles.header}>K Naturopathy</Text>
      </View>
      <Text style={styles.subHeader}>La clé de ta santé naturelle</Text>

      <TouchableOpacity onPress={() => setViewAssistant(true)} style={styles.assistantButton}>
        <Text style={styles.assistantButtonText}>Consulter l'assistant</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher un symptôme..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchPlants}
        />
        <TouchableOpacity onPress={searchPlants} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.favNavButton} onPress={() => setView('favorites')}>
        <Text style={styles.favNavButtonText}>❤️ Mes Favoris ({favorites.length})</Text>
      </TouchableOpacity>

      <FlatList extraData={favorites}
        data={plants}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.plantCard, favorites.some(f => f.id === item.id) && styles.plantCardFavorited]} onPress={() => { setSelectedPlant(item); setView('detail'); }}>
            {item.image_file && getImage(item.image_file) && (
              <Image source={getImage(item.image_file)} style={styles.plantImage} />
            )}
            <Text style={styles.plantName}>{item.name}</Text>
            <Text style={styles.plantDesc} numberOfLines={2}>{item.description}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune plante trouvée</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 50, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 5 },
  headerLogo: { width: 42, height: 42, borderRadius: 21, marginRight: 12, borderWidth: 2, borderColor: '#2D6A4F' },
  header: { fontSize: 28, fontWeight: '700', color: '#1B4332', textAlign: 'center', letterSpacing: 1 },
  subHeader: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 10 },
  assistantButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 25, marginBottom: 15, alignItems: 'center' },
  assistantButtonText: { color: '#fff', fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, height: 45, marginRight: 10 },
  searchButton: { backgroundColor: '#4CAF50', borderRadius: 10, width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
  searchButtonText: { fontSize: 20, color: '#fff' },
  row: { justifyContent: 'space-between' },
  plantCard: { backgroundColor: '#fff', borderRadius: 15, padding: 12, marginBottom: 16, width: '48%', alignItems: 'center' },
  plantCardFavorited: { backgroundColor: '#FFE4E8', borderColor: '#C75B39', borderWidth: 2 },
  plantImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  plantName: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  plantDesc: { fontSize: 12, color: '#666', textAlign: 'center' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
  backButton: { marginBottom: 20, paddingVertical: 10 },
  backText: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold' },
  detailCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 30 },
  detailImage: { width: 150, height: 150, borderRadius: 75, alignSelf: 'center', marginBottom: 15 },
  realImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20, resizeMode: 'cover' },
  detailName: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 15 },
  detailDescription: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 8 },
  detailText: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 15 },

  favNavButton: { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#C75B39', padding: 12, borderRadius: 25, marginTop: 10, alignItems: 'center', marginHorizontal: 20, marginBottom: 10 },
  favNavButtonText: { color: '#C75B39', fontWeight: 'bold', fontSize: 16 },

});