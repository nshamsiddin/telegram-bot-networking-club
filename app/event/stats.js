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
                    text += `${locale('know')} : ${emoji.emojify(stat.know)}\n`
                    text += `${locale('remember')} : ${emoji.emojify(stat.remember)}\n\`===================\`\n`
                }
                else {
                    text += `*${locale(stat.type)}*\n`
                    text += `${locale('quizzes_completed')} : ${emoji.emojify(stat.count)}\n`
                    text += `${locale('correct')} : ${emoji.emojify(stat.correct)}\n`
                    text += `${locale('incorrect')} : ${emoji.emojify(stat.incorrect)}\n\`-------------------\`\n`
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
        let current = false
        let text = ''
        for (let i in users) {
            users[i].id === user.id ? current = true : current = false
            text += `${emoji.emojify(i * 1 + 1)} *${users[i].name}*${current ? '⬅' : ''}\n`
            text += `${locale('quizzes_completed')} : *${users[i].count}*${current ? '⬅' : ''}\n`
            text += `${locale('correct')} : *${getPercent(users[i].correct, users[i].count)}*${current ? '⬅' : ''}\n\n`
        }
        send.message(user.id, text)
    })

    event.on('stats:top:department', async (user, msg, action, next) => {
        let users = await getTopUsers('department', user)
        let text = ''
        let current = false
        for (let i in users) {
            users[i].id === user.id ? current = true : current = false
            text += `${emoji.emojify(i * 1 + 1)} *${users[i].name}*${current ? ' ⬅' : ''}\n`
            text += `${locale('quizzes_completed')} : *${users[i].count}*${current ? ' ⬅' : ''}\n`
            text += `${locale('correct')} : *${getPercent(users[i].correct, users[i].count)}*${current ? ' ⬅' : ''}\n\n`
        }
        send.message(user.id, text)
    })

    function getPercent(correct, count) {
        if (count == 0)
            return count
        else
            return (correct * 100 / count).toFixed(2)
    }

    async function getTopUsers(criteria, user) {
        let length
        switch (criteria) {
            case 'department':
                length = 3
                break
            case 'company':
                length = 10
                break
        }
        return (await User.getActiveUsers())
            .filter(u => criteria === 'department' ? u.department === user.department : true)
            .sort((a, b) => {
                const index_a = a.stats.findIndex(stat => stat.type === 'total')
                const index_b = b.stats.findIndex(stat => stat.type === 'total')
                return b.stats[index_a].count - a.stats[index_b].count
            })
            .slice(0, length)
            .map(u => ({
                id: u.id,
                name: u.name,
                type: u.stats[1] ? u.stats[1].type : '',
                count: u.stats[1] ? u.stats[1].count : 0,
                correct: u.stats[1] ? u.stats[1].correct : 0,
                incorrect: u.stats[1] ? u.stats[1].incorrect : 0
            }))
    }

}

