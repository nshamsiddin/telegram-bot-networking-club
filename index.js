locale = require('./modules/locale').get
locale_pick = require('./modules/locale').pick
get_translations = require('./modules/locale').get_translations
logger = require('./modules/logger')

const bot = require('./modules/telegam').bot
const commandEvents = require('./app/commandEvents')
const { event, state } = require('./app/event')
const user = require('./app/controllers/user')
const regular_map = require('./app/maps/map')
const register_map = require('./app/maps/map_register')
const emoji = require('./modules/decoder')

// Processing of messages
bot.on('message', async msg => {
    if (msg.chat.type === 'private') {
        let map
        let findUser = await user.contains(msg.from.id)
        findUser && findUser.active ? map = regular_map : map = register_map
        return msg.entities && msg.entities.pop().type === 'bot_command'
            ? botCommands(msg)
            : router(findUser, msg, map)
    }
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
                console.log(action.event)
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
        console.log(state[msg.from.id])
    }
}

const botCommands = (msg) => {
    // Clear the user path when executing commands
    state[msg.from.id] = []

    // Run the bot command
    switch (msg.text) {
        case '/start':
            return commandEvents.emit('/start', msg)
    }
}
