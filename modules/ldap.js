const config = require('../config')
const ActiveDirectory = require('activedirectory')
const ad = new ActiveDirectory(config.ad)
const User = require('../app/controllers/user')

exports.createUser = async (username, password, id) => {
    console.log(`${username}@${config.domain.name}/${password}`)
    let result
    await ad.authenticate(`${username}@${config.domain.name}`, password, (err, auth) => {
        if (err) console.log(err)
        if (auth) {
            ad.findUser(username, (err, info) => {
                let user = {
                    id: id,
                    name: info.displayName,
                    department: getDepartment(info.dn),
                }
                User.create(user)
            })
            result = true
        } else
            result = false
    })
    console.log(result)
    return result
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