const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// Department Model
const DepartmentSchema = new db.mongoose.Schema({
    id: String,
    name: String,
    count: Number
})

exports.Department = db.connect.model('Department', DepartmentSchema)