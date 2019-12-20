const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const userActions = require('../controllers/user');
const orderActions = require('../controllers/order');
const cartActions = require('../controllers/cart');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/orders', async (req, res) => {
  if(req.session.logged){
    let data = await userActions.getUserData(req.session.username, req.session.password);
    let orders = null;
    if(data.length > 0){
        if(data[0].role < 1) {
          orders = await orderActions.getAllOrders(); 
        } else {
          orders = await orderActions.getAllOrders();
        }
        console.log(orders);
        res.send(orders);
      }
    else{
      req.session.destroy();
      res.redirect('/');
    }
  } else res.redirect('/');
});

router.post('/orders', parser, async (req, res) => {
  if(req.session.logged) {
    const user = req.session.userId;
    const cart = req.session.cart ? req.session.cart : await cartActions.getUserCart(user);
    let price = 0;
    if (cart.dishes.length > 0) {
      const order = cart.dishes.map(
        dish => {
          price += (dish.quantity * dish.price);
          return {dish: dish.dishId, quantity: dish.quantity}}
      )
      price = price.toFixed(2);
      const userPhone = req.body.userPhone;
      const deliveryAdress = req.body.deliveryAdress;
      const orderObj = {user, order, price, userPhone, deliveryAdress};
      cartActions.deleteCart(cart._id);
      delete req.session.cart;
      res.send(await orderActions.confirmOrder(orderObj));
    } else {
      res.send(null);
    }
  }
});

module.exports = router;