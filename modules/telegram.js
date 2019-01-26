process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api')
const config = require('../config')
const express = require('express')
const bodyParser = require('body-parser')

let bot = null

bot = new TelegramBot(config.bot.token, {
    polling: true, 
    // request: {
    //     proxy: "http://127.0.0.1:15089"
    // },
})

module.exports = bot