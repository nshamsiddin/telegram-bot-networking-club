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
            .forEach(stat => {
                if (stat.type === 'quiz_new') {
                    text += `*${locale(stat.type)}*\n`
                    text += `${locale('quizzes_completed')} : ${emoji.emojify(stat.count)}\n`
                    text += `${locale('know')} : ${emoji.emojify(stat.know)} *${((stat.know * 100 / stat.count).toFixed(2))}%*\n`
                    text += `${locale('remember')} : ${emoji.emojify(stat.remember)}\n\`===================\`\n`
                }
                else {
                    text += `*${locale(stat.type)}*\n`
                    text += `${locale('quizzes_completed')} : ${emoji.emojify(stat.count)}\n`
                    text += `${locale('correct')} : ${emoji.emojify(stat.correct)} *${(stat.correct * 100 / stat.count).toFixed(2)}%*\n`
                    text += `${locale('incorrect')} : ${emoji.emojify(stat.incorrect)} *${(stat.incorrect * 100 / stat.count).toFixed(2)}%*\n\`-------------------\`\n`
                }
                exists = true
            })
        exists ? send.message(user.id, text) : send.message(user.id, locale('no_progress'))
    })

    event.on('stats:top', (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_criteria'), action, 2)
        next && next()
    })

    event.on('stats:top:company', async (user, msg, action, next) => {
        let users = await getTopUsers('company', user)
        let text = ''
        for (let i in users) {
            text += `${emoji.emojify(i * 1 + 1)} *${users[i].name}*\n`
            text += `${locale('quizzes_completed')} : *${users[i].count}*\n`
            text += `${locale('correct')} : *${((users[i].correct * 100 / users[i].count).toFixed(2))}*\n\n`
        }
        send.message(user.id, text)
    })

    event.on('stats:top:department', async (user, msg, action, next) => {
        let users = await getTopUsers('department', user)
        let text = ''
        for (let i in users) {
            text += `${emoji.emojify(i * 1 + 1)} *${users[i].name}*\n`
            text += `${locale('quizzes_completed')} : *${users[i].count}*\n`
            text += `${locale('correct')} : *${((users[i].correct * 100 / users[i].count).toFixed(2))}*\n\n`
        }
        send.message(user.id, text)
    })

    async function getTopUsers(criteria, user) {
        return (await User.getActiveUsers())
            .filter(u => criteria === 'department' ? u.department === user.department : true)
            .sort((a, b) => { return b.stats[1].count - a.stats[1].count })
            .slice(0, 3)
            .map(u => ({
                name: u.name,
                type: u.stats[1].type,
                count: u.stats[1].count,
                correct: u.stats[1].correct,
                incorrect: u.stats[1].incorrect
            }))
    }

}

