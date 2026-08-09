// ============================================
// MAPPING SYMPTÔMES → PLANTES
// KNaturopathy Backend
// ============================================

const symptomePlantes = {
  // ALLERGIES & IMMUNITÉ
  'allergie': ['camomille', 'fenugrec', 'echinacee', 'thym', 'propolis'],
  'allergies': ['camomille', 'fenugrec', 'echinacee', 'thym', 'propolis'],
  'rhinite': ['thym', 'eucalyptus', 'camomille', 'propolis'],
  'rhume des foins': ['thym', 'eucalyptus', 'camomille', 'propolis'],
  
  // ARTICULATIONS & DOULEURS
  'arthrose': ['curcuma', 'gingembre', 'boswellia', 'harpagophytum'],
  'arthrite': ['curcuma', 'gingembre', 'boswellia', 'harpagophytum'],
  'articulation': ['curcuma', 'gingembre', 'harpagophytum', 'boswellia'],
  'douleur articulaire': ['curcuma', 'gingembre', 'harpagophytum'],
  'rhumatisme': ['curcuma', 'gingembre', 'harpagophytum', 'boswellia'],
  'sciatique': ['harpagophytum', 'curcuma', 'gingembre', 'passiflore'],
  'lumbago': ['harpagophytum', 'curcuma', 'gingembre'],
  'tendinite': ['harpagophytum', 'curcuma', 'gingembre', 'boswellia'],
  'douleur': ['curcuma', 'gingembre', 'arnica', 'harpagophytum'],
  'migraine': ['feuille de cassis', 'gingembre', 'menthe', 'passiflore'],
  'mal de tete': ['feuille de cassis', 'gingembre', 'menthe', 'passiflore'],
  'mal de tête': ['feuille de cassis', 'gingembre', 'menthe', 'passiflore'],
  
  // SOMMEIL & NERFS
  'insomnie': ['camomille', 'valeriane', 'lavande', 'passiflore', 'melisse'],
  'sommeil': ['camomille', 'valeriane', 'lavande', 'passiflore', 'melisse'],
  'dormir': ['camomille', 'valeriane', 'lavande', 'passiflore'],
  'stress': ['melisse', 'passiflore', 'rhodiola', 'ashwagandha', 'ginseng'],
  'anxiete': ['melisse', 'passiflore', 'camomille', 'valeriane', 'lavande'],
  'anxiété': ['melisse', 'passiflore', 'camomille', 'valeriane', 'lavande'],
  'angoisse': ['passiflore', 'melisse', 'camomille', 'valeriane'],
  'depression': ['millepertuis', 'rhodiola', 'saffran', 'ashwagandha'],
  'dépression': ['millepertuis', 'rhodiola', 'saffran', 'ashwagandha'],
  'fatigue': ['ginseng', 'rhodiola', 'guarana', 'gingembre', 'echinacee'],
  'burn out': ['ginseng', 'rhodiola', 'ashwagandha', 'melisse'],
  'crise de nerfs': ['passiflore', 'valeriane', 'melisse', 'camomille'],
  'palpitation': ['aubepine', 'passiflore', 'valeriane', 'melisse'],
  'palpitations': ['aubepine', 'passiflore', 'valeriane', 'melisse'],
  
  // DIGESTION
  'ballonnement': ['fenouil', 'anis', 'menthe', 'gingembre', 'cumin'],
  'ballonement': ['fenouil', 'anis', 'menthe', 'gingembre'],
  'ventre': ['fenouil', 'anis', 'menthe', 'gingembre', 'camomille'],
  'digestion': ['menthe', 'fenouil', 'anis', 'gingembre', 'artichaut', 'camomille'],
  'estomac': ['menthe', 'gingembre', 'camomille', 'mauve', 'reglisse'],
  'nausée': ['gingembre', 'menthe', 'citron'],
  'nausee': ['gingembre', 'menthe', 'citron'],
  'vomissement': ['gingembre', 'menthe'],
  'reflux': ['mauve', 'reglisse', 'camomille', 'gingembre'],
  'brulure estomac': ['mauve', 'reglisse', 'camomille'],
  'brûlure estomac': ['mauve', 'reglisse', 'camomille'],
  'ulcere': ['mauve', 'reglisse', 'camomille', 'plantain'],
  'ulcère': ['mauve', 'reglisse', 'camomille', 'plantain'],
  'constipation': ['senna', 'cassia', 'aloé', 'pruneau', 'psyllium'],
  'diarrhee': ['argile', 'bleuets', 'camomille', 'gingembre'],
  'diarrhée': ['argile', 'bleuets', 'camomille', 'gingembre'],
  'gaz': ['fenouil', 'anis', 'menthe', 'gingembre', 'cumin'],
  'flatulence': ['fenouil', 'anis', 'menthe', 'gingembre', 'cumin'],
  'aerophagie': ['fenouil', 'anis', 'menthe', 'gingembre'],
  'aérophagie': ['fenouil', 'anis', 'menthe', 'gingembre'],
  'transit': ['psyllium', 'graines de lin', 'chia', 'avoine', 'senna'],
  'foie': ['artichaut', 'chardon-marie', 'desmodium', 'pissenlit'],
  'detox': ['pissenlit', 'chardon-marie', 'ortie', 'artichaut'],
  'détox': ['pissenlit', 'chardon-marie', 'ortie', 'artichaut'],
  'reins': ['bardane', 'ortie', 'pissenlit', 'queue de cerise'],
  'cystite': ['busserole', 'myrtille', 'bardane', 'pissenlit'],
  'infection urinaire': ['busserole', 'myrtille', 'bardane', 'pissenlit'],
  
  // RESPIRATOIRE
  'toux': ['thym', 'eucalyptus', 'guimauve', 'pin', 'mauve'],
  'rhume': ['echinacee', 'thym', 'eucalyptus', 'gingembre', 'propolis'],
  'grippe': ['echinacee', 'thym', 'gingembre', 'propolis'],
  'asthme': ['thym', 'eucalyptus', 'guimauve', 'gingembre'],
  'bronchite': ['thym', 'eucalyptus', 'guimauve', 'propolis'],
  'sinusite': ['thym', 'eucalyptus', 'propolis'],
  'angine': ['echinacee', 'propolis', 'sauge', 'thym'],
  'gorge': ['mauve', 'reglisse', 'camomille', 'sauge', 'propolis'],
  'mal de gorge': ['mauve', 'reglisse', 'camomille', 'sauge', 'propolis'],
  'fievre': ['echinacee', 'thym', 'gingembre', 'propolis', 'sauge'],
  'fièvre': ['echinacee', 'thym', 'gingembre', 'propolis', 'sauge'],
  
  // PEAU & CHEVEUX
  'peau': ['aloé', 'calendula', 'tea tree', 'argan', 'rose musquée'],
  'acne': ['tea tree', 'aloé', 'calendula'],
  'acné': ['tea tree', 'aloé', 'calendula'],
  'brulure': ['aloé', 'calendula', 'arnica', 'hamamelis'],
  'brûlure': ['aloé', 'calendula', 'arnica', 'hamamelis'],
  'coupure': ['aloé', 'calendula', 'arnica', 'plantain'],
  'cicatrice': ['aloé', 'calendula', 'rose musquée', 'huile d argan'],
  'vergeture': ['rose musquée', 'calendula', 'aloé', 'huile d argan'],
  'vergétur': ['rose musquée', 'calendula', 'aloé', 'huile d argan'],
  'psoriasis': ['aloé', 'bardane', 'curcuma', 'huile d argan'],
  'eczema': ['aloé', 'calendula', 'bardane', 'huile d argan'],
  'eczéma': ['aloé', 'calendula', 'bardane', 'huile d argan'],
  'demangeaison': ['camomille', 'calendula', 'bardane', 'aloé', 'mauve'],
  'démangeaison': ['camomille', 'calendula', 'bardane', 'aloé', 'mauve'],
  'prurit': ['camomille', 'calendula', 'bardane', 'aloé', 'mauve'],
  'piqure': ['calendula', 'plantain', 'mauve', 'aloé'],
  'piqûre': ['calendula', 'plantain', 'mauve', 'aloé'],
  'piqure insecte': ['calendula', 'plantain', 'mauve', 'aloé'],
  'herpes': ['melisse', 'propolis', 'tea tree'],
  'herpès': ['melisse', 'propolis', 'tea tree'],
  'cheveux': ['ortie', 'romarin', 'bourrache', 'huile d argan'],
  'chute cheveux': ['ortie', 'romarin', 'bourrache', 'huile d argan'],
  'pellicule': ['ortie', 'romarin', 'tea tree', 'propolis'],
  'pellicules': ['ortie', 'romarin', 'tea tree', 'propolis'],
  'ongles': ['ortie', 'levure de bière', 'silice'],
  
  // INFECTIONS
  'infection': ['echinacee', 'propolis', 'tea tree', 'thym', 'ail'],
  'bacterie': ['tea tree', 'propolis', 'echinacee', 'ail'],
  'bactérie': ['tea tree', 'propolis', 'echinacee', 'ail'],
  'virus': ['echinacee', 'propolis', 'thym', 'ail'],
  'champignon': ['tea tree', 'pamplemousse', 'ail'],
  'mycose': ['tea tree', 'pamplemousse', 'ail'],
  'candida': ['ail', 'pamplemousse', 'tea tree', 'propolis'],
  'parasites': ['ail', 'noix noir', 'pissenlit', 'pamplemousse'],
  'vermifuge': ['ail', 'noix noir', 'pissenlit', 'pamplemousse'],
  
  // CŒUR & CIRCULATION
  'cholesterol': ['artichaut', 'ail', 'levure de riz rouge', 'curcuma'],
  'cholestérol': ['artichaut', 'ail', 'levure de riz rouge', 'curcuma'],
  'hypertension': ['ail', 'olivier', 'aubepine'],
  'tension': ['ail', 'olivier', 'aubepine', 'passiflore'],
  'circulation': ['vigne rouge', 'ginkgo', 'aubepine', 'hamamelis'],
  'jambes lourdes': ['vigne rouge', 'hamamelis', 'aubepine'],
  'varices': ['vigne rouge', 'hamamelis', 'aubepine'],
  'hemorroides': ['hamamelis', 'vigne rouge', 'calendula'],
  'hémorroïdes': ['hamamelis', 'vigne rouge', 'calendula'],
  'anemie': ['ortie', 'fenugrec', 'ail', 'levure de bière'],
  'anémie': ['ortie', 'fenugrec', 'ail', 'levure de bière'],
  'sang': ['ail', 'ginkgo', 'aubepine', 'ortie', 'vigne rouge'],
  
  // MÉTABOLISME & POIDS
  'diabete': ['fenugrec', 'cannelle', 'gymnema', 'olivier'],
  'diabète': ['fenugrec', 'cannelle', 'gymnema', 'olivier'],
  'glycemie': ['gymnema', 'cannelle', 'fenugrec', 'olivier'],
  'glycémie': ['gymnema', 'cannelle', 'fenugrec', 'olivier'],
  'insuline': ['gymnema', 'cannelle', 'fenugrec', 'olivier'],
  'surpoids': ['the vert', 'guarana', 'garcinia', 'cannelle', 'nigelle'],
  'obesite': ['the vert', 'guarana', 'garcinia', 'cannelle', 'nigelle'],
  'obésité': ['the vert', 'guarana', 'garcinia', 'cannelle', 'nigelle'],
  'minceur': ['the vert', 'guarana', 'garcinia', 'cannelle'],
  'poids': ['the vert', 'guarana', 'garcinia', 'cannelle', 'nigelle'],
  'cellulite': ['vigne rouge', 'pissenlit', 'bardane'],
  'metabolisme': ['the vert', 'guarana', 'cannelle', 'gingembre'],
  'métabolisme': ['the vert', 'guarana', 'cannelle', 'gingembre'],
  'appetit': ['gentiane', 'fenouil', 'anis', 'gingembre'],
  'appétit': ['gentiane', 'fenouil', 'anis', 'gingembre'],
  
  // FOIE & DÉTOX
  'hepatite': ['chardon-marie', 'artichaut', 'desmodium', 'curcuma'],
  'hépatite': ['chardon-marie', 'artichaut', 'desmodium', 'curcuma'],
  'cirrhose': ['chardon-marie', 'artichaut', 'desmodium'],
  'vesicule': ['artichaut', 'chardon-marie', 'desmodium', 'curcuma'],
  'vésicule': ['artichaut', 'chardon-marie', 'desmodium', 'curcuma'],
  'calcul': ['queue de cerise', 'pissenlit', 'bardane', 'ortie'],
  'pierre': ['queue de cerise', 'pissenlit', 'bardane', 'ortie'],
  'goutte': ['bardane', 'pissenlit', 'queue de cerise', 'harpagophytum'],
  'acide urique': ['bardane', 'pissenlit', 'queue de cerise', 'harpagophytum'],
  
  // CERVEAU & MÉMOIRE
  'memoire': ['ginkgo', 'bacopa', 'ginseng', 'romarin'],
  'mémoire': ['ginkgo', 'bacopa', 'ginseng', 'romarin'],
  'concentration': ['ginkgo', 'ginseng', 'rhodiola', 'bacopa'],
  'cerveau': ['ginkgo', 'bacopa', 'curcuma', 'gingembre', 'romarin'],
  'alzheimer': ['ginkgo', 'bacopa', 'curcuma', 'gingembre'],
  'parkinson': ['mucuna', 'curcuma', 'gingembre', 'ginkgo'],
  
  // HORMONES & FEMME
  'menopause': ['sauge', 'actée', 'soja'],
  'ménopause': ['sauge', 'actée', 'soja'],
  'regles': ['sauge', 'achillee', 'alchémille', 'camomille'],
  'règles': ['sauge', 'achillee', 'alchémille', 'camomille'],
  'regles douloureuses': ['achillee', 'sauge', 'camomille'],
  'libido': ['ginseng', 'maca', 'tribulus', 'gingembre'],
  'prostate': ['sabal', 'ortie', 'courge', 'pygeum'],
  'erection': ['ginseng', 'maca', 'tribulus', 'gingembre'],
  'érection': ['ginseng', 'maca', 'tribulus', 'gingembre'],
  'fertilite': ['maca', 'ginseng', 'tribulus', 'sauge'],
  'fertilité': ['maca', 'ginseng', 'tribulus', 'sauge'],
  'grossesse': ['gingembre', 'menthe', 'fenouil', 'camomille'],
  'allaitement': ['fenugrec', 'fenouil', 'anis', 'sauge'],
  'thyroide': ['fucus', 'ashwagandha', 'laminaria', 'bugle'],
  'thyroïde': ['fucus', 'ashwagandha', 'laminaria', 'bugle'],
  
  // IMMUNITÉ
  'immunite': ['echinacee', 'propolis', 'ginseng', 'shiitake', 'ail'],
  'immunité': ['echinacee', 'propolis', 'ginseng', 'shiitake', 'ail'],
  'cancer': ['curcuma', 'ail', 'echinacee', 'propolis', 'shiitake'],
  
  // YEUX
  'yeux': ['euphraise', 'myrtille', 'ginkgo', 'calendula'],
  'vue': ['euphraise', 'myrtille', 'ginkgo'],
  'cataracte': ['euphraise', 'myrtille', 'ginkgo', 'calendula'],
  
  // INFLAMMATION
  'inflammation': ['curcuma', 'gingembre', 'boswellia', 'ail'],
  'fibromyalgie': ['curcuma', 'gingembre', 'passiflore', 'valeriane'],
  
  // OREILLES
  'acouphene': ['gingembre', 'ginkgo', 'melisse', 'passiflore'],
  'acouphène': ['gingembre', 'ginkgo', 'melisse', 'passiflore'],
  'vertige': ['gingembre', 'ginkgo', 'melisse', 'passiflore'],
  'vertiges': ['gingembre', 'ginkgo', 'melisse', 'passiflore'],
  
  // DIVERS
  'crampes': ['magnesium', 'passiflore', 'achillee', 'gingembre'],
  'entorse': ['arnica', 'harpagophytum', 'curcuma', 'gingembre'],
  'fracture': ['consoude', 'arnica', 'harpagophytum', 'curcuma'],
  'ostéoporose': ['ortie', 'fenugrec', 'consoude', 'harpagophytum'],
  'osteoporose': ['ortie', 'fenugrec', 'consoude', 'harpagophytum'],
  'antioxydant': ['the vert', 'acai', 'groseille', 'argousier', 'curcuma'],
  'omega 3': ['bourrache', 'huile d argan', 'graines de lin', 'chia'],
  'oméga 3': ['bourrache', 'huile d argan', 'graines de lin', 'chia'],
  'probiotique': ['levure de bière', 'kombucha', 'kéfir', 'choucroute'],
  'vitamine': ['argousier', 'groseille', 'acai', 'acerola', 'baobab']
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function normaliser(texte) {
  if (!texte) return '';
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // enlève accents
    .replace(/[^a-z0-9\s]/g, '')      // garde lettres, chiffres, espaces
    .trim();
}

function rechercherParSymptome(symptome) {
  const normalise = normaliser(symptome);
  
  // Recherche exacte d'abord
  if (symptomePlantes[normalise]) {
    return [...new Set(symptomePlantes[normalise])];
  }
  
  // Recherche partielle (si l'utilisateur tape "mal de..." ou autre)
  for (const [cle, plantes] of Object.entries(symptomePlantes)) {
    if (normalise.includes(cle) || cle.includes(normalise)) {
      return [...new Set(plantes)];
    }
  }
  
  return [];
}

function getTousSymptomes() {
  return Object.keys(symptomePlantes).sort();
}

module.exports = {
  symptomePlantes,
  normaliser,
  rechercherParSymptome,
  getTousSymptomes
};
