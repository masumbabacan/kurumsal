const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const unselectedColumns = '-password -__v -verificationToken -passwordToken -passwordTokenExpirationDate';
const page = async (req,res) => {
    const authenticateUser = await User.findOne({_id:req.user.userId}).select(unselectedColumns);
    res.status(200).render("admin/homePage",{authenticateUser : authenticateUser});
}

module.exports = {
    page
}