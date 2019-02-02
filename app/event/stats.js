const decoder = require('../../modules/decoder')
const User = require('../controllers/user')
const Quiz = require('../controllers/quiz')
const Question = require('../controllers/question')
const emoji = require('../../modules/decoder')
module.exports = (event, state, map, send) => {

    event.on('stats', (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_action'), action, 2)
        next && next()
    })



    event.on('stats:progress', async (user, msg, action, next) => {
        let text = ``
        let exists = false
        user.stats
            .filter(stat => stat.type === 'quiz_new')
            .forEach(stat => {
                text += `*${locale(stat.type)}*\n`
                text += `${locale('quizzes_completed')} : ${emoji.emojify(stat.count)}\n`
                text += `${locale('know')} : ${emoji.emojify(stat.know)}\n`
                text += `${locale('remember')} : ${emoji.emojify(stat.remember)}\n`
                exists = true
            })
        text += `\`-------------------\n\``

        user.stats
            .filter(stat => stat.type !== 'quiz_new')
            .forEach(stat => {
                text += `*${locale(stat.type)}*\n`
                text += `${locale('quizzes_completed')} : ${emoji.emojify(stat.count)}\n`
                text += `${locale('correct')} : ${emoji.emojify(stat.correct)}\n`
                text += `${locale('incorrect')} : ${emoji.emojify(stat.incorrect)}\n\n`
                exists = true
            })

        exists ? send.message(user.id, text) : send.message(user.id, locale('no_progress'))
    })

}

