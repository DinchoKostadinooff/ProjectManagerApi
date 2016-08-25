var mongoose = require('mongoose');
//JavaScript library of crypto standards.
var crypto = require('crypto');
//jsonwebtoken allows us to decode, verify and generate JWT.
var jwt = require('jsonwebtoken');
/**
 * Defining user schema.
 * email {string}- from req.body.email. Email is unique and required.
 * name {string}-from req.body.name.Name is required.
 * position {string}-from req.body.position. Position is required.
 * isAdmin {Boolean}-default value.
 * hash {string}hash.
 * salt{string}salt.
 */
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean
    },
    hash: String,
    salt: String
});

//assign a function to the "methods" object of our userSchema for Encrypting the passowrd.
/**
 * set password.
 * @param {string} password - password from request.body.password.
 */
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
//assign a function to the "methods" object of our userSchema for validate the passowrd.
/**
 * validate password.
 * @param {string} password - password from request.body.password.
 */
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};
//assign a function to the "methods" object of our userSchema for create unique json web token.
/**
 * generate jwt.
 */
userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000)
    }, "MY_SECRET");
};
//exports User model
module.exports = mongoose.model('User', userSchema);
