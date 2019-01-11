const bot = require('../modules/telegram')
const emoji = require('./emoji')
const User = require('./controllers/user')

// Send message
exports.message = (chat_id, message, options = {}) =>
    bot.sendMessage(chat_id, message, options)

// Send photo
exports.photo = (chat_id, file_id, caption) =>
    bot.sendPhoto(chat_id, file_id, {
        caption: caption
    })

//Send question
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

exports.profile_photos = async (chat_id, index = 0) => {
    bot.getUserProfilePhotos(chat_id, { offset: 0 })
        .then(async p => {
            let size = p.photos.length
            let photo = p.photos[index][0].file_id
            bot.sendPhoto(chat_id, photo, {
                reply_markup: {
                    keyboard: generate_options(size),
                    resize_keyboard: true
                }
            })
            let user = await User.get(chat_id)
            user.photo = photo
            User.save(user)
        })

    function generate_options(n) {
        let options = [], opt = []
        for (let i = 0; i < n; i++)
            opt.push({ text: emoji.encode(i) })
        options.push(opt)
        options.push([{ text: locale('choose') }])
        return options
    }
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

// Send a message with the keyboard hiding
exports.messageHiddenKeyboard = (user, message) => {
    bot.sendMessage(user, message, {
        reply_markup: {
            remove_keyboard: true
        }
    })
}
