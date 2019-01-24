module.exports = {
    event: 'register:home',
    children: {
        'test' : {
            event: 'register',
        },
        'test2' : {
            event: 'register2',
        }
    }
}