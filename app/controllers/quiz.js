const Model = require('../models/quiz')

// User Existence Check
exports.new = Model.Quiz

exports.create = async (user_id) => await new Model.Quiz({user: user_id}).save()

exports.save = async quiz => await quiz.save()

exports.get = async id => await Model.Quiz.findById(id)
