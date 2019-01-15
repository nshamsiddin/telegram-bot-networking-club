const User = require('../controllers/user')
const Quiz = require('../controllers/quiz')
const Question = require('../controllers/question')
const actions = require('../actions')

module.exports = (event, state, map, send) => {

    event.on('quiz', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_quiz_type'), action, 3)
        next && next()
    })

    event.on('quiz:new', async (user, msg, action, next) => {
        let quiz = await actions.generateQuiz('new', user)
        console.log(quiz)
        if (quiz) {
            event.emit('quiz:send:question_new', action, user, msg)
            next && next()
        } else {
            send.error(user.id, locale('no_quiz'))
        }
    })

    event.on('quiz:new:await:yes', async (user, msg, action, next) => {
        actions.addToList(user, msg.text)
        event.emit('quiz:send:question_new', action, user, msg)
    })

    event.on('quiz:new:await:no', async (user, msg, action, next) => {
        actions.addToList(user, msg.text)
        event.emit('quiz:send:question_new', action, user, msg)
    })

    event.on('quiz:name', async (user, msg, action, next) => {
        if (await actions.generateQuiz('name', user)) {
            event.emit('quiz:send:question', user, msg)
            next && next()
        } else {
            send.error(user.id, locale('no_quiz'))
        }
    })

    event.on('quiz:name:await', async (user, msg, action, next) => {
        actions.setAnswer(user.last_question, msg.text)
        event.emit('quiz:send:question', user, msg)
    })

    event.on('quiz:job', async (user, msg, action, next) => {
        if (await actions.generateQuiz('job', user)) {
            event.emit('quiz:send:question', user)
            next && next()
        } else {
            send.error(user.id, locale('no_quiz'))
        }
    })

    event.on('quiz:job:await', async (user, msg, action, next) => {
        actions.setAnswer(user.last_question, msg.text)
        event.emit('quiz:send:question', user, msg)
    })

    event.on('quiz:generate', async (type, user) => {
        await actions.generateQuiz(type, user)
        event.emit('quiz:send:question', user)
    })

    event.on('quiz:send:question_new', async (action, user, msg) => {
        let quiz = await Quiz.getQuestions(user.active_quiz)
        let question = await Question.getUnanswered(quiz.questions)
        if (question) {
            let tmp_user = (await User.get(question.correct_answer.id))
            send.photo(user.id, tmp_user.photo, tmp_user.name)
            send.keyboard(user.id, 'Select option', action)

            user.last_question = question._id
            await User.save(user)

            question.sent = true
            await Question.save(question)
        }
        else {
            send.message(user.id, locale('quiz_completed'))
            event.emit('location:home', user, msg)
        }

    })

    event.on('quiz:send:question', async (user, msg) => {
        let quiz = await Quiz.getQuestions(user.active_quiz)
        let question = await Question.getUnanswered(quiz.questions)
        if (question) {
            send.question(user.id, question.options, (await User.get(question.correct_answer.id)).photo)

            user.last_question = question._id
            User.save(user)

            question.sent = true
            Question.save(question)
        }
        else {
            send.message(user.id, locale('quiz_completed'))
            event.emit('location:home', user, msg)
        }
    })

}