var mongoose = require("mongoose");
var schema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    phone: String,
    role: String,
    password: String,
    status: { type: Number, default: 0 },
    updated_at: Date,
}, { timestamps: true, versionKey: false });

var administrator = mongoose.model('administrator', schema, 'administrator');
module.exports = administrator;