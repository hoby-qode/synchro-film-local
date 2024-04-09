const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Clé d'API de TMDb
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MzQzYmRhMTViZjgwNjU2MTEyZjQzMWVkYjFiY2M3NiIsInN1YiI6IjY1YTRmM2Q3OGEwZTliMDEyZWI0NjE3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJc_GUl1LWfmJovPq51s3MiFuwsKAaQeGH6YXQSRjUI';

// Fonction pour récupérer toutes les catégories de films depuis TMDb
async function getAllMovieGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=fr-FR`;
    const options = {
        headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        },
    }
    try {
        const response = await axios.get(url,options);
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
    const pathCible = 'D:\\DOCS - MARCEL\\films'
    genres.forEach(genre => {
        const folderPath = path.join(pathCible, genre);
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