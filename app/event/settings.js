const User = require('../controllers/user')
const actions = require('../actions')

module.exports = (event, state, map, send) => {

    event.on('settings', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_action'), action, 3)
        next && next()
    })

    event.on('settings:set', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('choose_action'), action, 4)
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

    event.on('settings:set:name', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_name'), action)
        next && next()
    })

    event.on('settings:set:name:await', async (user, msg, action, next) => {
        actions.setParam(user, msg, 'name')
        event.emit('location:back', user, msg)
    })

    event.on('settings:set:job', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_job'), action)
        next && next()
    })

    event.on('settings:set:job:await', async (user, msg, action, next) => {
        await actions.setParam(user, msg, 'job')
        event.emit('location:back', user, msg)
    })

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
            actions.setParam(user, msg, 'photo')
            event.emit('location:back', user, msg)
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

    event.on('settings:set:gender:await', async (user, msg, action, next) => {
        actions.setParam(user, msg, 'gender')
        event.emit('location:back', user, msg)
    })

    event.on('settings:reset', async (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('confirm'), action)
        next && next()
    })

    event.on('settings:reset:yes', async (user, msg, action, next) => {
        await User.reset(user)
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
