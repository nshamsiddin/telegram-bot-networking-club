const ActiveDirectory = require('activedirectory')

const config = require('../config')

const ad_config = {
    url: config.ad.url,
    baseDN: config.ad.dn,
    username: config.ad.username,
    password: config.ad.password
}

var ad = new ActiveDirectory(ad_config)

module.exports = ad