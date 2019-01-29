const decoder = require('../../modules/decoder')
const User = require('../controllers/user')

module.exports = (event, state, map, send) => {

    event.on('stats', (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_action'), action, 2)
        next && next()
    })

    event.on('stats:progress', async (user, msg, action, next) => {

        let text = `${locale('stats')}\n\n`
        text += `\`${locale('quizzes_completed')}:\` ${decoder.emojify(user.quizzes.length)}`
        

        await send.message(user.id, text, { parse_mode: 'markdown' })
    })
}
