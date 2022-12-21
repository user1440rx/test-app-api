const User = require("../mdb-models/User");
const Joi = require('joi');



// Joi Register Validation
const registerSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }),
    username: Joi.string().alphanum().min(4).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[ A-Za-z0-9#._?!@/$%,+^&*-]*$')).min(6).required()
});



validateUserRegistration = async (data) => {
    
    const usernameExists = await User.findOne({username: data.username});

    if (usernameExists) {
        const user_error = {
            error: {
                details: [{
                    message: "Username is already in use."
                }]
            }
        };
        return user_error;
    }
    else {
        //Validating User Registration
        const joi_validation = registerSchema.validate(data);
        return joi_validation;
    }
    
}


// Login Validation

validateUserLogin = async (logindata) => {
    const usernameExists = await User.findOne({username: logindata.username});

    if (usernameExists) {
        //Validating User Login
        const joi_validation = registerSchema.validate(logindata);
        return joi_validation;
    }
    else {
        const user_error = {
            error: {
                details: [{
                    message: "Username or password is wrong."
                }]
            }
        };
        return user_error;
    }
}


module.exports.verifyRegistration = validateUserRegistration;
module.exports.verifyLogin = validateUserLogin;
