const express = require("express");
const authController = require("../controllers/auth.controller");
const { checkAuth} = require("../middleware/check-auth");
const router = express.Router();


router.get("/my-payment", checkAuth, authController.my);
router.get("/my-orders", checkAuth, authController.myOder);


module.exports = router;