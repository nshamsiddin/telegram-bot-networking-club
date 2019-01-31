const mongoose = require('mongoose')
const db = require('../../modules/mongodb')

// User Model
const UserSchema = new db.mongoose.Schema({
    id: { type: Number, required: [true, 'idRequired'], unique: true },
    name: { type: String, maxlength: 128 },
    job: { type: String, maxlength: 128 },
    department: { type: String, maxlength: 128 },
    username: { type: String, required: [true, 'usernameRequired'], unique: true, maxlength: 128 },
    gender: { type: String, enum: ['male', 'female'] },
    photo: { type: String },
    active: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    created: { type: Date, default: Date.now },
    last_active: { type: Date, default: Date.now },
    stats: [{ type: Object }],
    white_list: [{ type: Number }],
    ignore_list: [{ type: Number }],
    active_quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', default: null },
    last_question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', default: null },
})

UserSchema.pre('save', (next) => {
    this.last_active = Date.now()
    next()
})

exports.User = db.connect.model('User', UserSchema)
