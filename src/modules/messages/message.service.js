import { create, findById } from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import { notFoundException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import MessageModel from './../../DB/Models/message.model.js';

export const sendMessage = async (req, res) => {
    const { content } = req.body;
    const { receiverId } = req.params;
    const user = await findById({model:UserModel,id:receiverId});
    
    if (!user) {
        return notFoundException('user not found ')
    } 
    const message = await create({model:MessageModel,data:[{
        content,
        receiverId
    }]})



    return successResponse({res,message:"send message successfully",statusCode :201 ,data:{message}})
    
};
export const getMessages = async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const receiverId = req.user._id;
    const skip = (page - 1) * limit;
    const [messages, totalMessages] = await Promise.all([
        MessageModel.find({ receiverId }).skip(Number(skip)).limit(Number(limit)),
        MessageModel.countDocuments({ receiverId })
    ]);
    return successResponse({res,message:"get messages successfully",statusCode :200 ,data:{messages, pagination:{
        currentPage: Number(page),
        total:Math.ceil(totalMessages / limit),
        totalMessages
    }}})
};
export const toggleIsRead = async (req, res) => {
    const { messageId } = req.params;
    const message = await MessageModel.findById(messageId);
    if (!message || message.receiverId.toString() !== req.user._id.toString()) {
        return notFoundException('Message not found');
    }
    message.isRead = !message.isRead;
    await message.save();
    return successResponse({res,message:`Message ${message.isRead ? 'read' : 'unread'} status updated successfully`,statusCode :200 ,data:{message}})
};
export const toggleIsFavorite = async (req, res) => {
    const { messageId } = req.params;
    const message = await MessageModel.findById(messageId);
    if (!message || message.receiverId.toString() !== req.user._id.toString()) {
        return notFoundException('Message not found');
    }
    message.isFavorite = !message.isFavorite;
    await message.save();
    return successResponse({res,message:`Message ${message.isFavorite ? 'favorited' : 'unfavorited'} status updated successfully`,statusCode :200 ,data:{message}})
};