const Model = require('../models/user')
const { event } = require('../event')

// const ad = require('../activedirectory')
// Get user
exports.get = async id => Model.User.findOne({ id: id })

exports.getByPassword = async pass => Model.User.findOne({ tmp_password: pass })

// User Existence Check
exports.contains = async id => Model.User.findOne({ id: id })

// Adding a new user
exports.create = (user, action, next) => {
    Model.User.findOne({ id: user.id }, async (err, doc) => {
        if (err) {
            logger(err, __filename, id)
            return
        }
        else
            if (doc) {
                if (doc.username == user.username)
                    event.emit('username:exists', user)
                if (doc.id === user.id)
                    event.emit('id:exists', user, action)
            }
            else {
                await new Model.User(user).save((err, new_user) => {
                    if (err)
                        logger(err, __filename, id)
                    else
                        event.emit('user:created', user, action, next)
                })
            }
    })
}

exports.reset = async user => await Model.User.updateOne({ id: user.id }, { white_list: [], ignore_list: [] })

exports.setParam = async (id, user) => await Model.User.updateOne({ id: id }, user)

exports.delete = async (user) => Model.User.deleteOne({ id: user.id })

exports.getActiveUsers = async () => await Model.User.find({ visible: true, active: true })

exports.save = async user => {
    user.last_active = new Date()
    return await user.save()
}

exports.updateStats = async (user, index, stat) => await Model.User.findByIdAndUpdate(user._id, { [`stats.${index}`]: stat })

exports.remove = async id => Model.User.remove({ id: id })

exports.cleaner = async () => Model.User.remove({})

// init()
// async function init() {
//     for (let user of await Model.User.find({})) {
//         let quiz_new_count = Math.floor(Math.random() * 100)
//         let quiz_new_know = quiz_new_count - Math.floor(Math.random() * quiz_new_count)
//         let quiz_new_remember = quiz_new_count - quiz_new_know
//         let quiz_name_count = Math.floor(Math.random() * 100)
//         let quiz_name_know = quiz_name_count - Math.floor(Math.random() * quiz_name_count)
//         let quiz_name_remember = quiz_name_count - quiz_name_know
//         let quiz_job_count = Math.floor(Math.random() * 100)
//         let quiz_job_know = quiz_job_count - Math.floor(Math.random() * quiz_job_count)
//         let quiz_job_remember = quiz_job_count - quiz_job_know
//         let stats = [
//             { "type": "quiz_new", "count": quiz_new_count, "know": quiz_new_know, "remember": quiz_new_remember },
//             { "type": "total", "count": quiz_name_count + quiz_job_count, "correct": quiz_name_know + quiz_job_know, "incorrect": quiz_name_remember + quiz_job_remember },
//             { "type": "quiz_name", "count": quiz_name_count, "correct": quiz_name_know, "incorrect": quiz_name_remember },
//             { "type": "quiz_job", "count": quiz_job_count, "correct": quiz_job_know, "incorrect": quiz_job_remember }
//         ]
//         user.stats = stats
//         await user.save()
//         console.log(user)
//     }
// }
// const departments = ['IT', 'Commercial', 'Marketing', 'Security']
// const shuffle = require('shuffle-array')
// init()
// async function init() {
//     for (let user of await Model.User.find({})) {
//         user.department = shuffle.pick(departments)
//         console.log(user.department)
//         await user.save()
//     }
// }


// Model.User.updateMany({}, { $set: { stats : [{type : }]} })