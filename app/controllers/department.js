const Model = require('../models/department')

exports.getAll = async () => await Model.Department.find({})


exports.userAdded = async (department) => await Model.Department.findOneAndUpdate(
    { id: department },
    { $inc: { count: 1 } }
)

exports.userRemoved = async (department) => await Model.Department.findOneAndUpdate(
    { id: department },
    { $inc: { count: -1 } }
)

exports.changedDepartment = async (oldDepartment, newDepartment) => {
    await Model.Department.findOneAndUpdate(
        { id: oldDepartment },
        { $inc: { count: -1 } })
    await Model.Department.findOneAndUpdate(
        { id: newDepartment },
        { $inc: { count: 1 } })
} 