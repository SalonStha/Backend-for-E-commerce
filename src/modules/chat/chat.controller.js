const chatService = require("./chat.service")
class ChatController {
    async sendMessage(req, res, next) {
        try {
            const chatData = await chatService.transformChatCreateData(req);
            const chat = await chatService.createMessage(chatData);
            res.status(200).json({ 
                data: chat,
                message: "Message sent successfully",
                status: "SUCCESS"
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllMessages(req, res, next) {
        try {
            let filter = {
                $or :[
                {
                    sender : req.loggedInUser._id,
                    receiver : req.params.receiverId
                },  //sender is the logged in user and receiver is the receiver id
                {
                    sender : req.params.receiverId,
                    receiver : req.loggedInUser._id
                } //receiver is the logged in user and sender is the receiver id
            ]
            }
            const {data , pagination} = await chatService.listAllMessages(filter , req.query)
            res.status(200).json({ 
                message: "Messages fetched successfully",
                status: "SUCCESS",
                data: data,
                options: pagination,
            })
        } catch (error) {
            next(error)
        }
    }
    async getChatById(req, res, next) {
        try {
            const chat = await chatService.getChatById({
                _id:req.params.chatId
            }
        )
            if(!chat){
                throw {
                    code : 404,
                    message : "Chat not found",
                    status : "FAILED"
                }
            }
            res.status(200).json({ 
                message: "Chat fetched successfully",
                status: "SUCCESS",
                data: chat,
            })
        } catch (error) {
            next(error)
        }
    }
    async updateChatById(req, res, next) {
        try {
            const chatDetail = await chatService.getChatById({
                _id: req.params.chatId,
            });
    
          const payLoad = await chatService.transformChatUpdateData(
            req,
            chatDetail
          );
          const updatedChatData = await chatService.updateSingleDataById(
            { _id: chatDetail._id },
            payLoad
          );
    
          if (!chatDetail) {
            throw {
              code: 404,
              message: "Chat not found",
              status: "FAILED",
            };
          }
          res.json({
            message: "Chat updated successfully",
            status: "SUCCESS",
            data: updatedChatData,
          });
        } catch (error) {
          next(error);
        }
    }
    async deleteChatById(req, res, next) {
        try {
            const chatData = await chatService.getChatById({
              _id: req.params.chatId,
            });
            if (!chatData) {
              throw {
                code: 404,
                message: "Chat not found",
                status: "FAILED",
              };
            }
            const deletedData = await chatService.deleteSingleDataById({
                _id: chatData._id,
            });
            res.json({
              message: "Chat deleted successfully",
              status: "SUCCESS",
              data: deletedData,
            });
          } catch (error) {
            next(error);
          }
    }
}

const chatController = new ChatController()

module.exports = chatController
