const express = require("express");
const paymentController = require("../controllers/payment.controller");
const { checkAuth} = require("../middleware/check-auth");
const router = express.Router();

router.get("/:id", paymentController.getById);
router.get("/", paymentController.index);

module.exports = router;
