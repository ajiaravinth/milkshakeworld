var mongoose = require("mongoose");
var schema = mongoose.Schema({
    name: String,
    code: String,
    price: Number,
    quantity: Number,
    category: String,
    status: { type: Number, default: 0 },
    updated_at: Date,
}, { timestamps: true, versionKey: false });

var products = mongoose.model('products', schema, 'products');
module.exports = products;