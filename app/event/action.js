const User = require('../controllers/user')

module.exports = (event, state, map, send) => {
    event.on('progress', async (user, msg, action, next) => {
        let caption = `${user.name}\n${user.job}\n${user.gender}\n`
        await send.photo(user.id, user.photo, caption)
    })
}
