const registerService = require("./registerService");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
  const isExist = await registerService.getUserByEmail(req.body.email);
  console.log("isExist", isExist);
  if (isExist && isExist.password !== null) {
    res.status(405).json({ message: "This account has already existed" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPasword = await bcrypt.hash(req.body.password, salt);
  if (isExist && isExist.password === null) {
    console.log("here");
    const isSuccess = registerService.updateUserPassword(
      req.body.email,
      hashPasword
    );
    console.log("isSuccess", isSuccess);
    if (isSuccess) res.status(201).json({ message: "User created!" });
    else
      res.status(405).json({
        message: "This account has been signed up using other method.",
      });
  } else if (!isExist) {
    const userObj = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hashPasword,
      email: req.body.email,
    };
    const isSuccess = await registerService.create(userObj);
    if (isSuccess) {
      res.status(201).json({ message: "User created!" });
    } else {
      res.status(405).json({ message: "Error!" });
    }
  }
};
