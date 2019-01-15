const shuffle = require('shuffle-array')

const send = require('./send')
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


exports.generateQuiz = async (type, user) => {
    let quiz = await Quiz.add(user._id)
    let result = null
    const correct_answers = []
    let usersList = null
    console.log('1')
    usersList = await User.generateList(user, type)
    console.log('2')
    if (usersList.length < 1) {
        console.log('3')
        console.log(usersList.length)
    }
    else {
        switch (type) {
            case 'new':
                for (let i = 0; i < REVIEW_QUIZ_SIZE; i++) {
                    let question = await Question.add(quiz._id)
                    question.type = type
                    let option = getOption(true, usersList)
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
                        if (options.indexOf(option) === -1) {
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
            result = quiz
            console.log(result)
    }
    console.log(result)
    return result
    function getOption(correct) {
        const u = usersList[random(0, usersList.length - 1)]
        return option = {
            text: u[type] || null,
            id: u.id,
            correct: correct
        }
    }

}

exports.setAnswer = async (question_id, answer) => {
    let question = await Question.get(question_id)
    question.given_answer = answer
    question.correct_answer.text === answer ?
        question.correct = true
        : question.correct = false
    Question.save(question)
}

exports.addToList = async (user, answer) => {
    let question = await Question.get(user.last_question)
    // console.log(question.correct_answer.id)
    question.given_answer = answer


    switch (answer) {
        case locale('know'):
            question.correct_answer.id
                && user.ignore_list.push(question.correct_answer.id)
                && console.log('added to ignore' + question.correct_answer.id)
            break
        case locale('remember'):
            question.correct_answer.id
                && user.white_list.push(question.correct_answer.id)
                && console.log('added to white list' + question.correct_answer.id)
            break
    }
    // console.log(123123)
    await User.save(user)
    // console.log('test')
}