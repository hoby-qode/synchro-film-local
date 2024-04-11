const fs = require('fs')
const { compareTwoStrings } = require('string-similarity')

const contenuA = fs.readFileSync(
  'J:/PROJET WEB/synchroLocalV2/tests/listFilms.txt',
  'utf-8',
)
const contenuB = fs.readFileSync(
  'J:/PROJET WEB/synchroLocalV2/tests/movies.txt',
  'utf-8',
)

const lignesA = contenuA.split('\n').map((line) => line.trim().toLowerCase())
const lignesB = contenuB.split('\n').map((line) => line.trim().toLowerCase())

const outputFile =
  'J:\\PROJET WEB\\synchroLocalV2\\tests\\listFilmCorrespondance.txt'

const trouverCorrespondances = (lignesA, lignesB) => {
  let videoFiles = []
  lignesA.forEach((ligneA, indexA) => {
    lignesB.forEach((ligneB, indexB) => {
      const similarity = compareTwoStrings(ligneA, ligneB)
      if (similarity > 0.8) {
        console.log(
          `correspondance trouvé (${Math.round(
            similarity * 100,
          )})  : ${ligneA} => ${ligneB}`,
        )
        videoFiles.push(
          `correspondance trouvé (${Math.round(
            similarity * 100,
          )})  : ${ligneA} => ${ligneB}`,
        )
      }
    })
  })
  fs.writeFileSync(outputFile, videoFiles.join('\n'))
  console.log('test')
}

trouverCorrespondances(lignesA, lignesB)
