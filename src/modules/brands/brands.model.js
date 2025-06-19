const mongoose = require('mongoose');
const { Status } = require('../../config/constants');

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100,
        unique: true
    },
    slug: {
        type: String,
        unique : true,
        lowercase: true,
        index: true
    },
    logo: {
        publicId: String,
        secureUrl: String,
        optimizedUrl: String,
    },
    status: {
        type:String,
        enum: Object.values(Status),
        default: Status.INACTIVE
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
    }
}, { 
    autoCreate: true,
    autoIndex: true,
    timestamps: true 
});

const BrandModel = mongoose.model('Brand', BrandSchema);
module.exports = BrandModel; // Export the Brand model for use in other modules