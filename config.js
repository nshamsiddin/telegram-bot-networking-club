module.exports = {
    web: {
        port: 3012
    },
    admin_chat_id: 58235445,
    lang: 'eng',
    bot: {
        // token: '293317035:AAGbBVDWTJcfU4KN0Q3NtzEHcS-3w3MvQDg'
        token: '639456717:AAGXLdFjJO-PG3xys7f9jDAC5UeF9wJBK9s'
    },
    domain:{
        name: 'UNITEL_MAIN'
    },
    ad: {
        url: 'ldap://172.30.82.160',
        baseDN: 'dc=bee,dc=unitel,dc=local',
        username: 'SANabiev@UNITEL_MAIN',
        password: 'Beeline6543'
    },
    mongodb: {
        url: 'mongodb://localhost:27017/bot',
        username: null,
        password: null
    }
}