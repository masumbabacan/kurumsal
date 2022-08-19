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
    deleteUser,
    showCurrentUser,
    deleteFromSystem
} = 
require("../controllers/userController");

//create user routes
router.get("/createUser",authenticateUser,authorizePermissions('admin'),createUserGet);
router.post("/",authenticateUser,authorizePermissions('admin'),createUserPost);

//get all user route
router.get("/",authenticateUser,authorizePermissions('admin'),getAllUsers);
router.get("/profile",authenticateUser,authorizePermissions('admin','companyOfficial'),showCurrentUser);

//get single user route
router.get("/:id",authenticateUser,authorizePermissions('admin'),getUser);

//delete user route
router.delete("/:id",authenticateUser,authorizePermissions('admin'),deleteUser);
router.delete("/deleteUser/:id",authenticateUser,authorizePermissions('admin'),deleteFromSystem);

//update user route
router.patch("/updateUser",authenticateUser,authorizePermissions('admin','companyOfficial'),updateUser);

//update authenticate user password route
router.patch("/updateUserPassword",authenticateUser,authorizePermissions('admin','companyOfficial'),updateUserPassword);


module.exports = router; 