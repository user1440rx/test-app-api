const express = require('express');

const router = express.Router();
const User = require('../../mdb-models/User');


var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');


// Verify Registration
const {verifyRegistration, verifyLogin} = require('../../middlewares/verifyRegLog');



router.post('/register', async (req, res) => {
    try {
        
        const verifyRegResponse = await verifyRegistration(req.body);

        if(verifyRegResponse.error) {
            res.status(400).send(verifyRegResponse.error.details[0].message);
        }
        else {

            // Password Hash
            const hashedPassword = await bcrypt.hash(req.body.password, 8);

            const user = new User({
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword
            });
            try {
                await user.save();
                res.send('Account Created.');
            }
            catch (err) {
                res.status(400).send(err);
            }
        }

    }
    catch (err) {
        res.status(400).send(`Error. Unable to Create Account. Message: ${err}`);
    }
    
})



router.post('/login', async (req, res)=> {
    try {
        const verifyLogResponse = await verifyLogin(req.body);

        if(verifyLogResponse.error) {
            res.status(400).send(verifyLogResponse.error.details[0].message);
        }
        else {
            const userLoginData = await User.findOne({username: req.body.username});
            const verifyPassword = await bcrypt.compare(req.body.password, userLoginData.password);
            if (!verifyPassword) {
                res.status(400).send('Username or password is wrong.');
            }
            else {
                //Create JWT (Login Verified)
                const loginToken = jwt.sign({_id: userLoginData._id}, process.env.LOGIN_TOKEN_SECRET, {expiresIn: '30d'});
                
                
                // Login (Storing Cookie)
                res.cookie('userid', loginToken, {httpOnly: true, maxAge: 31536000000})
                res.send(`Login Verified Token.`);
            }
        }
    }
    catch (err) {
        res.status(400).send(`Error. Unable to Login. Message: ${err}`);
    }
})


router.get('/list', async (req, res) => {
    const userLoginData = await User.aggregate([
        { $project : { _id : 1, username: 1, email: 1 } }
    ]);
    res.send(userLoginData);
})

module.exports = router;