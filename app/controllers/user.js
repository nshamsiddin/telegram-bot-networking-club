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

// exports.create_new = async (id, username) => {
//     ad.findUser(username, (err, user) => {
//         if (err) {
//             log('ERROR: ' + JSON.stringify(err))
//             return
//         }
//         if (!user) {
//             log('User: ' + sAMAccountName + ' not found.')
//         }
//         else {
//             await new Model.User({
//                 id: id,
//                 name: `${user.givenName} ${user.sn}`,
//                 department: user
//             }).save()
//         }
//     })
// }

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

exports.generateUsersList = async (id) => await Model.User.find(
    { id: { $ne: id }, visible: true, active: true },
    { '_id': 0, '__v': 0 }
)

exports.save = async user => await user.save()

// Remove user
exports.remove = async id => Model.User.remove({ id: id })

// Cleaning up the user database
exports.cleaner = async () => Model.User.remove({})