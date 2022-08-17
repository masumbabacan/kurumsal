const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllReferances,
    createReferanceGet,
    createReferancePost,
    getReferance,
    updateReferance,
    deleteReferance,
    deleteReferanceImage,
    updateReferanceImages
} = 
require("../controllers/referanceController");

router.get("/createReferance",authenticateUser,authorizePermissions('admin','companyOfficial'),createReferanceGet);
router.post("/",authenticateUser,authorizePermissions('admin','companyOfficial'),createReferancePost);

router.get("/imageDelete",authenticateUser,authorizePermissions('admin','companyOfficial'),deleteReferanceImage);

router.get("/",authenticateUser,authorizePermissions('admin','companyOfficial'),getAllReferances);
router.get("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),getReferance);

router.patch("/updateReferance",authenticateUser,authorizePermissions('admin','companyOfficial'),updateReferance);
router.patch("/updateReferanceImages",authenticateUser,authorizePermissions('admin','companyOfficial'),updateReferanceImages);
router.delete("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),deleteReferance);

module.exports = router; 