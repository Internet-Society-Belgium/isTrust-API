const fs = require('fs-extra')
const defaultPackage = require('../package.json')
const path = require('path')

const buildPath = path.resolve('build')

var buildPackage = {
    ...defaultPackage,
}
delete buildPackage.scripts
delete buildPackage.devDependencies
delete buildPackage.config

fs.writeFileSync(
    path.resolve(buildPath, 'package.json'),
    JSON.stringify(buildPackage, null, 2)
)
