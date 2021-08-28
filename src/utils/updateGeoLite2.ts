import crypto from 'crypto'
import fs from 'fs-extra'
import https from 'https'
import path from 'path'
import tar from 'tar'

const filesPath = path.resolve(__dirname, '../bin/GeoLite2-City')
const dbPath = path.resolve(filesPath, 'GeoLite2-City.mmdb')

export default async () => {
    if (fs.existsSync(dbPath)) {
        const { mtime: lastUpdate } = fs.statSync(dbPath)

        const now = new Date()
        const outdated = new Date()
        outdated.setDate(lastUpdate.getDate() + 29)

        if (now < outdated) return dbPath
    }

    console.log(`update db`)

    await update()

    return dbPath
}

async function update() {
    const licenseKey = process.env.MAXMIND_LICENCE_KEY

    if (!licenseKey) throw new Error('No licence Key')

    const archiveUrl = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${licenseKey}&suffix=tar.gz`
    const checksumUrl = `${archiveUrl}.sha256`

    const archivePath = path.resolve(filesPath, 'GeoLite2-City.tar.gz')
    const checksumPath = path.resolve(filesPath, 'GeoLite2-City.sha256')

    fs.removeSync(filesPath)
    fs.ensureDirSync(filesPath)

    const p1 = download(checksumUrl, checksumPath)
    const p2 = download(archiveUrl, archivePath)

    await Promise.all([p1, p2])

    const checksumFile = fs.readFileSync(checksumPath, { encoding: 'utf-8' })
    const checksum = checksumFile.split(' ')[0]
    const archiveChecksum = fileHash(archivePath)

    if (checksum !== archiveChecksum) throw new Error('Invalid Hash')

    tar.x({ file: archivePath, sync: true, strip: 1, cwd: filesPath })

    fs.remove(checksumPath)
    fs.remove(archivePath)
}

function download(url: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) reject()
            response.pipe(fs.createWriteStream(path)).on('finish', () => {
                resolve()
            })
        })
    })
}

function fileHash(filePath: string) {
    return crypto
        .createHash('sha256')
        .update(fs.readFileSync(filePath))
        .digest('hex')
}
