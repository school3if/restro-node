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
        price: button.dataset.price
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
        body: JSON.stringify(dish)
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
