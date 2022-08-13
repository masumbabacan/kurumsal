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

router.get("/",authenticateUser,authorizePermissions('admin','user','demo'),getAllUsers);

router.get("/createUser",authenticateUser,authorizePermissions('admin','user','demo'),createUserGet);
router.post("/",authenticateUser,authorizePermissions('admin'),createUserPost);

router.get("/:id",authenticateUser,authorizePermissions('admin','user','demo'),getUser);

router.patch("/updateUserPassword",authenticateUser,authorizePermissions('admin'),updateUserPassword);
router.patch("/updateUser",authenticateUser,authorizePermissions('admin'),updateUser);


router.delete("/:id",authenticateUser,authorizePermissions('admin'),deleteUser);




// router.get("/showMe",authenticateUser,authorizePermissions('admin'),showCurrentUser);
module.exports = router; 