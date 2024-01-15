'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.User);
      models.User.hasMany(Payment);
  
      Payment.belongsTo(models.Order);
      models.Order.hasMany(Payment);
    }
  }
  Payment.init({
    reference: DataTypes.STRING,
    amount: DataTypes.STRING,
    status: DataTypes.STRING,
    orderId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};