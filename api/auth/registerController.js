const registerService = require("./registerService");

exports.create = async (req,res) => {
    const userObj = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        email: req.body.email
    };
    const isSuccess = await registerService.create(userObj);
    if(isSuccess){
        res.status(201).json({message: 'User created!'});
    }else{
        res.status(404).json({message:"Error!"});
    }
};