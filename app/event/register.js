const User = require('../controllers/user')
const ldap = require('../../modules/ldap')
const actions = require('../actions')
// const config = require('../../config')
// const ActiveDirectory = require('activedirectory')
// const ad = new ActiveDirectory(config.ad)

module.exports = async (event, state, map, send) => {

    event.on('register:location:back', (user, msg) => {
        state[msg.from.id].splice(-1, 1)
        const reducer = state[msg.from.id].reduce((path, item) => {
            msg.text = item
            if (!path.children) {
                return path
            } else {
                if (path.children.hasOwnProperty(item)) {
                    return path.children[item]
                } else {
                    if (path.children.hasOwnProperty('*')) {
                        return path.children['*']
                    } else {
                        return path
                    }
                }
            }
        }, map)
        event.emit(reducer.event, user, msg, reducer)
    })

    event.on('register:init', (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_username'), action, 2)
        next && next()
    })

    //username handler
    {
        event.on('register:username', (user, msg, action, next) => {
            ldap.findUser(msg.text, msg.from.id, event, action, next)
            // send.keyboard(msg.from.id, locale('choose_action'), action, 2)
            // next && next()
        })

        event.on('id:exists', (user) => {
            send.message(user.id, locale('duplicate_id'))
        })

        event.on('username:exists', (user) => {
            send.message(user.id, locale('duplicate_username'))
        })

        event.on('username:wrong', (id, username) => {
            send.message(id, locale('wrong_username'))
            // send.keyboard(id, locale('choose_action'), action, 2)
        })

        event.on('username:right', (user, action, next) => {
            User.create(user, action, next)
        })

        event.on('user:created', async (user, action, next) => {
            send.keyboard(user.id, locale('set_job'), action, 2)
            next && next()
        })
    }

    //job handler
    {
        event.on('register:job', async (user, msg, action, next) => {
            user.job = msg.text
            User.save(user)
            const buttons = [locale('male'), locale('female'), locale('back')]
            send.keyboard(msg.from.id, locale('set_gender'), buttons, 2)
            next && next()
        })
    }

    //gender handler
    {
        event.on('register:gender', (user, msg, action, next) => {
            let result
            check_gender(user, msg.text, ['male', 'female']) ? result = 'success' : result = 'error'
            event.emit(`register:gender:${result}`, msg.from.id, action, next)
        })

        function check_gender(user, text, list) {
            for (let gender of list) {
                const options = getTranslations(gender)
                for (let translation in options) {
                    if (text === options[translation]) {
                        user.gender = gender
                        User.save(user)
                        return true
                    }
                }
            }
            return false
        }

        event.on('register:gender:error', (id) => {
            const buttons = [locale('male'), locale('female'), locale('back')]
            send.keyboard(id, locale('set_gender_error'), buttons, 2)
        })

        event.on('register:gender:success', (id, action, next) => {
            // const buttons = [locale('upload_photo'), locale('choose_photo'), locale('back')]
            send.keyboard(id, locale('set_photo'), action, 2)
            next && next()
        })

    }

    //photo handler
    {
        event.on('register:photo:upload', (user, msg, action, next) => {
            send.keyboard(msg.from.id, locale('upload_photo'), action)
            next && next()
        })

        event.on('register:photo:upload:await', (user, msg, action, next) => {
            if (msg.photo) {
                user.photo = msg.photo.pop().file_id
                User.save(user)
                event.emit('registration:complete', user, msg)
            }
            else
                send.message(msg.from.id, locale('upload_photo_error'))
        })

        event.on('register:photo:choose', (user, msg, action, next) => {
            send.profile_photos(user.id)
            // send.keyboard(msg.from.id, locale('choose_photo'), action)
            next && next()
        })

        event.on('register:photo:choose:await', (user, msg, action, next) => {
            send.profile_photos(user.id, msg.text)
        })

        event.on('register:photo:error', (user, msg, action, next) => {
            // send.keyboard(msg.from.id, locale('choose_action'), action, 2)
            // next && next()
        })

        event.on('register:photo', (user, msg, action, next) => {
            // send.keyboard(msg.from.id, locale('choose_action'), action, 2)
            // next && next()
        })


    }

    event.on('registration:complete', (user, msg) => {
        user.active = true
        User.save(user)
        send.messageHiddenKeyboard(user.id, locale('registration_complete'))
        setTimeout(function () {
            event.emit('location:home', user, msg)
        }, 3000)
    })

}

let file = {
    message_id: 17212,
    from:
    {
        id: 58235445,
        is_bot: false,
        first_name: 'Shamsiddin',
        language_code: 'en'
    },
    chat: { id: 58235445, first_name: 'Shamsiddin', type: 'private' },
    date: 1548529667,
    document:
    {
        file_name: 'alltor_meWindows_10_1809_Updated.torrent',
        mime_type: 'application/x-bittorrent',
        file_id: 'BQADBAADIgQAAl9TaFJIirk7_9wWSwI',
        file_size: 81495
    }
}
let photo = {
    message_id: 17213,
    from:
    {
        id: 58235445,
        is_bot: false,
        first_name: 'Shamsiddin',
        language_code: 'en'
    },
    chat: { id: 58235445, first_name: 'Shamsiddin', type: 'private' },
    date: 1548529702,
    photo:
        [{
            file_id: 'AgADBAADdq0xG19TaFJo3n6jHD9Ftqg9oBoABKPqPNqaUu37ylQHAAEC',
            file_size: 1689,
            width: 90,
            height: 80
        },
        {
            file_id: 'AgADBAADdq0xG19TaFJo3n6jHD9Ftqg9oBoABPUvbXcN9vs4y1QHAAEC',
            file_size: 12216,
            width: 320,
            height: 286
        },
        {
            file_id: 'AgADBAADdq0xG19TaFJo3n6jHD9Ftqg9oBoABG0HgF8MK52nzFQHAAEC',
            file_size: 33557,
            width: 800,
            height: 716
        },
        {
            file_id: 'AgADBAADdq0xG19TaFJo3n6jHD9Ftqg9oBoABL7eROMNRERnyVQHAAEC',
            file_size: 50947,
            width: 1144,
            height: 1024
        }]
}