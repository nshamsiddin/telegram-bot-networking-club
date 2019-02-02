const User = require('../controllers/user')
const ldap = require('../../modules/ldap')
const actions = require('../actions')

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
        send.messageHiddenKeyboard(msg.from.id, locale('set_username'))
        next && next()
    })

    //username handler
    {
        event.on('register:username', (user, msg, action, next) => {
            ldap.findUser(msg.text, msg.from.id, event, action, next)
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
            send.message(user.id, locale('set_job'))
            next && next()
        })
    }

    //job handler
    {
        event.on('register:job', async (user, msg, action, next) => {
            user.job = msg.text
            await User.save(user)
            const buttons = [locale('male'), locale('female')]
            send.keyboard(msg.from.id, locale('set_gender'), buttons, 2)
            next && next()
        })
    }

    //gender handler
    {
        event.on('register:gender', async (user, msg, action, next) => {
            let result
            await check_gender(user, msg.text, ['male', 'female']) ? result = 'success' : result = 'error'
            event.emit(`register:gender:${result}`, msg.from.id, action, next)
        })

        async function check_gender(user, text, list) {
            for (let gender of list) {
                const options = getTranslations(gender)
                for (let translation in options) {
                    if (text === options[translation]) {
                        user.gender = gender
                        await User.save(user)
                        return true
                    }
                }
            }
            return false
        }

        event.on('register:gender:error', (id) => {
            const buttons = [locale('male'), locale('female')]
            send.keyboard(id, locale('choose_from_list'), buttons, 2)
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
            send.messageHiddenKeyboard(msg.from.id, locale('upload_photo'))
            next && next()
        })

        event.on('register:photo:upload:await', async (user, msg, action, next) => {
            if (msg.photo) {
                user.photo = msg.photo.pop().file_id
                await User.save(user)
                event.emit('registration:complete', user, msg)
            }
            else
                send.message(msg.from.id, locale('upload_photo_error'))
        })

        event.on('register:photo:choose', (user, msg, action, next) => {
            send.profile_photos(user.id, 0, event, msg, action, next)
        })

        event.on('register:photo:choose:success', (next) => {
            console.log('test')
            next && next()
        })
        
        event.on('register:photo:choose:error', (chat_id) => {
            console.log('test1')
            send.error(chat_id, locale('choose_photo_error'))
        })

        event.on('register:photo:choose:await', (user, msg, action, next) => {
            send.profile_photos(user.id, msg.text)
        })

    }

    event.on('registration:complete', async (user, msg) => {
        user.active = true
        await User.save(user)
        send.messageHiddenKeyboard(user.id, locale('registration_complete'))
        setTimeout(function () {
            event.emit('location:home', user, msg)
        }, 3000)
    })

}
