require("dotenv").config();
const express = require("express");
const Sequelize = require("sequelize");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require('express-ejs-layouts');
const userRoute = require("./routes/user");
const uploadRoute = require("./routes/upload");
const orderRoute = require("./routes/order");
const authRoute = require("./routes/auth");
const paymentRoute = require("./routes/payment");
const productRoute = require("./routes/product");
app.set('view engine', 'ejs'); 


app.use(express.json({ limit: "50mb" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use(express.static("uploads"));
app.use("/uploads", express.static("uploads"));
app.use("/css", express.static(__dirname + "assets/css"));
app.use("/js", express.static(__dirname + "assets/js"));
app.use("/img", express.static(__dirname + "assets/img"));
app.use("/fonts", express.static(__dirname + "assets/lib"));
app.use("assets/sass", express.static(__dirname + "assets/sass"));
app.use("assets/css", express.static(__dirname + "assets/assets/css"));
app.use("assets/js", express.static(__dirname + "assets/assets/js"));
app.use("assets/img", express.static(__dirname + "assets/assets/img"));
app.use("assets/fonts", express.static(__dirname + "assets/assets/webfonts"));


app.use("/public", express.static("public"));
app.use("/uploads/", express.static("uploads/"));

app.get("/ping", async (req, res) => {
  // let pay = await generatePayment();
  res.json({
    success: true,
    message: "Server Running ",
  
  });
});


app.use(expressLayouts);

app.set("layout", "./layouts/full-width");

// app.get("*", checkUser);
app.get("/set-cookies", (req, res) => {
  // res.setHeader("Set-Cookie", "newUser=true");

  res.cookie("newUser", false);

  res.send("you got the cookies!");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  res.json(cookies);
});
app.get(`test`, (req, res)=>{
  res.json({success: true, message:"server running"})
})
app.use(userRoute);
app.use( "/upload", uploadRoute);
app.use( "/product", productRoute);
app.use( "/order", orderRoute);
app.use( "/auth", authRoute);
app.use( "/payment", paymentRoute);
app.listen(process.env.APP_PORT, () => {
  console.log("server is running on port :", `http://localhost:${process.env.APP_PORT}`);
});
