var order_status = false;
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
    else return null;
}

function dynamicDelete(id){
    let dishes = document.getElementsByClassName('btn-delete');
    for(var i = 0; i < dishes.length; i++){
        if(dishes[i].dataset.id === id) return dishes[i].parentNode.parentNode.parentNode.remove();
    }
}

async function updateCart(event) {
    const cart = getCartData();
    let response = await fetch('/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(cart.dishes)
    });
    if (response.ok) {
        updateMiniCart(cart.count);
        document.getElementById('totalPrice').innerText = cart.summ.toFixed(2);
    }
}

function getCartData() {
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
    return { dishes, summ, count }
}

async function confirmOrder() {
    const userPhone = document.getElementById('userPhone').value;
    const deliveryAdress = document.getElementById('deliveryAdress').value;
    let response = await fetch('/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({userPhone, deliveryAdress})
    });
    if (response.ok) {
        updateMiniCart(0);
        const confirmMessage = document.getElementById('confirmMessage');
        confirmMessage.classList.remove('d-none');
        setTimeout(function() { window.location = '/';}, 2000)
    }
}


async function getOrders() {
    if(order_status) return;
    let response = await fetch('/orders', {
        method: 'GET',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
    });
    if (response.ok) {
        order_status = true;
        document.getElementById('orderTable');
        const orders = await response.json();
        let i=0;
        for (order of orders) {
            i++;
            const orderRow = document.createElement('tr');
            orderRow.innerHTML = `
            <th scope="row">${i}</th>
            <td>${JSON.stringify(order.order)}</td>
            <td>${order.createdAt}</td>
            <td>${order.price} грн.</td>
            <td>${order.status}</td>
            `;
            orderTable.append(orderRow);
        }
    } else return null;
}