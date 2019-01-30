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
                const question = await Question.create(quiz._id, type, {
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
                send.error(user.id, locale('no_quiz'))
        })

        event.on('quiz:new:await', async (user, msg, action, next) => {
            const quiz = await Quiz.get(user.active_quiz)
            const last_question_id = quiz.questions[quiz.cursor - 1]
            const question = await Question.get(last_question_id)
            const u_id = question.correct_answer.id
            //add to appropriate list
            switch (msg.text) {
                case locale('know'):
                    user.ignore_list.push(u_id)
                    break
                case locale('remember'):
                    user.white_list.push(u_id)
                    break
                default:
                    send.message(user.id, locale('choose_from_list'))
                    return
            }
            await User.save(user)

            //check if there is another question
            if (quiz.questions[quiz.cursor]) {
                event.emit('quiz:send:new', user, msg, action, quiz)
            }
            else {
                quiz.completed = true
                await Quiz.save(quiz)
                send.messageHiddenKeyboard(user.id, locale_pick('quiz_completed'))
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
            if (quiz.questions) {
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
            if (quiz.questions) {
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

    async function processAnswer(user, msg, type) {
        const quiz = await Quiz.get(user.active_quiz)
        const last_question_id = quiz.questions[quiz.cursor - 1]
        const question = await Question.get(last_question_id)
        question.correct = (msg.text === question.correct_answer.text)
        await Question.save(question)
        send.messageHiddenKeyboard(user.id, question.correct ? locale_pick('correct') : locale_pick('incorrect'))
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
                result = locale('report_after_quiz',
                    emoji.emojify(correct + incorrect),
                    emoji.emojify(correct),
                    emoji.emojify(incorrect))
                send.messageHiddenKeyboard(user.id, result)
                setTimeout(() => {
                    event.emit('location:home', user, msg)
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
            const question = await Question.createWithOptions(quiz._id, type, correct_answer, options)
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
}