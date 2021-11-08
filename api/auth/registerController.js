const registerService = require("./registerService");
const bcrypt = require("bcrypt");

exports.create = async (req,res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPasword = await bcrypt.hash(req.body.password, salt);
    const userObj = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: hashPasword,
        email: req.body.email
    };
    const isSuccess = await registerService.create(userObj);
    if(isSuccess){
        res.status(201).json({message: 'User created!'});
    }else{
        res.status(404).json({message:"Error!"});
    }
};