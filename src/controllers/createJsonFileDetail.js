

const fs = require('fs')
const axios = require('axios')
const path = require('path')

// Clé d'API de TMDb
const apiKey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MzQzYmRhMTViZjgwNjU2MTEyZjQzMWVkYjFiY2M3NiIsInN1YiI6IjY1YTRmM2Q3OGEwZTliMDEyZWI0NjE3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJc_GUl1LWfmJovPq51s3MiFuwsKAaQeGH6YXQSRjUI'

// Fonction pour récupérer le résumé d'un film
async function getMovieDetails(movieName) {
  const language = 'fr-FR'
  // Remplacer les points par des espaces
  const cleanedMovieName = movieName.replace(/\./g, ' ').trim();
  // Supprimer l'année entre parenthèses ou le contenu entre parenthèses
  const cleanedMovieNameWithoutYear = cleanedMovieName.replace(/\((\d{4})\)|\([^)]*\)/g, '').trim();
//   const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
//     cleanedMovieName,
//   )}` 
    console.log(cleanedMovieNameWithoutYear)
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(cleanedMovieNameWithoutYear)}&language=${language}`;
  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  }
  try {
    const response = await axios.get(url, options)
    if (response.data.results.length > 0) {
      return response.data.results[0]
    } else {
        console.log('Aucun résultat trouvé pour'+ "${movieName}"+'.');
        return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du résumé:', error)
    return 'Erreur lors de la récupération du résumé.'
  }
}

// Fonction pour récupérer les crédits d'un film (liste des acteurs)
async function getMovieCredits(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits`
  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  }
  try {
    const response = await axios.get(url, options)
    return response.data.cast
  } catch (error) {
    console.error('Erreur lors de la récupération des crédits du film:', error)
    return null
  }
}

function getAllVideoFiles(dirPath, fileArray = []) {
  const files = fs.readdirSync(dirPath)
  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      getAllVideoFiles(filePath, fileArray)
    } else {
      if (
        file.endsWith('.mp4') ||
        file.endsWith('.avi') ||
        file.endsWith('.mkv')
      ) {
        fileArray.push(filePath)
      }
    }
  })
  return fileArray
}

// Initialisation des logs
let successLog = ''
let errorLog = ''

// Chemin du dossier contenant vos films
const folderPath = 'F:\\Film'
const videoFiles = getAllVideoFiles(folderPath)

videoFiles.forEach(async (filePath) => {
  const movieName = path.basename(filePath, path.extname(filePath))
  const movieDetails = await getMovieDetails(movieName)
  if (movieDetails) {
    console.log(movieDetails.id)
    if (movieDetails.id) {
      const credits = await getMovieCredits(movieDetails.id)
      const actors = credits.map((actor) => ({
        name: actor.name,
        actorName: actor.character,
        department: actor.department || '',
        job: actor.job || '',
      }))
      const detailsJSON = {
        title: movieDetails.title,
        overview: movieDetails.overview,
        release_date: movieDetails.release_date,
        genre_ids: movieDetails.genre_ids,
        runtime: movieDetails.runtime,
        vote_average: movieDetails.vote_average,
        original_language: movieDetails.original_language,
        // pays_de_production: movieDetails.production_countries.map(country => country.name),
        director: movieDetails.director,
        actors: actors,
        poster_path: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`,
        path_in_disk_dur: filePath,
      }
      const folderName = path.dirname(filePath)
      fs.writeFileSync(
        path.join(folderName, `detail.json`),
        JSON.stringify(detailsJSON, null, 2),
      )
      successLog += `Détails du film "${movieName}" enregistrés avec succès.\n`
    }
  } else {
    errorLog += `Impossible de récupérer les détails pour le film : ${movieName}\n`
  }
})

// Enregistrement des logs
fs.writeFileSync(`${folderPath}/successLog.txt`, successLog)
fs.writeFileSync(`${folderPath}/errorLog.txt`, errorLog)

console.log('Processus terminé')
