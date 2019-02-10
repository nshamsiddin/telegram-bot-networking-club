module.exports = {
    admin_id: 58235445,
    lang: 'rus',
    bot: {
        file_api: 'https://api.telegram.org/file/bot', //<token>/<file_path>',
        // token: '293317035:AAGbBVDWTJcfU4KN0Q3NtzEHcS-3w3MvQDg'
        token: '639456717:AAGv_BCTABXhoHD4Wilxws9iFSkH6-z6mvQ' // Test Networking bot
        // token: '699149533:AAE2em4IAmze3CZjI3BHNVaIpqA3oj5v9Oc' //Beeline networking bot
    },
    server_ip: '172.30.13.25',
    default_folder: 'cache',
    domain: {
        name: 'UNITEL_MAIN'
    },
    password_length: 20,
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