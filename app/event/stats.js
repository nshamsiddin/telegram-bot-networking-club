const decoder = require('../../modules/decoder')
const User = require('../controllers/user')
const Quiz = require('../controllers/quiz')
const Question = require('../controllers/question')

module.exports = (event, state, map, send) => {

    event.on('stats', (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_action'), action, 2)
        next && next()
    })

    const user = {
        active: true,
        visible: true,
        stats:
            [{ type: 'new', count: 1, know: 0, remember: 1 },
            { type: 'name', count: 3, correct: 3, incorrect: 0 }],
        white_list:
            [50793136,
                94776869,
                10165154,
                457349299,
                2285318,
                175723660,
                774070049],
        ignore_list: [24712527],
        active_quiz: '5c520d58ca440819d0082385',
        last_question: null,
        _id: '5c4f4fe9c335392e88a3654b',
        id: 58235445,
        name: 'Shamsiddin Nabiev',
        department: 'getDepartment(info.dn)',
        username: 'Shgshs',
        created: '2019-01-28T18:54:33.516Z',
        __v: 152,
        job: 'Рихтовщик\t',
        photo: 'AgADBAAD7K8xGzWaeAPWIWWvWLpP754QoBkABKi1b4DZbHE9U-QAAgI',
        gender: 'male',
        last_active: '2019-01-30T03:32:27.093Z'
    }

    event.on('stats:progress', async (user, msg, action, next) => {
        let text
        user.stats
            .filter(stat => stat.type !== 'new')
            .forEach(stat => {
                text = ``
                console.log(stat)
            })

    })

    event.emit('stats:progress', user, null, null, null)
}

