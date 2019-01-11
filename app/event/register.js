const User = require('../controllers/user')
const Quiz = require('../controllers/quiz')
const Question = require('../controllers/question')
const actions = require('../actions')

module.exports = (event, send) => {
    event.on('quiz', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_quiz_type'), action)
        next && next()
    })
}