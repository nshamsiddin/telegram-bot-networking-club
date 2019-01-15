const Model = require('../models/user')
// const ad = require('../activedirectory')
// Get user
exports.get = async id => Model.User.findOne({ id: id })

// User Existence Check
exports.contains = async id => Model.User.findOne({ id: id })


// Adding a new user
exports.create = async data => {
    await new Model.User({
        id: data.id,
        name: data.name
    }).save()
}


exports.activate_user = async id => await Model.User.updateOne({ id: id })

// Add quiz to user
exports.addQuiz = async (user, quiz_id) => {
    user.quizzes.push(quiz_id)
    user.active_quiz = quiz_id
    await user.save()
    // await Model.User.save(user)
}

exports.setParam = async (id, user) => await Model.User.updateOne({ id: id }, user)

exports.setName = async (id, name) => {
    await Model.User.updateOne({ id: id }, { name: name })
}

exports.setJob = async (id, job) => {
    await Model.User.updateOne({ id: id }, { job: job })
}

exports.generateList = async (user, type) => {
    let result = []
    await Model.User.find({
        id: { $ne: user.id },
        visible: true, active: true
    }, { '_id': 0, '__v': 0 },
        (err, users) => {
            result = users.filter((u) => {
                return (type === 'new'
                    ? !user.white_list.includes(u.id)
                    : user.white_list.includes(u.id))
                    && !user.ignore_list.includes(u.id)
            })
        }

    )
    console.log(result.length)
    return result
}

exports.getNew = async (user) => {
    let result = []
    await Model.User.find({
        id: { $ne: user.id },
        visible: true, active: true
    }, { '_id': 0, '__v': 0 }, (err, users) => {
        result = users.filter((u) => {
            return !user.white_list.includes(u.id)
                && !user.ignore_list.includes(u.id)
        })
    })
    return result;
}


exports.save = async user => await user.save()

// Remove user
exports.remove = async id => Model.User.remove({ id: id })

// Cleaning up the user database
exports.cleaner = async () => Model.User.remove({})