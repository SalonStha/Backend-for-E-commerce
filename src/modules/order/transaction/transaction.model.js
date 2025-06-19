const mongoose = require("mongoose");
const { PaymentMethod, TransactionStatus } = require("../../../config/constants");
const TransactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    transactionId: {
        type: String,
        unique: true,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
        default: PaymentMethod.COD,
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
    },
    amount: {
        type: Number,
        required: true,
        min: 1 * 100
    },
    responseMessage: String,
} , {
    timestamps: true,
    autoIndex: true,    
    autoCreate: true,
});
const TransactionModel = mongoose.model("Transaction", TransactionSchema);

module.exports = TransactionModel;
