const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const cartActions = require('../controllers/cart');
const userActions = require('../controllers/user');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/cart', async (req, res) => {
  if(req.session.logged){
    let data = await userActions.getUserData(req.session.username, req.session.password);
    if(data.length > 0)
      {
        let cart = await cartActions.getUserCart(data[0]._id);
        let cartQuantity = null;
        let cartTotal = 0;
        if (cart) {
          cartQuantity = cartActions.getCartQuantity(cart);
          cartTotal = cart.dishes.reduce((total, item) => total += item.quantity * item.price, 0).toFixed(2);
        }
      return res.render('cart', {
          title: "Кошик",
          username: req.session.username,
          role: data[0].role,
          cart,
          cartQuantity, cartTotal
        });
      }
    else{
      req.session.destroy();
      res.redirect('/');
    }  
  } else res.redirect('/');
});

router.post('/cart', parser, async (req, res) => {
  if(req.session.logged){
    const userId = req.session.userId;
    const cart = await cartActions.updateCart(userId, req.body);
    req.session.cart = cart;
    res.send(cart);
  }
});

router.delete('/cart', parser, async (req, res) => {
  if(req.session.logged){
    let data = await userActions.getUserData(req.session.username, req.session.password);
    if(data.length > 0){
      let cart = await cartActions.deleteFromCart(data[0]._id, req.body.dishid);
      req.session.cart = cart;
      res.send(cart);
    }else{
      req.session.destroy(() => {
        res.redirect('/');
      });
    }
  }
});

module.exports = router;