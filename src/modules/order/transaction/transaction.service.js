const { TransactionStatus, PaymentMethod } = require("../../../config/constants");
const { randomStringGenerator } = require("../../../utils/helper");
const TransactionModel = require("./transaction.model");
const CommonService = require("../../../services/common.service");

class TransactionService extends CommonService {
    transformToTransactionObject(transactionData) {
        return {
            order: transactionData._id,
            transactionId: randomStringGenerator(7),
            paymentMethod: PaymentMethod.COD,
            amount: transactionData.total,
            status: TransactionStatus.PENDING,
            responseMessage: null
        }
    }
    async createTransaction(transactionData) {
        try{
            const transactionObject = new TransactionModel(transactionData); 
            return await transactionObject.save();
        } catch (error) {
            throw error;
        }
    }
    async getTransactionByOrderId(orderId) {
        try {
            const data = await this.model.findOne(orderId);
            return data;
        } catch (error) {
            throw error;
        }
    }
}

const transactionService = new TransactionService(TransactionModel);

module.exports = transactionService;
