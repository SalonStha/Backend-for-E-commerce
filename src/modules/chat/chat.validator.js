const Joi = require('joi')

const ChatSendMessageDTO = Joi.object({
    message: Joi.string().min(1).max(2000).required(),
    images: Joi.array().items(Joi.string()).optional().allow('',null),
    receiver: Joi.string().required()
})

const ChatUpdateMessageDTO = Joi.object({
    message: Joi.string().min(1).max(2000).required(),
    images: Joi.array().items(Joi.string()).optional().allow('',null),
})
module.exports = {
    ChatSendMessageDTO,
    ChatUpdateMessageDTO
}

