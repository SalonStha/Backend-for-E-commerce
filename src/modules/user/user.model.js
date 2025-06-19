const mongoose = require('mongoose');
const { Status, UserRole, Gender } = require('../../config/constants');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique //11000 unique index error
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: Object.values(UserRole), // Use Object.values to get the enum values
        default: UserRole.CUSTOMER, 
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.INACTIVE,
    },
    dob: Date,
    activationToken: String,
    activateTokenExpire: Date,
    forgetPasswordToken: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    image: {
        publicId: String,
        secureUrl: String,
        optimizedUrl: String,
    },
    address: {
        billingAddress: {
            type: String,
            default: null,
            maxLength: 100
        },
        shippingAddress: {
            type: String,
            default: null,
            maxLength: 100
        }
    }
}, { 
    autoCreate: true, // Automatically create the collection if it doesn't exist
    autoIndex: true, // Automatically create indexes    
    timestamps: true } // Add timestamps for createdAt and updatedAt
);

const UserModel = mongoose.model('User', userSchema);  // Create a model from the schema //collection name users is formed plural form in small letters

module.exports = UserModel; // Export the model