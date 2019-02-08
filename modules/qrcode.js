const fs = require('fs')
const jimp = require('jimp')
const qr_reader = require('qrcode-reader')

exports.scan = async (file_path, msg, event) => {
    // run(file_path)
    console.log(file_path)
    const img = await jimp.read({ url: file_path })
    const qr = new qr_reader()
    const value = await new Promise((resolve, reject) => {
        qr.callback = (err, v) => err != null ? event.emit('register:password:qr:error', msg) : resolve(v)
        qr.decode(img.bitmap)
    })
    return value.result
}