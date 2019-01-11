const Model = require('../models/question')

exports.add = async data => await new Model.Question({ quiz: data }).save()

exports.get = async id => await Model.Question.findById(id)

exports.getUnanswered = async list => await Model.Question.findOne({ _id: { "$in": list }, sent: false })

exports.save = async question => await question.save()