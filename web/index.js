const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const config = require('../resources/config')
const generator = require('generate-password')
const ActiveDirectory = require('activedirectory')

const { event } = require('../app/event')
//ldap module
// const ad = require('../modules/ldap').ad
//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Set public folder
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('login', {
        authorize: locale('authorize'),
        username: locale('web_username'),
        password: locale('password'),
        get_password: locale('get_password')
    })
})


app.post('/authorize', (req, res) => {
    const username = `${req.body.username}@${config.domain.name}`
    const password = req.body.password
    const ad = new ActiveDirectory({
        url: config.ad.url,
        baseDN: config.ad.baseDN,
        username: username,
        password: password
    })
    ad.findUser(req.body.username, (err, user) => {
        if (err)
            res.render('message', { success: false, message: locale('invalid_credentials') })
        else {
            const tmp_password = generator.generate({ length: 6, numbers: true, uppercase: false })
            let user = {
                id: id,
                name: user.displayName,
                department: getDepartment(user.dn),
                tmp: tmp_password
            }
            await User.create(user)
            res.render('message', { success: true, message: 'User successfully created', user })
        }
    })
})

app.listen(config.web.port, (err) => {
    if (err)
        console.log(err)
})

function getDepartment(dn) {
    let i = 0
    let v = dn.split(',').reduce((obj, str, index) => {
        let strParts = str.split('=')
        if (strParts[0] && strParts[1]) {
            obj[i++] = strParts[1].trim()
        }
        return obj
    }, {})
    return v[1]
}