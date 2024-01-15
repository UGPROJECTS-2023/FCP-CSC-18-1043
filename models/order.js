'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User);
      models.User.hasMany(Order);
  
      Order.belongsTo(models.Product);
      models.Product.hasMany(Order);
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    reference: DataTypes.STRING,
    status: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    quantity: DataTypes.STRING,
    deliveryAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};