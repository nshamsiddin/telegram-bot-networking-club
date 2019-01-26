const User = require('../controllers/user')

module.exports = (event, state, map, send) => {
    event.on('progress', async (user, msg, action, next) => {
        const caption = `\`${locale('name')}:\`*${user.name}*\n\`${locale('job')}:\`${user.job}\n\`${locale('gender')}:\`${locale(user.gender)}\n`
        await send.photo(user.id, user.photo, caption)
    })

}
