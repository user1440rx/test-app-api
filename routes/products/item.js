const express = require('express');

const router = express.Router();
const Product = require('../../mdb-models/Product');



// to-do: add authorization system to user and products 
router.post('/item', async (req, res) => {
    try {
        const product = new Product({
            product_name: req.body.name,
            product_thumbimage: req.body.thumbimage,
            product_category: req.body.category
        });
        try {
            await product.save();
            res.send('Product added.');
        }
        catch (err) {
            res.status(400).send(err);
        }

    }
    catch (err) {
        res.status(400).send(`Error. Unable to add product. Message: ${err}`);
    }
    
})


router.get('/listing', async (req, res) => {
    try {
        const getProducts = await Product.aggregate([
            { $project : { product_name : 1, _id : 1, product_category: 1, product_thumbimage: 1 } }
        ]);
        res.send(getProducts);
    }
    catch (err) {
        res.status(400).send(`Error. Unable to get products. Message: ${err}`);
    }
});

module.exports = router;