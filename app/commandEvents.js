const ee = require('events')
const event = new ee.EventEmitter()
const send = require('../modules/telegam')

event.on('/start', msg => {
    send.keyboard(msg.from.id, locale('welcome'), [locale('register')])
})

event.on('/home', (msg, map) => {
    send.keyboard(msg.from.id, locale('choose_action'), map, 2)
})



module.exports = event
