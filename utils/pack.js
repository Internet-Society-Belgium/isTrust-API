const fs = require('fs')
const archiver = require('archiver')

if (!fs.existsSync('build'))
    throw new Error('/build don\'t exist! run "npm run build"')
if (fs.existsSync('pack')) fs.rmSync('pack', { recursive: true })
fs.mkdirSync('pack')

zipDirectory('build', `pack/isTrust-API.zip`)

function zipDirectory(source, out) {
    const archive = archiver('zip')
    const stream = fs.createWriteStream(out)

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', (err) => reject(err))
            .pipe(stream)

        stream.on('close', () => resolve())
        archive.finalize()
    })
}
