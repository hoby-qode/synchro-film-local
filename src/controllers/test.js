const fs = require('fs')
const path = require('path')

const txt = fs.readFileSync(
  'J:/PROJET WEB/synchroLocalV2/tests/listFilms.txt',
  'utf-8',
)

const outputFile =
  'J:\\PROJET WEB\\synchroLocalV2\\tests\\ListFilmCorrespondanceTrueName.txt'
let videosName = []
txt.split('\n').map((line) => {
  const ext = path.extname(line)
  videosName.push(line.replace(ext, '').replace('.', ' ').toLowerCase())
})

fs.writeFileSync(outputFile, videosName.join('\n'))
