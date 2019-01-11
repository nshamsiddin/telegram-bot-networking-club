const User = require('../controllers/user')
const required_params = [
    { name: 'name', text: 'Name' },
    { name: 'job', text: 'Job' },
    { name: 'photo', text: 'Photo' },
    { name: 'gender', text: 'Gender' }]

module.exports = (event, state, map, send) => {
    event.on('settings', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_action'), action)
        next && next()
    })

    event.on('settings:set:name', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_name'), action)
        next && next()
    })

    async function setParam(user, msg, action, next, param) {
        let message = locale('change_success')
        param === 'gender' ? user[param] = cast_gender() : user[param] = msg.text
        if (!user.active) {
            let active = true
            required_params.map(p => !user[p.name] ? active = false : active)
            user.active = active
            active ? message += `\n${locale('activated')}` : active
        }
        User.save(user)
        send.message(msg.from.id, message)
        event.emit('location:back', user, msg)

        function cast_gender() {
            if (['male', 'Male', 'мужчина', 'Мужчина'].indexOf(msg.text) !== -1)
                return 'male'
            if (['female', 'Female', 'женшина', 'Женшина'].indexOf(msg.text) !== -1)
                return 'female'
        }
    }

    event.on('settings:set:name:await', async (user, msg, action, next) => await setParam(user, msg, action, next, 'name'))

    event.on('settings:set:job', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_job'), action)
        next && next()
    })

    event.on('settings:set:job:await', async (user, msg, action, next) => await setParam(user, msg, action, next, 'job'))

    event.on('settings:set:photo', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_photo'), action)
        next && next()
    })

    event.on('settings:set:photo:upload', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('upload_photo'), action)
        next && next()
    })

    event.on('settings:set:photo:await', async (user, msg, action, next) => {
        if (msg.photo) {
            msg.text = msg.photo[msg.photo.length - 1].file_id
            await setParam(user, msg, action, next, 'photo')
        }
        else {
            send.message(msg.from.id, locale('no_photo_detected'))
            event.emit('location:back', user, msg)
        }
    })


    event.on('settings:set:photo:profile', async (user, msg, action, next) => {
        await send.profile_photos(user.id)
        next && next()
    })
    event.on('settings:set:photo:profile:await', async (user, msg, action, next) => {
        await send.profile_photos(user.id, msg.text)
        // await setParam(user, msg, action, next, 'photo')
    })

    event.on('settings:set:gender', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_gender'), action)
        next && next()
    })

    event.on('settings:set:gender:await', async (user, msg, action, next) => await setParam(user, msg, action, next, 'gender'))

    event.on('settings:reset', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('confirm'), action)
        next && next()
    })

    event.on('settings:reset:yes', async (user, msg, action, next) => {
        send.message(msg.from.id, locale('reseted'))
        event.emit('location:back', user, msg)
    })

    event.on('settings:delete', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('confirm'), action)
        next && next()
    })

    event.on('settings:delete:yes', async (user, msg, action, next) => {
        send.messageHiddenKeyboard(msg.from.id, locale('deleted'))
    })

}