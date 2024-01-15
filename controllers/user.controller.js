const models = require("../models");
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {
  appUrl,
  randomCode,
} = require("../config/constant");
//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "email not registered..!";
  }
  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "incorrect password!";
  }

  //duplicate error code
  if (err.code === 11000) {
    errors.email = "Email already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    console.log(
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(properties);
        errors[properties.path] = properties.message;
      })
    );
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.USER_SECRET, {
    expiresIn: maxAge,
  });
};
module.exports.get_home = async (req, res) => {
  models.Product.findAll()
  .then((result) => {
    res.render("../views/pages/guest/index", {
      title: "Teemarh's Delight",
      data: result,
    });
  
  })
  .catch((error) => {
    res.status(500).json({
      message: "something went wrong!",
    });
  });
           
          };

          module.exports.get_contact = async (req, res) => {
            res.render("../views/pages/guest/contact", {
              title: "contact - Teemarh's Delight",
            });
          }
          module.exports.get_guest_product = async (req, res) => {
            res.render("../views/pages/guest/products", {
              title: "Snacks & Candies - Teemarh's Delight",
            });
          }





          module.exports.get_checkout = async (req, res) => {
            res.render("../views/pages/guest/checkout", {
              title: "chckout - Teemarh's Delight",
            });
          }
