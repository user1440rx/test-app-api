const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv/config');
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
// Cookies Middleware
var cookies = require("cookie-parser");
app.use(cookies());

// CORS Middleware
const corsMiddleWare = require('./middlewares/cors-middleware');
app.use(corsMiddleWare);


// Default Route
app.get('/', (req, res) => {
    res.send('API Online');
});

// Login Register Route
const userAuthRoute = require('./routes/account-system/auth');
app.use('/account', userAuthRoute);

// Cart Route
const cartRoute = require('./routes/cart/manage-cart')
app.use('/cart', cartRoute);

// Product Route
const productRoute = require('./routes/products/item')
app.use('/products', productRoute);




//MongoDB Connection
const dbco = process.env.MDB_Conn;
mongoose.connect(dbco, {useNewUrlParser: true, useUnifiedTopology: true }, () =>
console.log('DB Connection Established')
);


//API Server Port
app.listen(process.env.PORT);
console.log('Running on Port - ' + process.env.PORT);
