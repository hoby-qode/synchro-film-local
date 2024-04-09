require('dotenv').config();
const axios = require('axios')

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MzQzYmRhMTViZjgwNjU2MTEyZjQzMWVkYjFiY2M3NiIsInN1YiI6IjY1YTRmM2Q3OGEwZTliMDEyZWI0NjE3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJc_GUl1LWfmJovPq51s3MiFuwsKAaQeGH6YXQSRjUI'; // Remplacez cela par votre clé d'API TMDB

async function fetchMovies(page) {
    const url = `https://api.themoviedb.org/3/discover/movie&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`;
    const options = {
        headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        },
    }
    const response = await axios.get(url, options)
    const data = await response.json();
    return data.results;
}

async function getAllMovies() {
    // try {
    //     let allMovies = [];
    //     let page = 1;
    //     let totalPages = 1;

    //     while (page <= totalPages) {
    //         const movies = await fetchMovies(page);
    //         console.log(movies)
    //         // allMovies = allMovies.concat(movies.filter(movie => movie.media_type === 'movie'));
    //         // totalPages = Math.min(movies.total_pages, 1000); // Limiter le nombre total de pages à 1000
    //         page++;
    //     }

    //     return allMovies;
    // } catch (error) {
    //     console.error('Erreur lors de la récupération des films :', error);
    //     throw error;
    // }
    const movies = await fetchMovies(1);
           return movies
}

async function main() {
    try {
        const movies = await getAllMovies();
        console.log('Liste des films :');
        movies.forEach(movie => {
            console.log(movie.title);
        });
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

main();
