const User = require('../controllers/user')
const ldap = require('../../modules/ldap')
const actions = require('../actions')
// const config = require('../../config')
// const ActiveDirectory = require('activedirectory')
// const ad = new ActiveDirectory(config.ad)

module.exports = async (event, state, map, send) => {

    event.on('register:location:back', (user, msg) => {
        state[msg.from.id].splice(-1, 1)
        const reducer = state[msg.from.id].reduce((path, item) => {
            msg.text = item
            if (!path.children) {
                return path
            } else {
                if (path.children.hasOwnProperty(item)) {
                    return path.children[item]
                } else {
                    if (path.children.hasOwnProperty('*')) {
                        return path.children['*']
                    } else {
                        return path
                    }
                }
            }
        }, map)
        event.emit(reducer.event, user, msg, reducer)
    })

    event.on('register:init', (user, msg, action, next) => {
        send.keyboard(msg.from.id, locale('set_username'), action, 2)
        next && next()
    })

    //username handler
    {
        event.on('register:username', (user, msg, action, next) => {
            ldap.findUser(msg.text, msg.from.id, event, action, next)
            // send.keyboard(msg.from.id, locale('choose_action'), action, 2)
            // next && next()
        })

        event.on('id:exists', (user) => {
            console.log('id:exists')
            send.message(user.id, locale('duplicate_id'))
        })

        event.on('username:exists', (user) => {
            console.log('username:exists')
            send.message(user.id, locale('duplicate_username'))
        })

        event.on('username:wrong', (id, username) => {
            console.log('username:wrong')
            send.message(id, locale('wrong_username'))
            // send.keyboard(id, locale('choose_action'), action, 2)
        })

        event.on('username:right', (user, action, next) => {
            console.log('username:right')
            User.create(user, action, next)
        })

        event.on('user:created', async (user, action, next) => {
            console.log('user:created')
            send.keyboard(user.id, locale('set_job'), action, 2)
            next && next()
        })
    }

    //job handler
    {
        event.on('register:job', (user, msg, action, next) => {
            console.log('register:job')
            user.job = msg.text
            await User.save(user)
            send.keyboard(msg.from.id, locale('choose_action'), action, 2)
            next && next()
        })
    }
    
    //gender handler
    {
        event.on('register:gender', (user, msg, action, next) => {
            
            send.keyboard(msg.from.id, locale('choose_action'), action, 2)
            next && next()
        })
    }

    //photo handler
    {
        event.on('register:photo', (user, msg, action, next) => {
            console.log('register:photo')
            send.keyboard(msg.from.id, locale('choose_action'), action, 2)
            next && next()
        })
    }

}