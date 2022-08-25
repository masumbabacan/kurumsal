const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllMessages,
    createMessage,
    seenMessage,
    getMessage
} = 
require("../controllers/messageController");

router.get("/",authenticateUser,authorizePermissions('admin','companyOfficial'),getAllMessages);
router.get("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),getMessage);

router.post("/",createMessage);
router.delete("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),seenMessage);

module.exports = router; 