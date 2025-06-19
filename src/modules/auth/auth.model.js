const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        // unique: true, // Ensure that each user has a unique auth record
    },
    accessToken:{
        type: String,
        required: true,
        unique: true, // Ensure that each access token is unique
    },
    refreshToken:{
        type: String,
        required: true,
        unique: true, // Ensure that each refresh token is unique
    },
    maskedAccessToken:{
        type: String,
        required: true,
        unique: true, // Ensure that each masked access token is unique
    },
    maskedRefreshToken:{
        type: String,
        required: true,
        unique: true,
    },
},{
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
});

const AuthModel = mongoose.model('Auth', AuthSchema);
module.exports = AuthModel;