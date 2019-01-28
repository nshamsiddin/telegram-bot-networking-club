module.exports = {
    event: 'home',
    children: {
        [locale('progress')]: { event: 'progress' },
        [locale('quiz')]: {
            event: 'quiz',
            children: {
                [locale('quiz_new')]: {
                    event: 'quiz:new',
                    children: {
                        [locale('know')]: { event: 'quiz:new:await:yes' },
                        [locale('remember')]: { event: 'quiz:new:await:no' }
                    }
                },
                [locale('quiz_name')]: {
                    event: 'quiz:name',
                    children: {
                        '*': {
                            event: 'quiz:name:await',
                            await: true
                        },
                        [locale('back')]: { event: 'location:back' }
                    }
                },
                [locale('quiz_job')]: {
                    event: 'quiz:job',
                    children: {
                        '*': {
                            event: 'quiz:job:await',
                            await: true
                        },
                        [locale('back')]: { event: 'location:back' }
                    }
                },
                [locale('back')]: { event: 'location:back' }
            }
        },
        [locale('settings')]: {
            event: 'settings',
            children: {
                [locale('edit_info')]: {
                    event: 'settings:set',
                    children: {
                        [locale('photo')]: {
                            event: 'settings:set:photo',
                            children: {
                                [locale('upload_photo')]: {
                                    event: 'settings:set:photo:upload',
                                    children: {
                                        '*': { event: 'settings:set:photo:await', await: true },
                                        [locale('back')]: { event: 'location:back' }
                                    }
                                },
                                [locale('choose_photo')]: {
                                    event: 'settings:set:photo:profile',
                                    children: {
                                        '*': { event: 'settings:set:photo:profile:await', await: true },
                                        [locale('choose')]: { event: 'location:back' }
                                    }
                                },
                                [locale('back')]: { event: 'location:back' }
                            }
                        },
                        [locale('name')]: {
                            event: 'settings:set:name',
                            children: {
                                '*': { event: 'settings:set:name:await', await: true },
                                [locale('back')]: { event: 'location:back' }
                            }
                        },
                        /*[locale('department')]: {
                            event: 'settings:set:department',
                            children: {
                                '*': { event: 'settings:set:department:await', await: true },
                                [locale('back')]: { event: 'location:back' }
                            }
                        },*/
                        [locale('job')]: {
                            event: 'settings:set:job',
                            children: {
                                '*': { event: 'settings:set:job:await', await: true },
                                [locale('back')]: { event: 'location:back' }
                            }
                        },

                        [locale('gender')]: {
                            event: 'settings:set:gender',
                            children: {
                                '*': { event: 'settings:set:gender:await', await: true },
                                [locale('male')]: { event: 'settings:set:gender:await', },
                                [locale('female')]: { event: 'settings:set:gender:await', },
                                [locale('back')]: { event: 'location:back' }
                            }
                        },
                        [locale('back')]: { event: 'location:back' }
                    }
                },

                [locale('reset')]: {
                    event: 'settings:reset',
                    children: {
                        [locale('yes')]: { event: 'settings:reset:yes' },
                        [locale('no')]: { event: 'location:back' }
                    }
                },
                [locale('delete')]: {
                    event: 'settings:delete',
                    children: {
                        [locale('yes')]: { event: 'settings:delete:yes' },
                        [locale('no')]: { event: 'location:back' }
                    }
                },
                [locale('back')]: { event: 'location:back' }
            }
        }
    }
}
