const models = require("../models");
const jwt = require("jsonwebtoken");

const my = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedToken)

            const payments = await models.Payment.findAll({ where: { userId: decodedToken.id } });

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
                
                res.status(200).json({ data: resultWithDetails, success: true });
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
    } else {
        res.json({ message: "Invalid token" });
    }
};
const myOder = async (req, res) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedToken)

            const orders = await models.Order.findAll({ where: { userId: decodedToken.id } });

            if (orders && orders.length > 0) {
                const resultWithDetails = await Promise.all(
                    orders.map(async (order) => {
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
                
                res.status(200).json({ data: resultWithDetails, success: true });
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
    } else {
        res.json({ message: "Invalid token" });
    }
};
module.exports = {
    my: my,
    myOder: myOder,
};
