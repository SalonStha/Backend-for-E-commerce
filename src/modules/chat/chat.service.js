const ChatModel = require('./chat.model')
const cloudinaryService = require('../../services/cloudinary.services')
const CommonService = require('../../services/common.service')
class ChatService extends CommonService{
    async transformChatCreateData(req) {
        try{
            const data = req.body
            data.sender = req.loggedInUser._id;
            data.message = data.message;
            data.receiver = data.receiver;

            if (req.files) {
                let images = [];
                data.images = [];
                req.files.map((image) => {
                let uploadResponse = cloudinaryService.fileUpload(
                    image.path,
                    "/chat_images/"
                  ); //donot await as it makes this line of code in pending state and the other code will not execute until this code in executed
                  images.push(uploadResponse);
                });
                const uploadStatus = await Promise.allSettled(images);
                uploadStatus.map((cloudinaryUploadSuccess) => {
                  if (cloudinaryUploadSuccess.status === "fulfilled") {
                    data.images.push(cloudinaryUploadSuccess.value);
                  }
                });
              }
            return data
        }catch(error){
            throw error
        }
        // return{
        //     message: req.body.message,
        //     sender: req.loggedInUser._id,
        //     receiver: req.body.receiver,
        // }
    }
    async transformChatUpdateData(req, oldchatDetail){
      try{
        const data = req.body
        data.message = data.message;
        if (req.files) {
          let images = [];
          data.images = [...oldchatDetail.images];
          req.files.map((image) => {
          let uploadResponse = cloudinaryService.fileUpload(
              image.path,
              "/chat_images/"
            ); //donot await as it makes this line of code in pending state and the other code will not execute until this code in executed
            images.push(uploadResponse);
          });
          const uploadStatus = await Promise.allSettled(images);
          uploadStatus.map((cloudinaryUploadSuccess) => {
            if (cloudinaryUploadSuccess.status === "fulfilled") {
              data.images.push(cloudinaryUploadSuccess.value);
            }
          });
        }
        return data;
      }catch(error){
        throw error
      }
    }
    async createMessage(data) {
        try {
            const chat = await ChatModel.create(data);
            return chat;
        } catch (error) {
            throw error;
        }
    }
    async listAllMessages(filter, query = {}){
        try{
            const page = parseInt(query.page) || 1 
            const limit = parseInt(query.limit) || 10
            const skip = (page - 1) * limit
            const messages = await ChatModel.find(filter)
            .populate("sender", [
                "_id",
                "firstName",
                "lastName",
                "email",
                "role",
                "status",
                "image",
              ])
            .populate('receiver', [
                "_id",
                "firstName",
                "lastName",
                "email",
                "role",
                "status",
                "image",
            ])
            .skip(skip)
            .sort({createdAt: -1})
            .limit(limit)
            const total = await ChatModel.countDocuments(filter)
            return {
                data: messages,
                pagination: {
                  current: page,
                  limit: limit,
                  total: total,
                  totalPages: Math.ceil(total / limit),
                },
              };
        }catch(error){
            throw error
        }
    }
    async getChatById(filter){
        try{
            const chat = await ChatModel.findOne(filter)
            .populate("sender", [
                "_id",
                "firstName",
                "lastName",
                "email",
                "role",
                "status",
                "image",
            ])
            .populate("receiver", [
                "_id",
                "firstName",
                "lastName",
                "email",
                "role",
                "status",
                "image",
            ])
            return chat
        }catch(error){
            throw error
        }
    }
}

const chatService = new ChatService(ChatModel)

module.exports = chatService

