const Model = require('../models/config')

exports.loadConfigs = async () => await Model.Config.find({}, (err, res) => {
    if (err) {
        logger(err, __filename, null)
        return
    }
    return res
})

exports.get = async key => await Model.Config.findOne({ key: key })