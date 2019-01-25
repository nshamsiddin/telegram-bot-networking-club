module.exports = {
    event: 'register:home',
    children: {
        [locale('register')]: {
            event: 'register:init',
            children: {
                '*': {
                    event: 'register:username',
                    children: {
                        '*': {
                            event: 'register:job',
                            children: {
                                '*': {
                                    event: 'register:gender',
                                    children: {
                                        '*': {
                                            event: 'register:photo'
                                        },
                                        [locale('back')]: { event: 'register:location:back' }
                                    }
        
                                },
                                [locale('back')]: { event: 'register:location:back' }
                            }
                        },
                        [locale('back')]: { event: 'register:location:back' }
                    }
                },
                [locale('back')]: { event: 'register:location:back' }
            }
        }
    }
}