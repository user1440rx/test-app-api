const mongoose = require('mongoose');


const ProductSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumbimage: {
        type: String
    },
    product_images: Array,
    product_category: Array,
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: { createdAt: true, updatedAt: true } });

ProductSchema.index({ product_id: 1 });

module.exports = mongoose.model('product', ProductSchema);