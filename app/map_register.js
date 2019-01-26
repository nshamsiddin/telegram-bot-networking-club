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
                                        [locale('upload_photo')]: {
                                            event: 'register:photo:upload',
                                            children: {
                                                '*': { event: 'register:photo:upload:await', await: true },
                                                [locale('back')]: { event: 'location:back' }
                                            }
                                        },
                                        [locale('choose_photo')]: {
                                            event: 'register:photo:choose',
                                            children: {
                                                '*': { event: 'register:photo:choose:await', await: true },
                                                [locale('choose')]: { event: 'registration:complete' }
                                            }
                                        },
                                        [locale('back')]: {
                                            event: 'register:location:back'
                                        }
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