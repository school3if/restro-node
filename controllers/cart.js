const Cart = require('../models/cart');

async function getUserCart(user) {
  return await Cart.findOne({user}, (err, res) => {
    if (err) throw err;
    return res;
  })
}

async function updateCart(user, dish) {
  let cart = await getUserCart(user);
  if (!cart) {
    cart = new Cart;
    cart.user = user;
    cart.dishes = [dish]
  } else {
    const dishes = cart.dishes;
    const dishIndex = await dishes.findIndex(item => item.dishId === dish.dishId);
    if (dishIndex === -1) {
      cart.dishes.push(dish);
    } else {
      cart.dishes[dishIndex].quantity += dish.quantity;
    }
  }
  cart.save();
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

module.exports = {updateCart, getUserCart, deleteFromCart};