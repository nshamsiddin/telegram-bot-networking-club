const User = require('../controllers/user')
const ldap = require('../../modules/ldap')
module.exports = async (event, state, map, send) => {
    event.on('register', async (msg) => {
        const username = msg.text.split(' ')[0]
        const password = msg.text.split(' ')[1]
        if (await ldap.authenticate(username, password)) {
            let user = await ldap.findUser(username)
            user.id = msg.from.id
            await User.create(user)
            send.message(msg.from.id, locale('user_created'))
        }
        else {
            send.message(msg.from.id, locale('wrong_credentials'))
        }
    })
}