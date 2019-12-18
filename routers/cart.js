const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const cartActions = require('../controllers/cart');
const userActions = require('../controllers/user');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/cart', async(req, res) => {
  if(req.session.logged){
    const userId = req.session.userId ? req.session.userId : await userActions.getUserData(req.session.username, req.session.password);
     return res.render('cart', {
      title: "Кошик",
      username: req.session.username,
      cart: await cartActions.getUserCart(userId)
    })
  } else {
      req.session.destroy();
      res.redirect('/');
    }
});

router.post('/cart', parser, async (req, res) => {
  if(req.session.logged){
    const userId = req.session.userId;
    const cart = await cartActions.updateCart(userId, req.body);
    req.session.cart = cart;
    res.send(cart);
  }
});

module.exports = router;