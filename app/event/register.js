const User = require('../controllers/user')
const ldap = require('../../modules/ldap')
module.exports = async (event, state, map, send) => {
    event.on('register', async (msg) => {
        const username = msg.text.split(' ')[0]
        const password = msg.text.split(' ')[1]
        if (await ldap.createUser(username, password, msg.from.id)) {
        }
        else {
            send.message(msg.from.id, locale('wrong_credentials'))
        }
    })
}