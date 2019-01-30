const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// Quiz Model
const QuizSchema = new db.mongoose.Schema({
    user: { type: Number },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    cursor: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
})

exports.Quiz = db.connect.model('Quiz', QuizSchema)
