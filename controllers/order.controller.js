const models = require("../models");
const jwt = require("jsonwebtoken");
const {
  randomCode,
  generatePayment,
  verifyPayment,
} = require("../config/constant");
const create = async (req, res) => {
  try {
    
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      let pin = randomCode();
      const id = req.params.id;

      const result = await models.Product.findByPk(id);

      if (result) {
        const order = {
          userId: decodedToken.id,
          productId: result.id,
          reference: pin,
          status: "Ordered",
          quantity: req.body.quantity,
          deliveryAddress: req.body.deliveryAddress,
          paymentStatus: "Pending",
        };

        const createdOrder = await models.Order.create(order);

        console.log(createdOrder);
        const totalPrice = result.price * req.body.quantity;
        const payment = await generatePayment({
          tx_ref: pin,
          amount: totalPrice,
          email: decodedToken.email,
          phonenumber: decodedToken.phone,
          name: decodedToken.name,
        });
        console.log(payment.data);
        if (!payment.data || payment.data.status !== "success") {
          return res.status(400).json({
            success: false,
            message: "Failed to generate payment",
          });
        } else {
          const refPin = randomCode();
          const newPayment = {
            userId: decodedToken.id,
            orderId: createdOrder.id, // Assuming createdOrder has an 'id' property
            reference: refPin,
            status: "Pending",
            amount: totalPrice,
          };

          const createdPayment = await models.Payment.create(newPayment);
          res.status(200).json({
            message: "Order created Successfully",
            success: true,
            OrderData: createdOrder,
            paymentData: createdPayment,
            link: payment.data.data.link,
          });
        }
      } else {
        // res.status(404).json({
        //   message: "Product not found",
        //   success: false,
        // });
      }
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong...",
    });
  }
};

const getVerify = async (req, res) => {
  try {
    const payments = await models.Payment.findAll();
    if (!payments || payments.length === 0) {
      return res.status(400).json({ success: false, message: 'No Payment found' });
    }

    const latestPayment = payments[payments.length - 1];
    const reference = latestPayment?.reference;

    if (!reference) {
      return res.status(400).json({ success: false, message: 'Reference not found in data' });
    }

    const verify = await verifyPayment(reference);

    if (!verify || verify.status !== "success") {
      return res.status(400).json({ success: false, message: 'Failed to verify payment' });
    }

    // Update purchase status based on verification result
    const updatedPayment = await models.Payment.findByPk(
      latestPayment.id,
      { where: { status: "Paid" } },
    );

    if (!updatedPayment) {
      return res.status(400).json({ success: false, message: 'Failed to update payment status' });
    }

    // Move the block inside the if (updatedPayment) scope
    if (updatedPayment) {
      const updatedOrder = await models.Order.findByPk(
        latestPayment.orderId,
        { where: { paymentStatus: "Paid", status: "Success" } },
      );

      if (!updatedOrder) {
        return res.status(400).json({ success: false, message: 'Failed to update order status' });
      }

      console.log('Payment status updated successfully:', updatedPayment);
      console.log('Order status updated successfully:', updatedOrder);

      res.render("../views/pages/users/verify-order", {
        title: "Teemarh's Delight",
        data: updatedPayment,
        result: updatedOrder,
      });
    }
  } catch (error) {
    console.error('Error in get_verify:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



function index(req, res) {
  models.Order.findAll()
      .then(async (result) => {
          if (result && result.length > 0) {
              const resultWithDetails = await Promise.all(
                  result.map(async (order) => {
                      const product = await models.Product.findByPk(order.productId);
                      const user = await models.User.findByPk(order.userId);

                      return {
                          id: order.id,
                          userId: order.userId,
                          productId: order.productId,
                          reference: order.reference,
                          status: order.status,
                          paymentStatus: order.paymentStatus,
                          quantity: order.quantity,
                          deliveryAddress: order.deliveryAddress,
                          createdAt: order.createdAt,
                          updatedAt: order.updatedAt,
                          UserId: order.UserId,
                          ProductId: order.ProductId,
                          productDetails: product,
                          userDetails: user,
                      };
                  })
              );
              res.render("../views/pages/users/order.ejs", {
                title: "Teemarh's Delight",
                layout: "../views/layouts/admin-dash",
                data: resultWithDetails,
              });
              // res.status(200).json({
              //     success: true,
              //     data: resultWithDetails,
              //     message: "Order fetched",
              // });
          } else {
              res.status(404).json({
                  message: "Orders not found",
                  success: false,
              });
          }
      })
      .catch((error) => {
          console.error(error);
          res.status(500).json({
              message: "Something went wrong!",
          });
      });
}

function getById(req, res) {
  const id = req.params.id;
  models.Order.findByPk(id)
    .then((result) => {
      if (result) {
        res.status(200).json({ user: result, success: true });
      } else {
        res.status(404).json({
          message: "Order not found",
          success: false,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "something went wrong!",
      });
    });
}

function destroy(req, res) {
  const id = req.params.id;

  models.Order.destroy({ where: { id: id } })
    .then((result) => {
      if (result > 0) {
        // Check if any rows were affected (user deleted)
        res.status(200).json({
          message: "Order deleted successfully",
        });
      } else {
        // No rows affected, user with the specified ID not found
        res.status(404).json({
          message: "Order not found",
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
}

module.exports = {
  create: create,
  index: index,
  getVerify: getVerify,
  getById: getById,
  destroy: destroy,
};
