const express = require("express");
const router = express();
const {authenticateUser} = require("../middleware/authentication")
const { 
    register,
    getLogin,
    postLogin,
    logout,
    verifyEmail,
    getForgotPassword,
    postForgotPassword,
    resetPassword } = 
require("../controllers/authController");


router.post("/register",register);

router.get("/login",getLogin); 
router.post("/login",postLogin);

router.post("/verify-email",verifyEmail);

router.get("/forgot-password",getForgotPassword);
router.post("/forgot-password",postForgotPassword);

router.post("/reset-password",resetPassword);
router.delete("/logout",authenticateUser,logout);

module.exports = router;