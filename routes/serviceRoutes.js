const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllServices,
    createServiceGet,
    createServicePost,
    getService,
    updateService,
    deleteService,
    deleteServiceImage,
    updateServiceImages
} = 
require("../controllers/serviceController");

router.get("/createService",authenticateUser,authorizePermissions('admin','companyOfficial'),createServiceGet);
router.post("/",authenticateUser,authorizePermissions('admin','companyOfficial'),createServicePost);

router.get("/imageDelete",authenticateUser,authorizePermissions('admin','companyOfficial'),deleteServiceImage);

router.get("/",authenticateUser,authorizePermissions('admin','companyOfficial'),getAllServices);
router.get("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),getService);

router.patch("/updateService",authenticateUser,authorizePermissions('admin','companyOfficial'),updateService);
router.patch("/updateServiceImages",authenticateUser,authorizePermissions('admin','companyOfficial'),updateServiceImages);
router.delete("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),deleteService);

module.exports = router; 