const chatRouter = require('express').Router()

const auth = require('../../middlewares/authmodel.middleware')

const authValidator = require('../../middlewares/auth.middleware')

const { ChatSendMessageDTO, ChatUpdateMessageDTO } = require('./chat.validator')

const uploader = require('../../middlewares/uploader.middleware')

const chatController = require('./chat.controller')

chatRouter.post('/sendMessage',uploader().array("images"), auth(), authValidator(ChatSendMessageDTO), chatController.sendMessage)

chatRouter.get('/get-all-messages/:receiverId',auth(), chatController.getAllMessages)

chatRouter.route('/:chatId')
    .get(auth(), chatController.getChatById)
    .delete(auth(), chatController.deleteChatById)
    .put(auth(), uploader().array("images"), authValidator(ChatUpdateMessageDTO), chatController.updateChatById)

module.exports = chatRouter


