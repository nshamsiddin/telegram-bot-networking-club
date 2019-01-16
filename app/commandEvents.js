const ee = require('events')
const event = new ee.EventEmitter()
const send = require('./send')
const map = require('./map')

event.on('/start', msg => {
    send.message(msg.from.id, `Send your username and password separated by space`)
})

event.on('/home', msg => {
    send.keyboard(msg.from.id, locale('choose_action'), map, 2)
})


module.exports = event
