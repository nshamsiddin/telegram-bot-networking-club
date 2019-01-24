const ee = require('events')
const event = new ee.EventEmitter()
const ldap = require('../modules/ldap')
const send = require('./send')
const map = require('./map')

event.on('register', async (msg) => {
    const username = msg.text.split(' ')[0]
    const password = msg.text.split(' ')[1]
    await ldap.createUser(username, password, msg.from.id)
})

event.on('credentials:wrong', (id) => {
    console.log('test')
    send.message(id, locale('wrong_credentials'))
})

module.exports = event
