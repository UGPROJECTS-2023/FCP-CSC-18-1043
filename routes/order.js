const express = require("express");
const orderController = require("../controllers/order.controller");

const { checkAuth} = require("../middleware/check-auth");
const router = express.Router();


router.post("/:id", checkAuth,  orderController.create);
// router.put("/",  orderController.update);
router.get("/verify", orderController.getVerify);
router.get("/:id", orderController.getById);
router.get("/", orderController.index);
router.delete("/:id",  orderController.destroy);


module.exports = router;
