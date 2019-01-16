const User = require('../controllers/user')

module.exports = (event, state, map, send) => {
    event.on('progress', async (user, msg, action, next) => {
        // console.log(user.active)
        if (user.active) {
            const caption = `${user.name}\n${user.job}\n${user.gender}\n`
            await send.photo(user.id, user.photo, caption)
        } else {
            let check = true;
            let text = ''
            if (!user.name) {
                text += locale('name') + '\n'
                check = false
            }
            if (!user.job) {
                text += locale('job') + '\n'
                check = false
            }
            if (!user.photo) {
                text += locale('photo') + '\n'
                check = false
            }
            if (!user.gender) {
                text += locale('gender') + '\n'
                check = false
            }
            if (check) {
                User.activate_user(user.id)
                const caption = `${user.name}\n${user.job}\n${user.gender}\n`
                await send.photo(user.id, user.photo, caption)
            }
            else {
                send.message(user.id, locale('not_active') + text)
            }
        }
    })

}
