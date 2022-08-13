const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");

router.get("/",authenticateUser,authorizePermissions('admin','user','demo'));
router.get("/:id",authenticateUser,authorizePermissions('admin','user','demo'));
router.post("/",authenticateUser,authorizePermissions('admin','user','demo'));
router.patch("/:id",authenticateUser,authorizePermissions('admin','user','demo'));
router.delete("/:id",authenticateUser,authorizePermissions('admin','user','demo'));

module.exports = router; 