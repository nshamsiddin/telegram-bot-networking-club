const User = require('../controllers/user')
const ldap = require('../../modules/ldap')
const files = require('../../modules/files')
const qrcode = require('../../modules/qrcode')
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

    event.on('register:activate', (user, msg, action, next) => {
        send.messageHiddenKeyboard(msg.from.id, locale('set_username'))
        next && next()
    })

    event.on('register:password', async (user, msg, action, next) => {
        let password = null
        if (msg.photo) {
            const file = await send.getFile(msg)
            password = await qrcode.scan(file.url, msg, event)
        }
        else {
            password = msg.text
        }
        let new_user = await User.getByPassword(password)
        if (new_user) {
            new_user.id = msg.from.id
            new_user.tmp_password_used = true
            new_user.active = true
            await User.save(new_user)
            event.emit('registration:complete', new_user, msg)
        }
        else {
            event.emit('register:password:error', msg)
        }
    })

    event.on('register:password:qr:error', msg => {
        send.message(msg.from.id, locale('qr_error'))
    })

    event.on('register:password:error', msg => {
        send.message(msg.from.id, locale('wrong_password'))
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
                const options = get_translations(gender)
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
            send.profile_photos(user.id, 0, next)
        })

        event.on('register:photo:choose:await', (user, msg, action, next) => {
            send.profile_photos(user.id, msg.text, next)
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
