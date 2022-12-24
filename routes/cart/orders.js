const express = require('express');
const router = express.Router();
const User = require('../../mdb-models/User');

const verifyUser = require('../../middlewares/authJwt')


router.get('/list', verifyUser, async (req, res) => {
    
    const getUserData = await User.findOne({_id: req.user._id});
    const ordersList = getUserData.order;
    if (ordersList.length===0) {
        res.send('"message": "You have not made any orders yet :("')
    }
    else {
        res.send(ordersList);
    }
})

module.exports = router;