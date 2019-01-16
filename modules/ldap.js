const config = require('../config')
let ActiveDirectory = require('activedirectory')
let ad = new ActiveDirectory(config.ad)

exports.authenticate = async (username, password) => {
    ad.authenticate(username + '@UNITEL_MAIN', password, (err, auth) => {
        if (err) {
            console.log(err)
            return null
        }
        console.log(auth)
        return auth
    })
}


exports.findUser = async (username) => {
    await ad.findUser(username, (err, user) => {
        if (err) {
            console.log(err)
            return null
        }
        if (user) {
            console.log(user)
            return {
                name: user.dispayName,
                department: getDepartment(user.dn)
            }
        }
        else return null
    })
}


function getDepartment(dn) {
    let i = 0
    let v = dn.split(',').reduce((obj, str, index) => {
        let strParts = str.split('=')
        if (strParts[0] && strParts[1]) {
            obj[i++] = strParts[1].trim()
            // obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim()
        }
        return obj
    }, {})
    console.log(v[1])
}