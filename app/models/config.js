const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// Config Model
const ConfigSchema = new db.mongoose.Schema({
    config_type: { type: String, enum: ['value', 'object'] },
    key: { type: String, unique: true },
    value: String,
    object: Object,
    description: String
})

exports.Config = db.connect.model('Config', ConfigSchema)
