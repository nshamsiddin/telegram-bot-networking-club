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


    // Generate quiz
    const usersList = await User.generateUsersList(user.id)
    const correct_answers = []
    switch (type) {
        case 'new':
            for (let i = 0; i < REVIEW_QUIZ_SIZE; i++){
                
            }
            break
        default:
            for (let i = 0; i < QUIZ_SIZE; i++) {
                // Generate question
                let question = await Question.add(quiz._id)
                question.type = type
                let options = []
                // Generate option
                let found = false

                while (!found) {
                    let option = getOption(true)
                    if (correct_answers.indexOf(option) === -1) {
                        options.push(option)
                        question.correct_answer = option
                        correct_answers.push(option)
                        found = true
                    }
                }
                // Populate options
                while (options.length < OPTIONS_QNTY) {
                    let option = getOption(false)
                    if (options.indexOf(option) === -1) {
                        options.push(option)
                    }
                }

                function getOption(correct) {
                    const u = usersList[random(0, usersList.length - 1)]
                    return option = {
                        text: u[type],
                        id: u.id,
                        correct: correct
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

exports.setAnswer = async (question_id, answer) => {
    let question = await Question.get(question_id)
    question.given_answer = answer
    question.correct_answer.text === answer ?
        question.correct = true
        : question.correct = false
    Question.save(question)
}