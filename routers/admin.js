const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const userActions = require('../controllers/user');
const cartActions = require('../controllers/cart');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });

router.get('/admin', async (req, res) => {
    if(req.session.logged){
        let data = await userActions.getUserData(req.session.username, req.session.password);
        if(data.length > 0){
            let cart = await cartActions.getUserCart(data[0]._id);
            let cartQuantity = await cart.dishes.reduce((summ, item) => summ += item.quantity, 0);
            if(data[0].role < 1) return res.redirect('/');
            res.render('admin', {
                title: "Панель керування",
                role: data[0].role,
                cartQuantity,
                username: req.session.username
            });
        }else return req.session.destroy(() => { res.redirect('/') });
    }else res.redirect('/');
});

router.get('/admin/newdish', async (req, res) => {
    if(req.session.logged){
        let data = await userActions.getUserData(req.session.username, req.session.password);
        if(data.length > 0){
            if(data[0].role < 1) return res.redirect('/');
            res.render('admin', {
                title: "Панель керування",
                role: data[0].role,
                username: req.session.username
            });
        }else return req.session.destroy(() => { res.redirect('/') });
    }else res.redirect('/');
});

module.exports = router;