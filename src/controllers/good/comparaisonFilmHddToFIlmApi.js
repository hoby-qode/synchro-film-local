const fs = require('fs')
const path = require('path')
const { compareTwoStrings } = require('string-similarity')

const listViaApi = fs.readFileSync(
  'J:/PROJET WEB/synchroLocalV2/tests/movies.txt',
  'utf-8',
)
const videoExtensions = [
  '.mp4',
  '.avi',
  '.mkv',
  '.mov',
  '.wmv',
  '.flv',
  '.webm',
]
const lignesA = listViaApi.split('\n').map((line) => line.trim().toLowerCase())

const outputFile =
  'J:\\PROJET WEB\\synchroLocalV2\\tests\\listFilmCorrespondance.txt'

const trouverCorrespondances = (lignesA, lignesB) => {
  let videoFiles = []
  lignesA.forEach((ligneA, key) => {
    lignesB.forEach((ligneB) => {
      const ext = path.extname(ligneB)
      const movieName = path.basename(ligneB, path.extname(ligneB))
      const nameCleared = movieName
        .replace(ext, '')
        .replace('.', ' ')
        .toLowerCase()
        .replace('2024', '')
        .replace('2023', '')
        .replace('2022', '')
        .replace('2021', '')
        .replace('2020', '')
        .replace('2019', '')
        .replace('2018', '')
        .replace('2017', '')
        .replace('2016', '')
        .replace('2015', '')
        .replace('2014', '')
        .replace('2013', '')
        .replace('2012', '')
        .replace('2011', '')
        .replace('2010', '')
        .replace('2009', '')
        .replace('2008', '')
        .replace('2007', '')
        .replace('2006', '')
      const similarity = compareTwoStrings(ligneA, nameCleared)
      if (similarity > 0.6) {
        videoFiles.push(
          `correspondance trouvé (${Math.round(
            similarity * 100,
          )})  : ${ligneA} => ${movieName}`,
        )
        const folderName = path.dirname(ligneB)
        const detailsJSON = {
          overview: 'je suis un test',
        }
        fs.writeFileSync(
          path.join(folderName, `detail.json`),
          JSON.stringify(detailsJSON, null, 2),
        )
      }
    })
    console.log(
      Math.round(100 - ((lignesA.length - key) * 100) / lignesA.length) + '%',
    )
  })

  fs.writeFileSync(outputFile, videoFiles.join('\n'))
  console.log("films via l'api : " + lignesA.length)
  console.log('films via HDD : ' + lignesB.length)
  console.log('films correspondant : ' + videoFiles.length)
}

const directory = 'I:\\FILMS'
const lignesB = getAllVideoFiles(directory)

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

trouverCorrespondances(lignesA, lignesB)
