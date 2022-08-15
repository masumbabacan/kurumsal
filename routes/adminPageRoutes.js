const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    page,
    loginHistories
} = 
require("../controllers/adminController");
router.get("/dashboard",authenticateUser,authorizePermissions('admin'),page);
router.get("/loginHistories",authenticateUser,authorizePermissions('admin'),loginHistories);

module.exports = router;