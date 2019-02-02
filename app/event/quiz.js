const User = require('../controllers/user')
const Quiz = require('../controllers/quiz')
const Question = require('../controllers/question')
const Config = require('../controllers/config')
const actions = require('../actions')
const emoji = require('../../modules/decoder')
const shuffle = require('shuffle-array')


module.exports = (event, state, map, send) => {

    event.on('quiz', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_quiz_type'), action, 3)
        next && next()
    })

    //New quiz handlers
    {
        event.on('quiz:new', async (user, msg, action, next) => {
            const type = 'new'
            const quiz = await Quiz.create(user.id)
            let count = 0
            let users = (await User.getActiveUsers())
                .filter((u) => !user.white_list.includes(u.id) && !user.ignore_list.includes(u.id) && u.id != user.id)
                .splice(0, (await Config.get('quiz', type)).size)
            for (let u of users) {
                const question = await Question.create(quiz._id, user.id, type, {
                    id: u.id,
                    photo: u.photo,
                    caption: `${u.name}\n${u.job}`
                })
                quiz.questions.push(question._id)
                count++
            }
            await Quiz.save(quiz)
            user.active_quiz = quiz._id
            await User.save(user)
            if (count) {
                event.emit('quiz:send:new', user, msg, action, quiz)
                next && next()
            }
            else
                send.error(user.id, locale('no_new_quiz'))
        })

        event.on('quiz:new:await', async (user, msg, action, next) => {
            const quiz = await Quiz.get(user.active_quiz)
            const last_question_id = quiz.questions[quiz.cursor - 1]
            const question = await Question.get(last_question_id)
            const u_id = question.correct_answer.id
            //add to appropriate list
            switch (msg.text) {
                case locale('know'):
                    question.know = true
                    user.ignore_list.push(u_id)
                    break
                case locale('remember'):
                    question.know = false
                    user.white_list.push(u_id)
                    break
                default:
                    send.message(user.id, locale('choose_from_list'))
                    return
            }
            await Question.save(question)
            // console.log('know : ' + know)
            // console.log('remember : ' + remember)
            // await recordStatsNew(user, 'quiz_new', know, remember)
            await User.save(user)

            //check if there is another question
            if (quiz.questions[quiz.cursor]) {
                event.emit('quiz:send:new', user, msg, action, quiz)
            }
            else {
                let know = 0
                let remember = 0
                for (let question_id of quiz.questions) {
                    (await Question.get(question_id)).know ? know++ : remember++
                }

                await recordStatsNew(user, 'quiz_new', know, remember)

                quiz.completed = true
                await Quiz.save(quiz)
                const text = `${locale_pick('quiz_completed')}\n*${locale('completed_new', emoji.emojify(quiz.cursor))}*`
                send.messageHiddenKeyboard(user.id, text)
                setTimeout(() => {
                    event.emit('location:back', user, msg)
                }, 100)
            }

        })

        event.on('quiz:send:new', async (user, msg, action, quiz) => {

            const question = await Question.get(quiz.questions[quiz.cursor++])
            const record = question.correct_answer
            const buttons = [locale('know'), locale('remember')]

            //TODO: need to check if photo still exists
            send.photoAndKeyboard(user.id, record.photo, record.caption, buttons)
            await Quiz.save(quiz)

        })
    }

    //Name quiz handlers
    {
        event.on('quiz:name', async (user, msg, action, next) => {
            let quiz = await generateQuiz(user, 'name')
            if (quiz.questions.length) {
                event.emit('quiz:send:name', user, msg, action, quiz)
                next && next()
            }
            else
                send.error(user.id, locale('no_quiz'))

        })

        event.on('quiz:name:await', async (user, msg, action, next) => {
            await processAnswer(user, msg, 'name')
        })

        event.on('quiz:send:name', async (user, msg, action, quiz) => {
            await sendQuestion(user, quiz)
        })

    }

    //Job quiz handlers
    {
        event.on('quiz:job', async (user, msg, action, next) => {
            let quiz = await generateQuiz(user, 'job')
            if (quiz.questions.length) {
                event.emit('quiz:send:job', user, msg, action, quiz)
                next && next()
            }
            else
                send.error(user.id, locale('no_quiz'))

        })

        event.on('quiz:job:await', async (user, msg, action, next) => {
            await processAnswer(user, msg, 'job')
        })

        event.on('quiz:send:job', async (user, msg, action, quiz) => {
            await sendQuestion(user, quiz)

        })

    }

    //Methods
    async function processAnswer(user, msg, type) {
        const quiz = await Quiz.get(user.active_quiz)
        const last_question_id = quiz.questions[quiz.cursor - 1]
        const question = await Question.get(last_question_id)
        question.correct = (msg.text === question.correct_answer.text)
        await Question.save(question)
        send.messageHiddenKeyboard(user.id, question.correct
            ? locale_pick('correct_answer_feedback')
            : locale_pick('incorrect_answer_feedback'))
        setTimeout(async () => {
            //check if there is another question
            if (quiz.questions[quiz.cursor]) {
                event.emit(`quiz:send:${type}`, user, msg, null, quiz)
            }
            else {
                quiz.completed = true
                await Quiz.save(quiz)
                let result, correct = 0, incorrect = 0
                for (let question_id of quiz.questions) {
                    (await Question.get(question_id)).correct ? correct++ : incorrect++
                }
                await recordStats(user, 'total', correct, incorrect)
                await recordStats(user, 'quiz_' + type, correct, incorrect)
                const text = `${locale_pick('quiz_completed')}\n*${locale('completed', emoji.emojify(quiz.cursor))}*`
                // result = locale('report_after_quiz',
                //     emoji.emojify(correct + incorrect),
                //     emoji.emojify(correct),
                //     emoji.emojify(incorrect))
                send.messageHiddenKeyboard(user.id, text)
                setTimeout(() => {
                    event.emit('location:back', user, msg)
                }, 1000)
            }
        }, 1000)
    }

    async function generateQuiz(user, type) {
        // console.log(user)
        const config = await Config.get('quiz', type)
        const quiz = await Quiz.create(user.id)
        let users = shuffle(await User.getActiveUsers())
            .filter((u) => user.white_list.includes(u.id))
        const final_list = users.slice(0, config.size)

        for (let u of final_list) {
            const correct_answer = { id: u.id, text: u[type], photo: u.photo, caption: locale(`quiz_${type}_question_${u.gender}`) }
            //TODO: check if no enough options
            const options = shuffle(users.filter((p) => p.id !== u.id))
                .slice(0, config.size - 1)
                .map(p => (p[type]))
            options.push(correct_answer.text)
            shuffle(options)
            const question = await Question.createWithOptions(quiz._id, user.id, type, correct_answer, options)
            quiz.questions.push(question._id)
        }
        await Quiz.save(quiz)
        user.active_quiz = quiz._id
        await User.save(user)
        return quiz
    }

    async function sendQuestion(user, quiz) {
        const question = await Question.get(quiz.questions[quiz.cursor++])
        const record = question.correct_answer
        const buttons = question.options

        //TODO: need to check if photo still exists
        send.photoAndKeyboard(user.id, record.photo, record.caption, buttons)
        await Quiz.save(quiz)
    }

    async function recordStats(user, type, correct, incorrect) {
        const index = user.stats.findIndex(p => p.type === type)
        let stat = {}
        if (index !== -1) {
            stat = {
                type: type,
                count: user.stats[index].count + correct + incorrect,
                correct: user.stats[index].correct + correct,
                incorrect: user.stats[index].incorrect + incorrect
            }
            await User.updateStats(user, index, stat)
        }
        else {
            stat = {
                type: type,
                count: correct + incorrect,
                correct: correct,
                incorrect: incorrect
            }
            user.stats.push(stat)
            await User.save(user)
        }

    }

    async function recordStatsNew(user, type, know, remember) {
        const index = user.stats.findIndex(p => p.type === type)
        let stat = {}
        if (index !== -1) {
            stat = {
                type: type,
                count: user.stats[index].count + know + remember,
                know: user.stats[index].know + know,
                remember: user.stats[index].remember + remember
            }
            await User.updateStats(user, index, stat)
        }
        else {
            stat = {
                type: type,
                count: know + remember,
                know: know,
                remember: remember
            }
            user.stats.push(stat)
            await User.save(user)
        }
    }
}