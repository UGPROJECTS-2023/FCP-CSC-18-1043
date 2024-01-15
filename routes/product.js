const express = require("express");
const productController = require("../controllers/product.controller");
const AdminMiddleware = require("../middleware/admin-auth");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/", upload.single("pic"), productController.create);
// router.put("/",  productController.update);
router.get("/:id", productController.getById);
router.get("/", productController.index);
router.get("/delete/:id",  productController.destroy);
router.get("/product-details", productController.get_guest_product_details);
module.exports = router;
