const express = require('express');
const router = express.Router();
const verifyUser = require('../../middlewares/authJwt'); 
const User = require('../../mdb-models/User');
const Product = require('../../mdb-models/Product');

// TBAdded: Need to Verify if Item exists in Product listing 
// TBAdded: If more of the same item is added to cart 


// Cart Manager Route
router.get('/:itemID/add', verifyUser, async (req, res)=> {
    
    const cartItemID = req.params.itemID;
    const getUserData = await User.findOne({_id: req.user._id});
    const itemDoesExist = getUserData.cart.some(obj => obj.product_id === cartItemID);

    if(itemDoesExist===true) {
        res.send('exists');
    }

    else {
        const addToCart = await User.updateOne(
            { _id: req.user._id }, 
            { $push: { cart: {product_id: cartItemID} } }
            );
        
        if (addToCart.acknowledged === true) {
            res.send('added');
        }
        else {
            res.send('error');
        }
    }
    
});

router.get('/:itemID/remove', verifyUser, async (req, res)=> {
    
    const cartItemID = req.params.itemID;
    const getUserData = await User.findOne({_id: req.user._id});
    const itemDoesExist = getUserData.cart.some(obj => obj.product_id === cartItemID);


    if(itemDoesExist===true) {
        const removeFromCart = await User.updateOne(
            { _id: req.user._id },
            { $pull: { cart: {product_id: cartItemID} } }
        );
        if (removeFromCart.acknowledged === true) {
            res.send('removed');
        }
        else {
            res.send('error');
        }
    }

    else {
        res.send("not_in_cart");
    }
    
});

router.get('/check/:itemID', verifyUser, async (req, res)=> {
    
    const cartItemID = req.params.itemID;
    const getUserData = await User.findOne({_id: req.user._id});
    const itemDoesExist = getUserData.cart.some(obj => obj.product_id === cartItemID);


    if(itemDoesExist===true) {
        res.send("true")
    }

    else {
        res.send('false');
    }
    
});

router.get('/list', verifyUser, async (req, res) => {
    const getUserData = await User.findOne({_id: req.user._id});
    var listData = [];
    getUserData.cart.forEach(withProductData);
    function withProductData(item) {
        listData.push(item.product_id.toString(16));
    }
    
    const getProductData = await Product.find( {"_id" :{"$in": listData}} );
    res.send(getProductData);
});


// Orders Route
router.get('/order', verifyUser, async (req, res) => {
    const getUserData = await User.findOne({_id: req.user._id});
    var listData = [];
    getUserData.cart.forEach(withProductData);
    function withProductData(item) {
        listData.push(item.product_id);
    }

    if(listData.length===0) {
        res.send('cart_empty');
    }
    else {
        const getCurrentTime = new Date();
        const createOrder = await User.updateOne(
            { _id: req.user._id },
            { $push: { order: {items_ordered: [listData], time_of_order: getCurrentTime} } }
        );
        const clearCart = await User.updateOne(
            { _id: req.user._id },
            { $set: { cart: [] } }
        );
        clearCart;
        if (createOrder.acknowledged === true) {
            res.send('order_placed');
        }
        else {
            res.send('error');
        }
    }
});

module.exports = router;