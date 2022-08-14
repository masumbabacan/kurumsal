const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllServices,
    createServiceGet,
    createServicePost,
    getService,
    updateService,
    deleteService
} = 
require("../controllers/serviceController");

router.get("/createService",authenticateUser,authorizePermissions('admin','user','demo'),createServiceGet);
router.post("/",authenticateUser,authorizePermissions('admin'),createServicePost);

router.get("/",authenticateUser,authorizePermissions('admin','user','demo'),getAllServices);
router.get("/:id",authenticateUser,authorizePermissions('admin','user','demo'),getService);

router.patch("/updateService",authenticateUser,authorizePermissions('admin'),updateService);
router.delete("/:id",authenticateUser,authorizePermissions('admin'),deleteService);

module.exports = router; 