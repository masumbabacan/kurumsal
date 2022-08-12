const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = 
require("../controllers/userController");

router.get("/",authenticateUser,authorizePermissions('admin'),getAllUsers);
router.get("/showMe",authenticateUser,authorizePermissions('admin'),showCurrentUser);
router.get("/:id",authenticateUser,authorizePermissions('admin'),getUser);
router.patch("/updateUserPassword",authenticateUser,authorizePermissions('admin'),updateUserPassword);
router.patch("/updateUser",authenticateUser,authorizePermissions('admin'),updateUser);

module.exports = router; 