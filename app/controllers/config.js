const Model = require('../models/config')

exports.loadConfigs = async () => await Model.Config.find({}, (err, res) => {
    if (err) {
        logger(err, __filename, null)
        return
    }
    return res
})

exports.get = async (type, key) => await Model.Config.findOne({ type: type, key: key })