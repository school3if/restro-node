const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const cartActions = require('../controllers/cart');
const userActions = require('../controllers/user');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/cart', async(req, res) => {
  if(req.session.logged){
    const userData = await userActions.getUserData(req.session.username, req.session.password);
    if(userData.length > 0)
        return res.render('cart', {
          title: "Кошик",
          username: req.session.username,
          cart: await cartActions.getUserCart(req.session.userId),
          role: userData[0].role
        });
    else{
      req.session.destroy(() => res.redirect('/'));
    }
  }else res.redirect('/');
});

router.post('/cart', parser, async (req, res) => {
  if(req.session.logged){
    const userId = req.session.userId;
    const cart = await cartActions.updateCart(userId, req.body);
    req.session.cart = cart;
  }
});

module.exports = router;