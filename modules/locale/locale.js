const Localize = require('localize');

const config = require('../../config')

const locale = new Localize(require('./locale.json'))
locale.setLocale(config.lang)

exports.translate = (text) => locale.translate(text)
exports.getTranslations = (text) => locale.getTranslations()[text]