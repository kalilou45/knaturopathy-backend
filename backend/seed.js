const Database = require('better-sqlite3');
const fs = require('fs');

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

const db = new Database('./data/database.db');

console.log("Initialisation de la base de données...");

db.exec(`
  CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_file TEXT,
    image_url TEXT,
    description TEXT,
    usage TEXT,
    contraindications TEXT
  );
  
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plant_categories (
    plant_id INTEGER,
    category_id INTEGER,
    FOREIGN KEY (plant_id) REFERENCES plants(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS symptoms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    plant_id INTEGER,
    FOREIGN KEY (plant_id) REFERENCES plants(id)
  );
`);

db.exec("DELETE FROM plants; DELETE FROM categories; DELETE FROM symptoms; DELETE FROM plant_categories;");

const categories = [
  { id: 1, name: "Digestion" },
  { id: 2, name: "Sommeil" },
  { id: 3, name: "Immunité" },
  { id: 4, name: "Stress" }
];

const insertCategory = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
categories.forEach(cat => insertCategory.run(cat.id, cat.name));

const plants = [
  {
    id: 1, name: "Ginseng", image_file: "Ginseng.jpeg", image_url: "",
    description: "Plante adaptogène qui aide à lutter contre la fatigue.",
    usage: "En décoction ou en gélules. Cure de 3 à 6 semaines.",
    contraindications: "Insomnie, hypertension, femmes enceintes.",
    categories: [3, 4], symptoms: ["fatigue", "stress", "manque d'énergie"]
  },
  {
    id: 2, name: "Curcuma", image_file: "curcuma.jpeg", image_url: "",
    description: "Anti-inflammatoire naturel puissant.",
    usage: "En cuisine ou en gélules. À associer avec du poivre noir.",
    contraindications: "Calculs biliaires, anticoagulants.",
    categories: [1, 3], symptoms: ["inflammation", "douleurs articulaires"]
  },
  {
    id: 3, name: "Gingembre", image_file: "Gingembre.jpeg", image_url: "",
    description: "Stimulant digestif, anti-nauséeux.",
    usage: "Infusion râpée, en cuisine ou en jus.",
    contraindications: "Calculs biliaires, troubles de la coagulation.",
    categories: [1, 3], symptoms: ["nausées", "ballonnements", "rhume"]
  },
  {
    id: 4, name: "Menthe Poivrée", image_file: "Menthe Poivrée.jpeg", image_url: "",
    description: "Vertus digestives et rafraîchissantes.",
    usage: "Infusion : 1 cuillère à soupe par tasse.",
    contraindications: "Obstruction des voies biliaires.",
    categories: [1], symptoms: ["ballonnements", "nausées", "maux de ventre"]
  },
  {
    id: 5, name: "Camomille", image_file: "Camomille.jpeg", image_url: "",
    description: "Calme l'anxiété, favorise l'endormissement.",
    usage: "Infusion le soir : 1 cuillère à soupe par tasse.",
    contraindications: "Allergie aux astéracées.",
    categories: [2, 4], symptoms: ["insomnie", "anxiété"]
  },
  {
    id: 6, name: "Échinacée", image_file: "echinacee.jpeg", image_url: "",
    description: "Booste les défenses immunitaires.",
    usage: "Cure de 3 semaines maximum.",
    contraindications: "Maladies auto-immunes.",
    categories: [3], symptoms: ["rhume", "grippe", "fatigue immunitaire"]
  },
  {
    id: 7, name: "Mélisse", image_file: "la Mélisse.jpeg", image_url: "",
    description: "Soulage le stress et les troubles digestifs.",
    usage: "Infusion le soir après le repas.",
    contraindications: "Hypothyroïdie.",
    categories: [1, 4], symptoms: ["stress digestif", "palpitations", "anxiété"]
  }
];

const insertPlant = db.prepare('INSERT INTO plants (id, name, image_file, image_url, description, usage, contraindications) VALUES (?, ?, ?, ?, ?, ?, ?)');
const insertSymptom = db.prepare('INSERT INTO symptoms (name, plant_id) VALUES (?, ?)');
const insertPlantCategory = db.prepare('INSERT INTO plant_categories (plant_id, category_id) VALUES (?, ?)');

plants.forEach(plant => {
  insertPlant.run(plant.id, plant.name, plant.image_file, plant.image_url, plant.description, plant.usage, plant.contraindications);
  plant.categories.forEach(catId => insertPlantCategory.run(plant.id, catId));
  plant.symptoms.forEach(symptom => insertSymptom.run(symptom, plant.id));
});

console.log("Base de données peuplée avec succès avec 7 plantes !");
db.close();