module.exports.get_login = (req, res) => {
    res.render("../views/pages/users/login.ejs", {
      title: "login",
      layout: "../views/layouts/login.ejs",
  });
};
module.exports.get_signup = (req, res) => {
    res.render("../views/pages/users/signup", {
      title: "Signup",
      layout: "../views/layouts/login",
  });
};
module.exports.get_dashboard = async (req, res) => {
  try {
    // Count the number of products
    const productCount = await models.Product.count();

    // Count the number of orders
    const orderCount = await models.Order.count();

    // Count the number of users
    const userCount = await models.User.count();

    // Sum the total amount from payments
    const totalAmount = await models.Payment.sum('amount');
 res.render("../views/pages/users/dashboard", {
      title: "Teemarh's Delight",
      layout: "../views/layouts/admin-dash",
      productCount,
      orderCount,
      userCount,
      totalAmount,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.byToken = (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    models.User.findByPk(decodedToken.id)
      .then((result) => {
        if (result) {
          res.status(200).json({ user: result, success: true });
         
        } else {
          res.status(404).json({
            message: "user not found",
            success: false,
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: "something went wrong!",
        });
      });
  } else {
    res.json({ message: "invalid token" });
  }
  
};
module.exports.get_customers = (req, res) => {
  models.User.findAll({where: {role:"USER"}})
  .then((result) => {
    res.render("../views/pages/users/customers", {
      title: "Teemarh's Delight",
      layout: "../views/layouts/admin-dash",
      data: result,
    });
    
  })
  .catch((error) => {
    res.status(500).json({
      message: "something went wrong!",
    });
  });
  
};
module.exports.get_customer_detail = (req, res) => {
  const id = req.params.id;
  models.User.findById(id)
    .then((result) => {
      // res.status(200).json({ success: true, result });
      res.render("../views/pages/users/customer-details", {
        title: "Teemarh's Delight",
        layout: "../views/layouts/admin-dash",
        data:result
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "error fetching Customer details" });
    });
};
module.exports.get_products = (req, res) => {
  models.Product.findAll()
  .then((result) => {
    // console.log(JSON.stringify(result))
    res.render("../views/pages/users/products", {
      title: "Teemarh's Delight",
      layout: "../views/layouts/admin-dash",
      data: result,
    });
  })
  .catch((error) => {
    res.status(500).json({
      message: "something went wrong!",
    });
  });
 
};

module.exports.get_product_detail = (req, res) => {
  const id = req.params.id;
  models.Product.findOne({
    where: { id: id } 
  })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      res.render("../views/pages/users/product-details", {
        title: "Teemarh's Delight",
        layout: "../views/layouts/admin-dash",
        data: result
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ success: false, message: "error fetching Product details" });
    });
       
 
};

module.exports.get_upload_product = (req, res) => {
  res.render("../views/pages/users/upload-product", {
    title: "Teemarh's Delight",
    layout: "../views/layouts/admin-dash",
  });
};
module.exports.get_my_orders = (req, res) => {
  
  res.render("../views/pages/users/my-order", {
    title: "Teemarh's Delight",
    layout: "../views/layouts/admin-dash",
  });
};module.exports.get_order_detail = (req, res) => {
  res.render("../views/pages/users/order-detail", {
    title: "Teemarh's Delight",
    layout: "../views/layouts/admin-dash",
  });
};module.exports.get_profile = (req, res) => {
  res.render("../views/pages/users/settings", {
    title: "Teemarh's Delight",
    layout: "../views/layouts/admin-dash",
  });
};
module.exports.get_my_payment = (req, res)=>{
  res.render("../views/pages/users/my-payment.ejs", {
    title: "Teemarh's Delight",
    layout: "../views/layouts/admin-dash",
  });
}
module.exports.sign_user = async (req, res) => {
  try {
    let pin = randomCode();

    if (req.body.email === "" || req.body.name === "" || req.body.phone === "") {
      return res.status(500).json({
        message: "All fields are required..!",
      });
    }

    const existingUser = await models.User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(500).json({
        message: "Email already exists!",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const user = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      image: uuidv4(),
      passSecret: pin,
      password: hash,
    };

    const createdUser = await models.User.create(user);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
     user: createdUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
module.exports.login_user = async (req, res) => {
  models.User.findOne({ where: { email: req.body.email } })
  .then((user) => {
    if (!user) {
      return res.status(400).json({ status:false,
        message: "No Account Found.",
      });
    }

    bcryptjs.compare(req.body.password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({
          message: "Something went wrong while comparing passwords.",
        });
      }

      if (result) {
        const token = jwt.sign(
          {
            id:user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            image: user.image,
          },
          process.env.JWT_SECRET, // Use your own JWT secret key here
          { expiresIn: "1h" } // Move expiresIn option to the same level as the JWT secret key
        );

        return res.status(200).json({
          success: true,
          message: "Authentication successful!",
          token: token,
          user: user,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Invalid credentials!",
        });
      }
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: "Something went wrong",
    });
  });
};

module.exports.updateUser = async (req, res) => {
  const id = req.params.id;
  models.User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((result) => {
      res.status(200).json({ success: true, message: "updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "error updating User" });
    });
};
module.exports.delete_user = async (req, res) => {
  const id = req.params.id;
  models.User.destroy({ where: { id: id } }).then((result) => {
      if (result > 0) {
        // Check if any rows were affected (user deleted)
        res.status(200).json({
          message: "User deleted successfully",
        });
      } else {
        // No rows affected, user with the specified ID not found
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: "Something went wrong",
        error: error.message, // Provide more information about the error
      });
    });
};
module.exports.updatePin = (req, res) => {
  let pin = randomCode();
  console.log(pin);
  User.findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        let email = req.body.email;
        let mailMessage = `Hello use the following link to reset your Password ${appUrl}/forget-pass?passSecret=${pin}`;
        sendEMail(email, `${appName} Password Reset`, mailMessage);
        User.updateOne({ email: email }, { passSecret: pin }).then((user) => {
          res.status(200).json({
            message: "Pin updated...!!!",
            success: true,
            mailMessage,
          });
        });
      } else {
        res.status(200).json({
          message: "Email not registered...!",
          success: false,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong, try again",
      });
    });
};

module.exports.updatePass = (req, res) => {
  const passSecret = req.query.passSecret;
  console.log(passSecret);
  User.findOne({ where: { passSecret: passSecret } })
    .then((result) => {
      bcryptjs.genSalt(10, function (err, salt) {
        bcryptjs.hash(req.body.password, salt, function (err, hash) {
          if (result) {
            let password = req.body.password;

            User.updateOne({ password: hash }, { passSecret: passSecret }).then(
              (user) => {
                res.status(200).json({
                  message: "Password Updated",
                  success: true,
                  user,
                });
              }
            );
          } else {
            res.status(200).json({
              message: "Password not updated...!!!",
              success: false,
            });
          }
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server Error...!!",
        error: error,
      });
    });
};


