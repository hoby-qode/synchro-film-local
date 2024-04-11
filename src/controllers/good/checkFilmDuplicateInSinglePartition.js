const fs = require('fs')
const path = require('path')

const partition = 'I:\\FILMS'
const videoExtensions = [
  '.mp4',
  '.avi',
  '.mkv',
  '.mov',
  '.wmv',
  '.flv',
  '.webm',
]
function listFilesQndDirRecursive(directory) {
  let results = []

  const filesAndDir = fs.readdirSync(directory, { withFileTypes: true })

  filesAndDir.forEach((item) => {
    const itemPath = path.join(directory, item.name)
    results.push(itemPath)

    if (item.isDirectory()) {
      results = results.concat(listFilesQndDirRecursive(itemPath))
    } else {
      if (isVideoFile(item.name)) {
        results.push(itemPath)
      }
    }
  })

  return results
}

function findDuplicates(directory) {
  const filesAndDir = listFilesQndDirRecursive(directory)

  const seen = {}

  const duplicates = []

  filesAndDir.forEach((filePath) => {
    const filename = path.basename(filePath)
    if (seen[filename]) {
      duplicates.push(filePath)
    } else {
      seen[filename] = true
    }
  })

  return duplicates
}

function isVideoFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return videoExtensions.includes(ext)
}
const duplicates = findDuplicates(partition)

const outputFile = 'I:\\FILMS\\results.txt'

fs.writeFileSync(outputFile, duplicates.join('\n'))

console.log(duplicates)
