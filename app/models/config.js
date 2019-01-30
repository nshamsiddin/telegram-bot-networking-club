const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// Config Model
const ConfigSchema = new db.mongoose.Schema({
    type: String,
    key: String,
    size: String,
    object: Object,
    description: String
})

exports.Config = db.connect.model('Config', ConfigSchema)
