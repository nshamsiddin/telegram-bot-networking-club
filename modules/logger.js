const config = require('../resources/config')
const send = require('./telegam')
module.exports = (msg, script, user) => {
    const err = {
        date: new Date(),
        error: msg,
        script: script,
        user: user
    }
    let message = ''
    let entry = ''
    for (let item in err){
        message += `${item} : \`${err[item]}\`\n`
        entry += `${item}:\t${err[item]}\n`
    }
    send.message(config.admin_id, message, { parse_mode: 'markdown' })
}