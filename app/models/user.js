const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// User Model
const UserSchema = new db.mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'idRequired'],
        unique: true
    },
    name: {
        type: String
    },
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    active_quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        default: null
    },
    last_question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        default: null
    },
    white_list: [{
        type: Number
    }],
    ignore_list: [{
        type: Number
    }],
    photo: {
        type: String,
    },
    job: {
        type: String
    },
    gender: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    stats: {
        type: Object,
        default: {}
    },
    active: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        default: true
    }
})

exports.User = db.connect.model('User', UserSchema)
