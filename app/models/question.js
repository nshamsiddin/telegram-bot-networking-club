const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// Question Model
const QuestionSchema = new db.mongoose.Schema({
    type: { type: String },
    options: { type: Array },
    sent: { type: Boolean, default: false },
    correct_answer: { type: Object, default: null },
    given_answer: { type: String, default: null },
    weight: { type: Number, default: 1 },
    correct: { type: Boolean },
    quiz: { type: mongoose.Schema.Types.ObjectId, required: true },
})

exports.Question = db.connect.model('Question', QuestionSchema)