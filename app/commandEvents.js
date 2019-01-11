const ee = require('events')
const event = new ee.EventEmitter()
const send = require('./send')
const map = require('./map')

event.on('/start', msg => {
  send.keyboard(
    msg.from.id,
    `✋ Привет ${msg.from.first_name},\r
я 🤖 бот для развития нетворкинга между коллегами.\r
Первое, что необходимо сделать, это зарегистрироватся`,
    map
  )
})

event.on('/home', msg => {
  send.keyboard(msg.from.id, locale('choose_action'), map, 2)
})

module.exports = event
