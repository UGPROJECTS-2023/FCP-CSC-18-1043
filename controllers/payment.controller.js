const { where } = require("sequelize");
const models = require("../models");
const jwt = require("jsonwebtoken");

const index = async(req, res) => {
  try {
            const payments = await models.Payment.findAll()
            if (payments && payments.length > 0) {
              const resultWithDetails = await Promise.all(
                  payments.map(async (payment) => {
                      const order = await models.Order.findByPk(payment.orderId);
                      const user = await models.User.findByPk(payment.userId);

                      return {
                          id: payment.id,
                          reference: payment.reference,
                          amount: payment.amount,
                          status: payment.status,
                          orderId: payment.orderId,
                          userId: payment.userId,
                          createdAt: payment.createdAt,
                          updatedAt: payment.updatedAt,
                          UserId: payment.UserId,
                          OrderId: payment.OrderId,
                          orderDetails: order,
                          userDetails: user,
                      };
                  })
              );
              res.render("../views/pages/users/payment.ejs", {
                title: "Teemarh's Delight",
                layout: "../views/layouts/admin-dash",
                data: resultWithDetails,
              });
              // res.status(200).json({ data: resultWithDetails, success: true });
          } else {
              res.status(404).json({
                  message: "Payments not found",
                  success: false,
              });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({
              message: "Something went wrong!",
          });
      }
          }     
function getById(req, res) {
  const id = req.params.id;
  models.Payment.findByPk(id)
    .then((result) => {
      if (result) {
        models.Order.findByPk(result.orderId).then((orderResult) =>{
          if(orderResult){
            models.User.findByPk(result.userId).then((userResult) =>{
          if(userResult){
            res.status(200).json({ data: result, order:orderResult, user:userResult, success: true });
          }
            })
          }
        })
       
      } else {
        res.status(404).json({
          message: "Payment not found",
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

  
  
 

module.exports = {
  index: index,
  getById: getById,
};
