const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllMessages,
    createMessage,
    seenMessage,
} = 
require("../controllers/messageController");

router.get("/",authenticateUser,authorizePermissions('admin','companyOfficial'),getAllMessages);

router.post("/",createMessage);
router.delete("/:id",authenticateUser,authorizePermissions('admin'),seenMessage);

module.exports = router; 