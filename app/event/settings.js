const User = require('../controllers/user')
const actions = require('../actions')

module.exports = (event, state, map, send) => {

    event.on('settings', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_action'), action, 3)
        next && next()
    })

    event.on('settings:set', async (user, msg, action, next) => {
        const caption = `\` 👔  : ${user.name}\n\n 💼  : ${user.job}\n\n♀️♂️ : ${locale(user.gender)}\``
        // send.photo(user.id, user.photo, caption)
        // setTimeout(() => {
        //     send.keyboard(msg.from.id, locale('choose_action'), action, 4)
        // }, 100)

        send.photoAndKeyboard(user.id, user.photo, caption, action, 4)

        next && next()
    })

    event.on('settings:set:username', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_name'), action)
        next && next()
    })

    event.on('settings:set:username:await', async (user, msg, action, next) => {
        actions.setParam(user, msg, 'username')
        event.emit('location:back', user, msg)
    })

    event.on('settings:set:department', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_department'), action)
        next && next()
    })

    event.on('settings:set:department:await', async (user, msg, action, next) => {
        actions.setParam(user, msg, 'department')
        event.emit('location:back', user, msg)
    })


    //name handler
    {
        event.on('settings:set:name', async (user, msg, action, next) => {
            send.keyboard(msg.from.id, locale('set_name'), action)
            next && next()
        })

        event.on('settings:set:name:await', async (user, msg, action, next) => {
            if (msg.text.length < 128) {
                user.name = msg.text
                await User.save(user)
                event.emit('settings:set:success', user, msg)
            }
            else {
                send.message(msg.from.id, locale('set_name_error'))
            }
        })
    }

    //job handler
    {
        event.on('settings:set:job', async (user, msg, action, next) => {
            send.keyboard(msg.from.id, locale('set_job'), action)
            next && next()
        })

        event.on('settings:set:job:await', async (user, msg, action, next) => {
            if (msg.text.length < 128) {
                user.job = msg.text
                await User.save(user)
                event.emit('settings:set:success', user, msg)
            }
            else {
                send.message(msg.from.id, locale('set_name_error'))
            }
        })
    }

    //photo handler
    {
        event.on('settings:set:photo', async (user, msg, action, next) => {
            send.keyboard(msg.from.id, locale('set_photo'), action)
            next && next()
        })

        event.on('settings:set:photo:upload', async (user, msg, action, next) => {
            send.keyboard(msg.from.id, locale('upload_photo'), action)
            next && next()
        })

        event.on('settings:set:photo:upload:await', async (user, msg, action, next) => {
            if (msg.photo) {
                msg.text = msg.photo[msg.photo.length - 1].file_id
                actions.setParam(user, msg, 'photo')
                event.emit('location:back', user, msg)
            }
            else {
                send.message(msg.from.id, locale('no_photo_detected'))
                event.emit('location:back', user, msg)
            }
        })

        event.on('settings:set:photo:choose', (user, msg, action, next) => {
            send.profile_photos(user.id, 0, next)
        })

        event.on('settings:set:photo:choose:await', (user, msg, action, next) => {
            send.profile_photos(user.id, msg.text, next)
        })


    }

    //gender handler
    {
        event.on('settings:set:gender', async (user, msg, action, next) => {
            send.keyboard(msg.from.id, locale('set_gender'), action)
            next && next()
        })

        event.on('settings:set:gender:await', async (user, msg, action, next) => {
            let result = cast_gender(msg.text)
            if (result) {
                user.gender = result
                await User.save(user)
                event.emit('settings:set:success', user, msg)
            }
            else {
                send.message(msg.from.id, locale('choose_from_list'))
            }
        })

        function cast_gender(text) {
            const genders = ['male', 'female']
            for (let gender of genders) {
                const options = get_translations(gender)
                for (let translation in options) {
                    if (text === options[translation]) {
                        return gender
                    }
                }
            }
            return false
        }

    }

    event.on('settings:set:success', (user, msg) => {
        send.message(msg.from.id, locale('change_success'))
        setTimeout(() => {
            event.emit('location:back', user, msg)
        }, 1000)
    })

    event.on('settings:reset', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('confirm'), action)
        next && next()
    })

    event.on('settings:reset:yes', async (user, msg, action, next) => {
        user.stats = user.ignore_list = user.white_list = []
        user.active_quiz = null
        await User.save(user)
        send.message(msg.from.id, locale('reseted'))
        event.emit('location:back', user, msg)
    })

    event.on('settings:delete', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('confirm'), action)
        next && next()
    })

    event.on('settings:delete:yes', async (user, msg, action, next) => {
        await User.delete(user)
        state[user.id] = []
        send.messageHiddenKeyboard(msg.from.id, locale('deleted'))
    })

}
