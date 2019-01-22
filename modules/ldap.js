const config = require('../config')
const ActiveDirectory = require('activedirectory')
const ad = new ActiveDirectory(config.ad)
const User = require('../app/controllers/user')
const send = require('../app/send')
const { event } = require('../app/event')

exports.createUser = (username, password, id) => {
    ad.authenticate(`${username}@${config.domain.name}`, password, (err, auth) => {
        if (err) console.log(err)
        if (auth) {
            ad.findUser(username, (err, info) => {
                let user = {
                    id: id,
                    name: info.displayName,
                    department: getDepartment(info.dn),
                }
                User.create(user)
                send.message(id, locale('user_created'))
            })
        }
        else{
            send.message(id, locale('wrong_credentials'))
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