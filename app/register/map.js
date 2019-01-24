module.exports = {
    event: 'register:home',
    children: {
        'test': {
            event: 'register',
            children: {
                event: 'register:child',
                'Back': 'location:back'
            }
        },
        'test2': {
            event: 'register2',
        },
        'test3': {
            event: 'register3',
        }
    }
}