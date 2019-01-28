const mongoose = require('mongoose')
const config = require('../resources/config')

mongoose.Promise = global.Promise
mongoose.connect(config.mongodb.url, {
    useNewUrlParser: true
})

const db = mongoose.connection

db.on('error', (err) => {
    logger(err.message, __filename, null)
})

// MongoDB
exports.mongoose = mongoose

// This DB
exports.connect = db