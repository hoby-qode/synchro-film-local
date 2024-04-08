const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Clé d'API de TMDb
const apiKey = process.env.TMDB_API_KEY;

// Fonction pour récupérer toutes les catégories de films depuis TMDb
async function getAllMovieGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr-FR`;
    try {
        const response = await axios.get(url);
        if (response.data.genres.length > 0) {
            return response.data.genres.map(genre => genre.name);
        } else {
            console.log('Aucune catégorie de films trouvée.');
            return [];
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories de films:', error);
        return [];
    }
}

// Fonction pour créer des dossiers pour chaque catégorie de films
async function createGenreFolders() {
    const genres = await getAllMovieGenres();
    genres.forEach(genre => {
        const folderPath = path.join(__dirname, genre);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            console.log(`Dossier "${genre}" créé.`);
        } else {
            console.log(`Le dossier "${genre}" existe déjà.`);
        }
    });
}

// Appel de la fonction pour créer les dossiers de catégories de films
createGenreFolders();