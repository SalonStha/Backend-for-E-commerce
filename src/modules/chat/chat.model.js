const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 2000
    },
    images: [
        {
        publicId: String,
        secureUrl: String,
        optimizedUrl: String,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
})

const ChatModel = mongoose.model('Chat', ChatSchema)

module.exports = ChatModel
