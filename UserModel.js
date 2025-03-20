const mongoose = require('mongoose');   
const user = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
})

const User = mongoose.model('User', user);
module.exports = User;