
const registerModel = require("./registerModel")

exports.create = async (userObj) => {
    const data = await registerModel.create(userObj);
    return data;
};