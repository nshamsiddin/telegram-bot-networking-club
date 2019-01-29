const emoji = {
    // [locale('register')]: '🔵',
    // [locale('progress')]: '📊',
    // [locale('settings')]: '🛠',
    // [locale('quiz')]: '🎲',
    // [locale('edit_info')]: '✏',
    // [locale('quiz_new')]: '🆕',
    // [locale('quiz_name')]: '👔',
    // [locale('quiz_job')]: '💼',
    // [locale('name')]: '👔',
    // [locale('job')]: '💼',
    // [locale('photo')]: '📷',
    // [locale('upload_photo')]: '🔼',
    // [locale('choose_photo')]: '🖼️',
    // [locale('gender')]: '♀️♂️',
    // [locale('male')]: '♂️',
    // [locale('female')]: '♀️️',
    // [locale('reset')]: '⚪',
    // [locale('delete')]: '🔴',
    // [locale('back')]: '🔙',
    // [locale('yes')]: '✔️',
    // [locale('no')]: '❌',
    // [locale('know')]: '🤘',
    // [locale('remember')]: '🤔',
}

// Добавляем эмодзи
exports.encode = text => {
    return emoji.hasOwnProperty(text) ? emoji[text] + ' ' + text : text
}

// Декодируем эмодзи
exports.decode = text => {
    let val = text.split(' ')

    // Пропускаем если не содержит эмодзи
    if (val.length < 2) return text

    val.splice(0, 1)
    val = val.join(' ')

    // Обходим эмодзи в поисках контекста
    for (let key in emoji) {
        if (key === val) return key
    }

    return text
}

const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
exports.emojify = number => {
    if (number && !isNaN(number))
        return number.toString().split('').map(p => numbers[p]).join('')
    else
        return null
}