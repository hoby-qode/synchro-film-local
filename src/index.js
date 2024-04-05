const fs = require("fs");
const axios = require("axios");
const path = require("path");

// Clé d'API de TMDb
const apiKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MzQzYmRhMTViZjgwNjU2MTEyZjQzMWVkYjFiY2M3NiIsInN1YiI6IjY1YTRmM2Q3OGEwZTliMDEyZWI0NjE3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJc_GUl1LWfmJovPq51s3MiFuwsKAaQeGH6YXQSRjUI";

// Fonction pour récupérer le détail d'un film depuis TMDb
async function getMovieDetails(movieName) {
  const language = "fr-FR";
  const cleanedMovieName = movieName.replace(/\./g, " ").trim(); // Remplacer les points par des espaces
  const cleanedMovieNameWithoutYear = cleanedMovieName
    .replace(/\((\d{4})\)|\([^)]*\)/g, "")
    .trim(); // Supprimer l'année entre parenthèses ou le contenu entre parenthèses
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    cleanedMovieNameWithoutYear
  )}&language=${language}`;
  const options = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };
  try {
    const response = await axios.get(url, options);
    if (response.data.results.length > 0) {
      return response.data.results[0];
    } else {
      console.log(
        `Aucun résultat trouvé pour "${movieName}" dans la base de données de TMDb. Recherche sur OMDB.`
      );
      // Recherche sur OMDB si aucune réponse de TMDb
      // const omdbUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(
      //   cleanedMovieName
      // )}&apikey=9664970e`;
      // const omdbResponse = await axios.get(omdbUrl);
      // if (omdbResponse.data.Response === "True") {
      //   return omdbResponse.data;
      // } else {
      //   console.log(
      //     `Aucun résultat trouvé pour "${movieName}" dans la base de données de TMDb ni sur OMDB.`
      //   );
      //   return null;
      // }
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du film:", error);
    return null;
  }
}

// Fonction pour récupérer les crédits d'un film depuis TMDb (liste des acteurs)
async function getMovieCredits(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
  const options = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };
  try {
    const response = await axios.get(url, options);
    return response.data.cast;
  } catch (error) {
    console.error("Erreur lors de la récupération des crédits du film:", error);
    return null;
  }
}

// Fonction pour parcourir les fichiers vidéo dans un répertoire
function getAllVideoFiles(dirPath, fileArray = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllVideoFiles(filePath, fileArray);
    } else {
      if ([".mp4", ".avi", ".mkv"].includes(path.extname(file).toLowerCase())) {
        fileArray.push(filePath);
      }
    }
  });
  return fileArray;
}

// Chemin du dossier contenant vos films
const folderPath = "C:\\Users\\USER\\Downloads\\Video\\films";
const videoFiles = getAllVideoFiles(folderPath);

videoFiles.forEach(async (filePath) => {
  const movieName = path.basename(filePath, path.extname(filePath));
  const movieDetails = await getMovieDetails(movieName);
  if (movieDetails) {
    if (movieDetails.id) {
      const credits = await getMovieCredits(movieDetails.id);
      const actors = credits.map((actor) => ({
        name: actor.name,
        actorName: actor.character,
        department: actor.department || "",
        job: actor.job || "",
      }));
      const detailsJSON = {
        title: movieDetails.title,
        overview: movieDetails.overview,
        release_date: movieDetails.release_date,
        genre_ids: movieDetails.genre_ids,
        runtime: movieDetails.runtime,
        vote_average: movieDetails.vote_average,
        original_language: movieDetails.original_language,
        director: "", // Vous pouvez remplir ce champ si vous avez cette information
        actors: actors,
        poster_path: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`,
        path_in_disk_dur: filePath,
      };
      const folderName = path.dirname(filePath);
      fs.writeFileSync(
        path.join(folderName, `detail.json`),
        JSON.stringify(detailsJSON, null, 2)
      );
      console.log(`Détails du film "${movieName}" enregistrés avec succès.`);
    }
  } else {
    console.log(
      `Impossible de récupérer les détails pour le film : ${movieName}`
    );
  }
});

console.log("Processus terminé.");
