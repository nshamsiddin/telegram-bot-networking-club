const Localize = require('localize');

const config = require('../../config')

const locale = new Localize(require('./locale.json'))
locale.setLocale(config.lang)

module.exports = text => locale.translate(text)