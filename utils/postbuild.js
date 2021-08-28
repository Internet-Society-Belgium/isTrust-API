const fs = require('fs-extra')
const defaultPackage = require('../package.json')
const path = require('path')

const buildPath = path.resolve('build')

var buildPackage = {
    ...defaultPackage,
}
buildPackage.main = 'index.js'
buildPackage.scripts = {
    start: 'node .',
}
delete buildPackage.devDependencies

fs.writeFileSync(
    path.resolve(buildPath, 'package.json'),
    JSON.stringify(buildPackage, null, 2)
)
