const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllMessages,
    createMessage,
    seenMessage,
    getMessage,
    sendMessage,
} = 
require("../controllers/messageController");

router.get("/",authenticateUser,authorizePermissions('admin','companyOfficial'),getAllMessages);
router.get("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),getMessage);

router.post("/",createMessage);
router.post("/sendMessage",authenticateUser,authorizePermissions('admin','companyOfficial'),sendMessage);
router.delete("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),seenMessage);

module.exports = router; 