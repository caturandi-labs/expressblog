//koneksi database mongodb
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/nodeblog');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type:String,
        index:true
    },
    password: {
        type: String,
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

//buat dan export method createUser
module.exports.createUser = (newUser,callback) =>{
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(newUser.password, salt, (err,hash)=>{
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

//buat method dan export untuk menangani findById
module.exports.getUserById = (id,callback) =>{
    User.findById(id,callback);
};

//buat dan export method untuk menangani find by username
module.exports.getUserByUsername = (username, callback) =>{
    const query = {username: username};
    User.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword,hash,callback)=>{
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        callback(null,isMatch);
    });
};