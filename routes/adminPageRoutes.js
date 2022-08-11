const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    page
} = 
require("../controllers/adminController");
router.get("/dashboard",authenticateUser,authorizePermissions('admin'),page);

module.exports = router;