locale = require('./modules/locale/locale')

const bot = require('./modules/telegram')
const commandEvents = require('./app/commandEvents')
const { event, state } = require('./app/event')
const user = require('./app/controllers/user')
const map = require('./app/map')
const emoji = require('./app/emoji')
const ldap = require('./modules/ldap')

// Processing of messages
bot.on('message', async msg => {
    try {
        // Find user
        const findUser = await user.contains(msg.from.id)
        // console.log(findUser)
        if (!findUser)
            throw new Error('Not user')
        // Send buttons & routee
        return msg.entities && msg.entities.type === 'bot_command' ? botCommands(msg) : router(findUser, msg)
    } catch (e) {
        // Create new user
        // await user.create({
        //     id: msg.from.id,
        //     name: msg.from.first_name
        // })

        botCommands(msg)
    }
})

// Telegram router
const router = (user, msg) => {
    // Decode emoji
    if (msg.text) msg.text = emoji.decode(msg.text)
    // No user status, we give the main menu
    if (!state[msg.from.id]) {
        commandEvents.emit('/home', msg)
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
            console.log(action.event)
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
            // back
            event.emit('location:back', user, msg)
        }

        // console trace
        console.log(state[msg.from.id])
        // setTimeout(() => console.log(state[msg.from.id]), 1000)
    }
}

const botCommands = msg => {
    // Clear the user path when executing commands
    state[msg.from.id] = []
    // Run the bot command
    console.log('inside bot commands')
    switch (msg.text) {
        case '/start':
            return commandEvents.emit('/start', msg)
        default:
            event.emit('register', msg)
    }
}