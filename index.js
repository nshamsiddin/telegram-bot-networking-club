locale = require('./modules/locale').translate
getTranslations = require('./modules/locale').getTranslations

const bot = require('./modules/telegam').bot
const commandEvents = require('./app/commandEvents')
const { event, state } = require('./app/event')
// const { event_init, state_init } = require('./app/register/event')
const ldap = require('./modules/ldap')
const user = require('./app/controllers/user')
const regular_map = require('./app/maps/map')
const register_map = require('./app/maps/map_register')

const emoji = require('./modules/decoder')

// Processing of messages
bot.on('message', async msg => {
    let findUser = await user.contains(msg.from.id)
    let map
    // console.log(findUser)
    if (findUser && findUser.active) {
        map = regular_map
    }
    else {
        map = register_map
    }
    return router(findUser, msg, map)
})


const router = (user, msg, map) => {

    // Decode emoji
    if (msg.text) msg.text = emoji.decode(msg.text)
    // No user status, we give the main menu
    if (!state[msg.from.id]) {
        commandEvents.emit('/home', msg, map)
        // Adding the user to the state
        state[msg.from.id] = []
    } else {
        // Go to the desired branch
        const findBranch = state[msg.from.id].reduce((path, item) => {
            // If there are no child partitions
            if (!path.children) {
                return path
            } else {
                if (path.children[item]) {
                    return path.children[item]
                } else {
                    // If there is no suitable branch, then we try to use a common branch
                    if (path.children['*']) {
                        return path.children['*']
                    } else {
                        return path
                    }
                }
            }
        }, map)
        // Call branch method
        const callBranch = branch => {

            const action = findBranch.children[branch]
            // Call action
            event.emit(action.event, user, msg, action, (value = msg.text) => {
                event.emit('location:next', user, msg, action, value)
            })
        }

        // We check the existence of the method
        if (findBranch.children.hasOwnProperty(msg.text)) {
            callBranch(msg.text)
        } else if (findBranch.children['*']) {
            // If there is no suitable branch, then we try to use a common branch
            callBranch('*')
        } else {
            map === regular_map ? event.emit('location:back', user, msg) : commandEvents.emit('/home', msg, map)
        }

        // console trace
        // console.log(state[msg.from.id])
    }
}
