const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// Quiz Model
const QuizSchema = new db.mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    completed: {
        type: Boolean,
        default: false
    }
})

exports.Quiz = db.connect.model('Quiz', QuizSchema)
