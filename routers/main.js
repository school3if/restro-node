const {Router} = require('express');
const router = Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sha256 = require('sha256');
const parser = bodyParser.urlencoded({ extended: false });
const userActions = require('../controllers/user');
const cartActions = require('../controllers/cart');
const Dish = require('../models/dish');
const Menu = require('../models/menu');

router.get('/', async (req, res) => {
    const menu = await getDishes();
    if(req.session.logged) {
        var data = await userActions.getUserData(req.session.username, req.session.password);
        if(data.length > 0) {
            const cart = req.session.cart ? req.session.cart : await cartActions.getUserCart(data[0]._id);
            let cartQuantity = null;
            if (cart) {
                cartQuantity = cart.dishes.reduce((summ, item) => summ += item.quantity, 0);
            }
            return res.render('index', {
                title: "Головна",
                menu,
                username: data[0].username,
                role: data[0].role,
                cartQuantity
            });
        }
        else req.session.destroy();
    }
    res.render('index', {
        title: "Головна",
        menu,
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => { res.redirect('/') });
});

async function getDishes() {
    const menu = await getMenu();
    if (menu !== null) {
        return await Dish.find({
            '_id': { $in: menu.menu}
        }, function(err, res) {
            return res
        });
    } else return null;
}

async function getMenu(date = new Date()) {
    let nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return await Menu.findOne({
        "date": {
            "$gte": date, 
            "$lt": nextDay
        }},
        (err, res) => {
            if(err) throw err;
            return res;
        }
    )
}

module.exports = router;