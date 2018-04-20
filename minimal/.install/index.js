const fs = require('fs')
const {
  replaceInFiles,
  deploy,
  writeEnv,
  getInfo,
} = require('graphql-boilerplate-install')

const path = require('path')

module.exports = async ({ project, projectDir }) => {
  const templateName = 'graphql-boilerplate'

  replaceInFiles(
    ['server/index.js', 'server/package.json'],
    templateName,
    project,
  )

  console.log(`\
Next steps:
  1. Change directory: \`cd ${projectDir}/server\`
  2. Start local server: \`yarn start\` (you can now open a Playground at http://localhost:4000)
  3. Change directory: \`cd ..\`
  4. Start React app: \`yarn start\`
  5. Open browser: http://localhost:3000
  `)
}
