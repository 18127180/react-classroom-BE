const classModel = require("./classModel");

exports.list = async () => {
  const data = await classModel.list();
  return data;
};
exports.create = async (classObj) => {
  const data = await classModel.create(classObj);
  return data;
};
