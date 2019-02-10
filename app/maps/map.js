module.exports = {
    event: 'home',
    children: {
        [locale('stats')]: {
            event: 'stats',
            children: {
                [locale('progress')]: { event: 'stats:progress' },
                [locale('top')]: {
                    event: 'stats:top',
                    children: {
                        [locale('by_company')]: { event: 'stats:top:company' },
                        [locale('by_department')]: { event: 'stats:top:department' },
                        [locale('back')]: { event: 'location:back' }
                    }
                },
                [locale('back')]: { event: 'location:back' }
            }
        },
        [locale('quiz')]: {
            event: 'quiz',
            children: {
                [locale('quiz_new')]: {
                    event: 'quiz:new',
                    children: {
                        '*': { event: 'quiz:new:await', await: true },
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
                                        '*': { event: 'settings:set:photo:upload:await', await: true },
                                        [locale('back')]: { event: 'location:back' }
                                    }
                                },
                                [locale('choose_photo')]: {
                                    event: 'settings:set:photo:choose',
                                    children: {
                                        '*': { event: 'settings:set:photo:choose:await', await: true },
                                        [locale('choose')]: { event: 'settings:set:photo:choose:ok' },
                                        [locale('back')]: { event: 'location:back' }
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
