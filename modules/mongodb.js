const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise
mongoose.connect(config.mongodb.url, {
    useNewUrlParser: true
})

const db = mongoose.connection

db.on('error', err => console.log('connection error:', err.message))

// MongoDB
exports.mongoose = mongoose

// This DB
exports.connect = db