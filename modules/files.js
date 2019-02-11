const fs = require('fs')
const Path = require('path')
const Axios = require('axios')

const config = require('../resources/config')

exports.saveFile = file => {
    fs.writeFileSync()
    try {
        fs.writeFileSync(file, content, 'utf8')
    }
    catch (err) {
        logger(err, __filename, null)
    }
}

exports.readFile = file => {
    try {
        return fs.readFileSync(file, content, 'utf8')
    }
    catch (err) {
        logger(err, __filename, null)
        return null
    }
}

exports.downloadImage = async file => {
    const folderPath = Path.resolve(__dirname, '..', config.default_folder, file.path.split('/')[0])
    const path = Path.resolve(__dirname, '..', config.default_folder, file.path.split('/')[0], file.path.split('/')[1])
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
    }
    const writer = fs.createWriteStream(path)

    const response = await Axios({
        url: file.url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)
    return path
}