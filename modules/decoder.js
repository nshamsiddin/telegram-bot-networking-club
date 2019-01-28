const emoji = {
    [locale('register')]: '🔵',
    [locale('progress')]: '📊',
    [locale('settings')]: '🛠',
    [locale('quiz')]: '🎲',
    [locale('edit_info')]: '✏',
    [locale('quiz_new')]: '🆕',
    [locale('quiz_name')]: '👔',
    [locale('quiz_job')]: '💼',
    [locale('name')]: '👔',
    [locale('job')]: '💼',
    [locale('photo')]: '📷',
    [locale('upload_photo')]: '🔼',
    [locale('choose_photo')]: '🖼️',
    [locale('gender')]: '♀️♂️',
    [locale('male')]: '♂️',
    [locale('female')]: '♀️️',
    [locale('reset')]: '⚪',
    [locale('delete')]: '🔴',
    [locale('back')]: '🔙',
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
