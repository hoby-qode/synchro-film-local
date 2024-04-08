const fs = require('fs')
const path = require('path')

const partitions = ['I:\\FILMS\\Collection Film Française', 'I:\\FILMS\\FILMS']

function listFiles(directory) {
  return fs.readdirSync(directory)
}

function findDuplicates(dir1, dir2) {
  const files1 = listFiles(dir1)
  const files2 = listFiles(dir2)
  console.log(files1)
  console.log(files2)
  const duplicates = files1.filter((file) => files2.includes(file))

  return duplicates
}

const outputFile = 'I:\\FILMS\\results.txt'

const duplicates = findDuplicates(partitions[0], partitions[1])

fs.writeFileSync(outputFile, duplicates.join('\n'))

console.log(duplicates)
