require('dotenv').config()
const fs = require('fs')
const axios = require('axios')
require('dotenv').config()

// Clé d'API de TMDb
const apiKey = process.env.API_KEY_TMBD
const outputFile = 'I:\\FILMS\\listAllFilmsViaApi.txt'

async function fetchMovies(page) {
  const url = `https://api.themoviedb.org/3/discover/movie?language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`
  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  }
  const response = await axios.get(url, options)
  // const data = await response.json();
  return response.data
}

async function getAllMovies() {
  try {
    let allMovies = []
    let page = 1
    let totalPages = 1

    do {
      const movies = await fetchMovies(page)
      allMovies = allMovies.concat(movies.results)
      totalPages = movies.total_pages // Obtenez le nombre total de pages de la première réponse
      page++
      console.log('page n¤' + page)
    } while (page <= totalPages && page <= 200) // Limiter le nombre total de pages à 1000

    return allMovies
  } catch (error) {
    console.error('Erreur lors de la récupération des films :', error)
    throw error
  }
}

async function main() {
  try {
    const movies = await getAllMovies()
    const titles = movies.map((movie) => movie.title).join('\n') // Crée une chaîne avec les titres des films séparés par un saut de ligne
    await writeFileAsync(outputFile, titles)
  } catch (error) {
    console.error('Une erreur est survenue :', error)
  }
}
async function writeFileAsync(fileName, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
main()
