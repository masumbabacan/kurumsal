const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllUsers,
    getUser,
    createUserGet,
    createUserPost,
    updateUser,
    updateUserPassword,
    deleteUser
} = 
require("../controllers/userController");

//create user routes
router.get("/createUser",authenticateUser,authorizePermissions('admin','user','demo'),createUserGet);
router.post("/",authenticateUser,authorizePermissions('admin'),createUserPost);

//get all user route
router.get("/",authenticateUser,authorizePermissions('admin','user','demo'),getAllUsers);

//get single user route
router.get("/:id",authenticateUser,authorizePermissions('admin','user','demo'),getUser);

//delete user route
router.delete("/:id",authenticateUser,authorizePermissions('admin','user','demo'),deleteUser);

//update user route
router.patch("/updateUser",authenticateUser,authorizePermissions('admin','user','demo'),updateUser);

//update authenticate user password route
router.patch("/updateUserPassword",authenticateUser,authorizePermissions('admin','user','demo'),updateUserPassword);

// router.get("/showMe",authenticateUser,authorizePermissions('admin'),showCurrentUser);
module.exports = router; 