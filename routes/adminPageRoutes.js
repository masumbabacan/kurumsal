const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    page,
    loginHistories,
    allHistoryDelete
} = 
require("../controllers/adminController");
router.get("/dashboard",authenticateUser,authorizePermissions('admin'),page);
router.get("/loginHistories",authenticateUser,authorizePermissions('admin'),loginHistories);
router.delete("/deleteHistory",authenticateUser,authorizePermissions('admin'),allHistoryDelete);

module.exports = router;