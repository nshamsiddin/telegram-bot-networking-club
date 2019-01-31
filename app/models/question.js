const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// Question Model
const QuestionSchema = new db.mongoose.Schema({
    type: { type: String },
    quiz: { type: mongoose.Schema.Types.ObjectId, required: true },
    user: { type: Number },
    options: { type: Array },
    correct_answer: { type: Object },
    correct: { type: Boolean },
})

exports.Question = db.connect.model('Question', QuestionSchema)