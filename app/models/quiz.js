const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// Quiz Model
const QuizSchema = new db.mongoose.Schema({
    user: { type: Number },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    completed: { type: Boolean, default: false },
    cursor: { type: Number, default: 0 }
})

exports.Quiz = db.connect.model('Quiz', QuizSchema)
