const Model = require('../models/user')
const { event } = require('../event')

// const ad = require('../activedirectory')
// Get user
exports.get = async id => Model.User.findOne({ id: id })

// User Existence Check
exports.contains = async id => Model.User.findOne({ id: id })


// Adding a new user
exports.create = (user, action, next) => {
    Model.User.findOne({ $or: [{ id: user.id }, { username: user.username }] }, async (err, doc) => {
        if (err) {
            logger(err, __filename, id)
            return
        }
        else
            if (doc) {
                if (doc.username == user.username) {
                    event.emit('username:exists', user)
                    return
                }
                if (doc.id === user.id) {
                    event.emit('id:exists', user, action)
                    return
                }
            }
            else {
                await new Model.User(user).save((err, new_user) => {
                    if (err) {
                        logger(err, __filename, id)
                        return
                    }
                    else {
                        event.emit('user:created', user, action, next)
                    }
                })
            }
    })

}

exports.reset = async user => {
    Model.User.updateOne({ id: user.id }, {
        white_list: [],
        ignore_list: []
    })
}

exports.setParam = async (id, user) => await Model.User.updateOne({ id: id }, user)

exports.delete = async (user) => Model.User.deleteOne({ id: user.id })

exports.getActiveUsers = async () => await Model.User.find({ visible: true, active: true })

exports.save = async user => await user.save()

exports.updateStats = async (user, index, stat) => {
    await Model.User.findByIdAndUpdate(user._id, { [`stats.${index}`]: stat })
}

// Remove user
exports.remove = async id => Model.User.remove({ id: id })

// Cleaning up the user database
exports.cleaner = async () => Model.User.remove({})