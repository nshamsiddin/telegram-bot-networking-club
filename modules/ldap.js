const config = require('../resources/config')
const ActiveDirectory = require('activedirectory')
const ad = new ActiveDirectory(config.ad)
const User = require('../app/controllers/user')
const send = require('./telegam')
const { event, state } = require('../app/event')

exports.ad = ad

exports.createUser = async (username, password, id) => {
    let user = {
        id: id,
        name: 'Shamsiddin Nabiev',
        department: 'IT',
        username: username
    }
    await User.create(user)
    return
    ad.authenticate(`${username}@${config.domain.name}`, password, async (err, auth) => {
        if (err) {
            logger(err, __filename, id)
            return
        }
        if (auth) {
            ad.findUser(username, async (err, info) => {
                if (err) {
                    logger(err, __filename, id)
                    return
                }
                let user = {
                    id: id,
                    name: info.displayName,
                    department: getDepartment(info.dn),
                    username: username
                }
                await User.create(user)
            })
        }
        else {
            event.emit('credentials:wrong', id)
        }
    })
}
exports.findUser = async (username, id, event, action, next) => {
    let user = {
        id: id,
        name: username,
        department: 'getDepartment(info.dn)',
        username: username
    }
    event.emit('username:right', user, action, next)
    return
    await ad.findUser(username, (err, info) => {
        if (err) {
            logger(err, __filename, id)
            return
        }
        if (info) {
            try {
                let user = {
                    id: id,
                    name: info.displayName,
                    department: getDepartment(info.dn),
                    username: username
                }
                event.emit('username:right', user, action, next)
            }
            catch (e) {
                logger(e, __filename, null)
            }
        }
        else {
            event.emit('username:wrong', id, username)
        }
    })
}

function getDepartment(dn) {
    let i = 0
    let v = dn.split(',').reduce((obj, str, index) => {
        let strParts = str.split('=')
        if (strParts[0] && strParts[1]) {
            obj[i++] = strParts[1].trim()
        }
        return obj
    }, {})
    return v[1]
}