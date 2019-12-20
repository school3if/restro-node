const Cart = require('../models/cart');

async function getUserCart(user) {
  return await Cart.findOne({user}, (err, res) => {
    if (err) throw err;
    return res;
  })
}

async function updateCart(user, dishesList) {
  let cart = await getUserCart(user);
  if (!cart) {
    console.log('new cart');
    cart = new Cart;
    cart.user = user;
    cart.dishes = [...dishesList]
  } else {
    const dishes = cart.dishes;
    for (dish of dishesList) {
      const dishIndex = dishes.findIndex(item => item.dishId === dish.dishId);
      if (dishIndex === -1 && dish.dishId !== 'undefined') {
        cart.dishes.push(dish);
      } else {
        cart.dishes[dishIndex].quantity = dish.quantity;
      }
    }
  }
  await cart.save();
  return cart;
}

async function deleteFromCart(user, dish){
  let cart = await getUserCart(user);
  if(!cart) return null;
  else{
    const dishes = cart.dishes;
    const dishIndex = await dishes.findIndex(item => item.dishId === dish);
    if(dishIndex === -1) return null;
    else{
      cart.dishes.splice(dishIndex, 1);
      cart.save();
      return cart;
    }
  }
}

async function deleteCart(cartId) {
  Cart.deleteOne({ "_id" : cartId }, function (err, res) {
    if (err) return next (err);
    return true;
  });
}

function getCartQuantity(cartObj){
  return cartObj.dishes.reduce((summ, item) => summ += item.quantity, 0);
}

module.exports = {updateCart, getUserCart, getCartQuantity, deleteFromCart, deleteCart};
