const fs = require('fs')
const path = require('path')
require('dotenv').config()

const directoryPath = 'K:\\DESSIN ANIME'
const outputFile = 'J:\\PROJET WEB\\synchroLocalV2\\tests\\listDessinAnime.txt'

function getAllMovieLists(directoryPath, outputFile) {
  try {
    const videoExtentions = ['.mp4', '.avi', '.mkv']
    let videoFiles = []
    function serchVideoFiles(dir) {
      const files = fs.readdirSync(dir)
      files.forEach((file) => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
          serchVideoFiles(filePath)
        } else {
          if (videoExtentions.includes(path.extname(file).toLowerCase())) {
            const filename = path.basename(filePath)
            videoFiles.push(filename)
          }
        }
      })
    }
    serchVideoFiles(directoryPath)
    fs.writeFileSync(outputFile, videoFiles.join('\n'))
    console.log('nombre des films:' + videoFiles.length)
  } catch (error) {}
}

getAllMovieLists(directoryPath, outputFile)
