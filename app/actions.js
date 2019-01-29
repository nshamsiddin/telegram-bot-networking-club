const shuffle = require('shuffle-array')

const bot = require('../modules/telegam')
const OPTIONS_QNTY = 3
const QUIZ_SIZE = 3
const REVIEW_QUIZ_SIZE = 10

const User = require('./controllers/user')
const Quiz = require('./controllers/quiz')
const Question = require('./controllers/question')

function random(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand)
    return rand
}

const required_params = [
    { name: 'username', text: 'Username' },
    { name: 'name', text: 'Name' },
    { name: 'job', text: 'Job' },
    { name: 'gender', text: 'Gender' },
    { name: 'photo', text: 'Photo' }]


exports.generateQuiz = async (type, user) => {
    let quiz = await Quiz.add(user._id)
    let result = null
    const correct_answers = []
    let usersList = null
    usersList = await User.generateList(user, type)
    if (usersList.length < 1) {
        return null;
    }
    else {
        switch (type) {
            case 'new':
                for (let i = 0; i < usersList.length && i < REVIEW_QUIZ_SIZE; i++) {
                    let question = await Question.add(quiz._id)
                    question.type = type
                    let option = {
                        text: null,
                        id: usersList[i].id,
                        correct: true
                    }
                    question.correct_answer = option
                    correct_answers.push(option)
                    await Question.save(question)
                    quiz.questions.push(question._id)
                }
                break
            default:
                for (let i = 0; i < QUIZ_SIZE; i++) {
                    let options = []

                    // Generate question
                    let question = await Question.add(quiz._id)
                    question.type = type

                    // Generate option
                    let found = false

                    while (!found) {
                        let option = getOption(true, usersList)
                        if (correct_answers.indexOf(option) === -1) {
                            options.push(option)
                            question.correct_answer = option
                            correct_answers.push(option)
                            found = true
                        }
                    }

                    // Populate options
                    while (options.length < OPTIONS_QNTY) {
                        let option = getOption(false, usersList)
                        options.filter(p => p.text)
                        if (!options.some(p => p.text === option.text)) {
                            // if (options.indexOf(option) === -1) {
                            options.push(option)
                        }
                    }

                    shuffle(options)
                    question.options = options
                    question.user = user._id

                    await Question.save(question)

                    quiz.questions.push(question._id)
                }
                break
        }
        await Quiz.save(quiz)

        // Add quiz to user
        await User.addQuiz(user, quiz._id)
        return quiz
    }
    function getOption(correct) {
        const u = usersList[random(0, usersList.length - 1)]
        return option = {
            text: u[type] || null,
            id: u.id,
            correct: correct
        }
    }

}

exports.setAnswer = async (user_id, question_id, answer) => {

    let text

    let question = await Question.get(question_id)
    question.given_answer = answer

    if (question.correct_answer.text === answer) {
        question.correct = true
        text = randomizeMessage(locale('correct'))
    }
    else {
        question.correct = false
        text = randomizeMessage(locale('incorrect'))
    }
    await Question.save(question)

    bot.message(user_id, text)
    await sleep(3000)
}

// Execution postponing
function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

function randomizeMessage(message) {
    let v = message.split(';')
    let result
    v.length > 1 ? result = shuffle.pick(v) : result = v
    return result
}

exports.addToList = async (user, answer) => {
    let question = await Question.get(user.last_question)
    // (question.correct_answer.id)
    question.given_answer = answer


    switch (answer) {
        case locale('know'):
            question.correct_answer.id
                && user.ignore_list.push(question.correct_answer.id)
            break
        case locale('remember'):
            question.correct_answer.id
                && user.white_list.push(question.correct_answer.id)
            break
    }
    await User.save(user)
}

exports.setParam = async (user, msg, param) => {
    let message = locale('change_success')
    param === 'gender' ? user[param] = cast_gender(msg.text) : user[param] = msg.text
    await User.save(user)
    bot.message(msg.from.id, message)
}

function cast_gender(text) {
    const genders = ['male', 'female']
    for (let gender of genders) {
        const options = getTranslations(gender)
        for (let translation in options) {
            if (text === options[translation]) {
                return gender
            }
        }
    }
    // if (['male', 'Male', 'мужчина', 'Мужчина'].indexOf(text) !== -1)
    //     return 'male'
    // if (['female', 'Female', 'женшина', 'Женшина'].indexOf(text) !== -1)
    //     return 'female'
}