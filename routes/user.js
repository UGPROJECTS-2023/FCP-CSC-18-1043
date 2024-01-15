const Router = require("express");
const userController = require("../controllers/user.controller");
const paymentController = require("../controllers/payment.controller");
const { checkAuth} = require("../middleware/check-auth");

const router = Router();

// router.get("*", checkUser);
router.get("/", userController.get_home);
router.get("/contact", userController.get_contact);
router.get("/checkout", userController.get_checkout);
router.get("/guest-products", userController.get_guest_product);
router.get("/", userController.get_home);
router.get("/", userController.get_home);
router.get("/login", userController.get_login);
router.get("/register", userController.get_signup);
router.post("/create", userController.sign_user);
router.post("/user-login", userController.login_user);
router.get("/delete/:id", userController.delete_user);
// router.get("/forget-pass", userController.get_pass);

router.get("/userByToken", checkAuth, userController.byToken);
router.get("/dashboard",  userController.get_dashboard);
router.get("/customers", userController.get_customers);
router.get("/customer-details", userController.get_customer_detail);
router.get("/products", userController.get_products);
router.get("/product-details/:id", userController.get_product_detail);
router.get("/upload-product", userController.get_upload_product);
router.get("/my-orders", userController.get_my_orders);
router.get("/order-detail", userController.get_order_detail);
router.get("/profile", userController.get_profile);
router.get("/my-payments", userController.get_my_payment);

module.exports = router;
