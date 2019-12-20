const Order = require('../models/order');

async function confirmOrder(orderObj) {
  const order = new Order(orderObj);
  await order.save();
  return order;
}

async function getUserOrders(user) {
  return await Order.find({user}, (err, res) => {
    if (err) throw err;
    return res;
  })
}

async function getAllOrders() {
  return await Order.find({}, (err, res) => {
    if (err) throw err;
    return res;
  })
}

module.exports = {confirmOrder, getAllOrders};
