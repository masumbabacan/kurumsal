const express = require("express");
const router = express();
const {authenticateUser,authorizePermissions} = require("../middleware/authentication");
const { 
    getAllFranchises,
    createFranchiseGet,
    createFranchisePost,
    getFranchise,
    updateFranchise,
    deleteFranchise,
    deleteFranchiseImage,
    updateFranchiseImages
} = 
require("../controllers/franchiseController");

router.get("/createFranchise",authenticateUser,authorizePermissions('admin','companyOfficial'),createFranchiseGet);
router.post("/",authenticateUser,authorizePermissions('admin','companyOfficial'),createFranchisePost);

router.get("/imageDelete",authenticateUser,authorizePermissions('admin','companyOfficial'),deleteFranchiseImage);

router.get("/",authenticateUser,authorizePermissions('admin','companyOfficial'),getAllFranchises);
router.get("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),getFranchise);

router.patch("/updateFranchise",authenticateUser,authorizePermissions('admin','companyOfficial'),updateFranchise);
router.patch("/updateFranchiseImages",authenticateUser,authorizePermissions('admin','companyOfficial'),updateFranchiseImages);
router.delete("/:id",authenticateUser,authorizePermissions('admin','companyOfficial'),deleteFranchise);

module.exports = router; 