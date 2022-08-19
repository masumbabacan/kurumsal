
const User = require("../models/User");
const Message = require("../models/Message");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const unselectedColumns = '-password -__v -verificationToken -passwordToken -passwordTokenExpirationDate';

const getAllMessages = async (req,res) => {
    var perpage = (req.query.limit == null) ? 10 : req.query.limit;
    var total = await Message.find({}).count();
    var pages = Math.ceil(total / perpage);
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perpage;
    const messages = await Message.find({}).skip(startFrom).limit(perpage);

    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.status(StatusCodes.OK).render("admin/message/messages", { 
        authenticateUser : authenticateUser,
        messages: messages, 
        pages : pages, 
        totalCount : total, 
        currentDataCount : messages.length, 
        msg : 'İşlem başarılı' 
    });
}

const createMessage = async (req,res) => {
    const { senderName, senderSurname, senderMail, content } = req.body;
    const message = await Message.create({senderName, senderSurname, senderMail, content});
    if (!message) throw new CustomError.BadRequestError("Bir hata oluştu");
    res.status(StatusCodes.CREATED).json({msg : "İşlem başarılı!"});
}

const seenMessage = async (req,res) => {
    const message = await Message.findOne({_id : req.params.id});
    if (!message) throw new CustomError.BadRequestError("Bir hata oluştu");
    if (!message.seen) {
        await Message.findOneAndUpdate({_id : message._id},{seen : true});
    }else{
        await Message.findOneAndUpdate({_id : message._id},{seen : false});
    }
    res.status(StatusCodes.OK).json({msg : "İşlem başarılı!"});
}


module.exports = {
    getAllMessages,
    createMessage,
    seenMessage
}