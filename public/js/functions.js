function getCookie(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if(cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset)
            if (end == -1) {
                end = cookie.length;
            }
            setStr = unescape(cookie.substring(offset, end));
        }
    }
    return(setStr);
}
function saveCookie(name, value, age){
    document.cookie = name + "=" + value + "; max-age=" + age;
}

async function addToCartClick(event) {
    event.preventDefault();
    const button = event.target;
    const dish = {
        dishId: button.dataset.id,
        name: button.dataset.name,
        price: button.dataset.price,
    }
    button.classList.remove('btn-primary');
    button.classList.add('btn-secondary', 'spinner');
    cart = await addToCart(dish);
    button.classList.remove('btn-secondary', 'spinner');
    button.classList.add('btn-primary');
    const cartQuantity = cart.dishes.reduce((summ, item) => summ += item.quantity, 0);
    updateMiniCart(cartQuantity);
    if (await addToCart(dish) === null) {
        button.innerHTML = 'error'
    };
}

async function addToCart(dish, quantity = 1) {
    dish.quantity = quantity;
    let response = await fetch('/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify([dish])
    });
    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

function updateMiniCart(count) {
    const miniCart = document.getElementById('miniCart');
    let quantity = miniCart.querySelector('p');
    if (!quantity) {
        quantity = document.createElement("p");
        miniCart.append(quantity);
    }
    quantity.innerHTML = count;
}

async function deleteFromCart(event){
    event.preventDefault();
    const button = event.target;
    let dish = { dishid: button.dataset.id };
    button.classList.remove('btn-danger');
    button.classList.add('btn-secondary', 'spinner');
    cart = await deleteFromCartQuery(dish);
    button.classList.remove('btn-secondary', 'spinner');
    button.classList.add('btn-danger');
    const cartQuantity = cart.dishes.reduce((summ, item) => summ += item.quantity, 0);
    updateMiniCart(cartQuantity);
    dynamicDelete(dish.dishid);
}

async function deleteFromCartQuery(dish){
    let response = await fetch('/cart', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(dish)
    });
    if(response.ok) return response.json();
}

function dynamicDelete(id){
    let dishes = document.getElementsByClassName('btn-delete');
    for(var i = 0; i < dishes.length; i++){
        if(dishes[i].dataset.id === id) return dishes[i].parentNode.parentNode.parentNode.remove();
    }
}

async function updateCart(event) {
    const cartDishes = document.querySelectorAll('.cart-dish');
    const dishes = [];
    let summ = 0;
    let count = 0;
    for (dishElem of cartDishes) {
        const dish = {};
        dish.dishId = dishElem.getElementsByTagName('button')[0].dataset.id;
        dish.quantity = parseInt(dishElem.getElementsByTagName('input')[0].value);
        dish.price = parseFloat(dishElem.getElementsByTagName('th')[1].innerText)
        count += dish.quantity;
        summ += dish.quantity * dish.price;
        dishes.push(dish);
    }
    let response = await fetch('/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(dishes)
    });
    if (response.ok) {
        updateMiniCart(count);
        document.getElementById('totalPrice').innerText = summ.toFixed(2);
    }
}