const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    product_id: String,
    quantity: Number,
    added_to_cart: Date
});
const orderSchema = mongoose.Schema({
    items_ordered: Array,
    time_of_order: Date
});

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    display_name: String,
    password: {
        type: String,
    },
    cart: [cartSchema],
    order: [orderSchema],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: { createdAt: true, updatedAt: true } });

UserSchema.index({ username: 1 });

module.exports = mongoose.model('user', UserSchema);