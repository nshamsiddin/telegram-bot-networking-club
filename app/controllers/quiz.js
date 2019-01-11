const Model = require('../models/quiz')

// User Existence Check
exports.contains = async id => Model.Quiz.findOne({ id: id })

exports.get = async id => Model.Quiz.findOne({ _id: id })

exports.add = async data => await new Model.Quiz({ user: data }).save()

exports.getQuestions = async id => await Model.Quiz.findById(id)


exports.save = async quiz => await quiz.save()