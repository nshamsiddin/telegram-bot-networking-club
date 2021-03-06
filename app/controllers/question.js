const Model = require('../models/question')

exports.create = async (quiz_id, user_id, type, answer) =>
    await new Model.Question({
        quiz: quiz_id,
        user: user_id,
        type: type,
        correct_answer: answer
    }).save()

exports.createWithOptions = async (quiz_id, user_id, type, answer, options) =>
    await new Model.Question({
        quiz: quiz_id,
        user: user_id,
        type: type,
        correct_answer: answer,
        options: options
    }).save()

exports.get = async id => await Model.Question.findById(id)

exports.save = async question => await question.save()

exports.getByUser = async (user) => await Model.Question.find({ user: user })