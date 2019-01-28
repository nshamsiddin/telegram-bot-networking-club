const User = require('../controllers/user')

module.exports = (event, state, map, send) => {
    event.on('progress', async (user, msg, action, next) => {
        const caption = `👔 : *${user.name}*\n💼 : *${user.job}*\n`
        await send.photo(user.id, user.photo, caption)
    })

}
