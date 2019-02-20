process.env.NTBA_FIX_319 = 1;
const emoji = require('./decoder')
const User = require('../app/controllers/user')
const TelegramBot = require('node-telegram-bot-api')
const config = require('../resources/config')

let bot = null

bot = new TelegramBot(config.bot.token, {
    polling: true,
    // request: {
    //     proxy: "http://127.0.0.1:15089"
    // },
})

exports.bot = bot

// Send message
exports.message = (chat_id, message, options = { parse_mode: 'markdown' }) =>
    bot.sendMessage(chat_id, message, options)

// Send photo
exports.photo = (chat_id, file_id, caption) =>
    bot.sendPhoto(chat_id, file_id, {
        caption: caption,
        parse_mode: 'Markdown'
    })

exports.error = async (id, err) =>
    bot.sendMessage(id, err, { parse_mode: 'markdown' })

exports.setAction = (id, action) => bot.sendChatAction(id, action)

// Send question
exports.question = (chat_id, options, file_id) => {
    let opt = []
    options.map(p => opt.push([{ text: emoji.encode(p.text) }]))
    bot.sendPhoto(chat_id, file_id, {
        reply_markup: {
            keyboard: opt,
            resize_keyboard: true,
            one_time_keyboard: true
        },
    })
}

exports.profile_photos = async (chat_id, index, next) => {
    if (!isNaN(index)) {
        await bot.getUserProfilePhotos(chat_id, { offset: 0 })
            .then(async p => {
                let size = p.photos.length
                if (size > 0) {
                    let photo = p.photos[index][0].file_id
                    bot.sendPhoto(chat_id, photo, {
                        reply_markup: { keyboard: generate_options(size), resize_keyboard: true }
                    })
                    let user = await User.get(chat_id)
                    user.photo = photo
                    await User.save(user)
                    next && next()
                }
                else {
                    bot.error(chat_id, locale('choose_photo_error'))
                }
            })
    }
    else {
        bot.error(chat_id, locale('choose_from_list'))
    }

    function generate_options(n) {
        let options = [], opt = []
        for (let i = 0; i < n; i++)
            opt.push({ text: emoji.encode(i) })
        options.push(opt)
        options.push([{ text: locale('choose') }])
        return options
    }
}


exports.get_profile_photos = async (chat_id, index) => {
    return new Promise((resolve, reject) => {
        if (!isNaN(index)) {
            bot.getUserProfilePhotos(chat_id, { offset: 0 })
                .then(p => {
                    if (p.total_count)
                        return resolve(p)
                    else
                        return reject('no_profile_photos')
                })
        }
        else {
            return reject('not_number')
        }
    })
}

// Sending Messages with the keyboard
exports.keyboard = (user, message, data, inline = 2, options = {}) => {
    let opt = [], arr = [], i = 0

    // If the map object entered, we take the data from the current branch
    if (!Array.isArray(data)) {
        for (let item in data.children) {
            arr.push(item)
        }
    } else {
        // Received a normal array
        arr = data
    }

    for (let key of arr) {
        if (key === '*') continue
        // If the inline is greater than 1, then insert the inline elements in one line
        if (i < inline && opt[opt.length - 1] !== undefined) {
            opt[opt.length - 1].push({
                text: emoji.encode(key)
            })
        } else {
            if (i === inline) i = 0
            opt.push([{ text: emoji.encode(key) }])
        }
        i++
    }

    bot.sendMessage(user, message, {
        reply_markup: {
            keyboard: opt,
            resize_keyboard: true
            // one_time_keyboard: true
        },
        ...options
    })
}

exports.photoAndKeyboard = (user, file_id, caption, data, inline = 1, options = {}) => {
    let opt = [], arr = [], i = 0

    // If the map object entered, we take the data from the current branch
    if (!Array.isArray(data)) {
        for (let item in data.children) {
            arr.push(item)
        }
    } else {
        // Received a normal array
        arr = data
    }

    for (let key of arr) {
        if (key === '*') continue
        // If the inline is greater than 1, then insert the inline elements in one line
        if (i < inline && opt[opt.length - 1] !== undefined) {
            opt[opt.length - 1].push({ text: emoji.encode(key) })
        } else {
            if (i === inline) i = 0
            opt.push([{ text: emoji.encode(key) }])
        }
        i++
    }
    bot.sendPhoto(user, file_id, {
        caption: caption,
        parse_mode: 'markdown',
        reply_markup: {
            keyboard: opt,
            resize_keyboard: true,
            // one_time_keyboard: true
        },
        ...options
    }).catch(p => {
        bot.sendPhoto(user, config.default_photo, {
            caption: caption,
            parse_mode: 'markdown',
            reply_markup: {
                keyboard: opt,
                resize_keyboard: true,
                // one_time_keyboard: true
            },
            ...options
        })
    })



    // bot.sendMessage(user, message, {
    //     reply_markup: {
    //         keyboard: opt,
    //         resize_keyboard: true
    //         // one_time_keyboard: true
    //     },

    // })
}

// Send a message with the keyboard hiding
exports.messageHiddenKeyboard = (user, message) => {
    bot.sendMessage(user, message, {
        reply_markup: {
            remove_keyboard: true,
        },
        parse_mode: 'Markdown',
    })
}

exports.getFile = async (msg) => {
    const file = await bot.getFile(msg.photo[msg.photo.length - 1].file_id)
    const url = `${config.bot.file_api}${config.bot.token}/${file.file_path}`
    return {
        url: url,
        size: file.size,
        file_id: file.file_id,
        path: file.file_path
    }
}
exports.getFileById = async (file_id) => {
    const file = await bot.getFile(file_id)
    const url = `${config.bot.file_api}${config.bot.token}/${file.file_path}`
    return {
        url: url,
        size: file.size,
        file_id: file.file_id,
        path: file.file_path
    }
}