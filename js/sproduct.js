const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const change = document.getElementById('first');

//cart container const
const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.pro-container');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCartInfo = document.getElementById('cart-count-info');

let cartItemID = 1;
eventListeners();

//navbar
if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

//mobile device
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}


// all event listener
function eventListeners() {
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });
    // show / hide cart list items
    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });

    productList.addEventListener('click', purchaseProduct);

    cartList.addEventListener('click', deleteProduct);
}

// update cart  info
function updateCartInfo() {
    let cartInfo = findCartInfo();
    cartCartInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

updateCartInfo();

// Load products item content from JSON file
function loadJSON() {
    fetch('test.json')
        .then(Response => Response.json())
        .then(data => {
            let html = ''
            data.forEach(product => {
                html += `
                <div class="pro">
                <div class= "product-img"> 
                <img src="${product.imgSrc}" alt="" onclick="window.location.href='${product.href}'">
                <div class="des">
                    <span class="product-name">${product.name}</span>
                    <h5 class="product-category">${product.category}</h5>
                    <div class="star">
                        <i class="uil uil-star"></i>
                        <i class="uil uil-star"></i>
                        <i class="uil uil-star"></i>
                        <i class="uil uil-star"></i>
                        <i class="uil uil-star"></i>
                    </div>
                    <h4 class="product-price">₦${product.price}</h4>
                </div>
                <button type="button" class="add-to-cart-btn">
                <i class="uil uil-shopping-cart-alt"></i>Add to cart
            </button>
                <a href="#"> <i class="uil uil-favorite star1"></i></a>
            </div> 
         </div>
             `;
            });
            productList.innerHTML = html;
        })
        // .catch(error => {
        //     alert('User live server or local server');
        // })
}

// purchase product
function purchaseProduct(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

// get product info after add-to-cart button click
function getProductInfo(product) {
    swal({
        title: "Success!",
        text: "You have added a new item to your cart-list!",
        icon: "success",
        button: "Thank-You",
    });
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent,
    }
    cartItemID++,
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

// add the selected product to the cart list
function addToCartList(product) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
     <img src="${product.imgSrc}" alt="">
    <div class="cart-item-info">
        <h3 class="cart-item-name">${product.name}</h3>
        <span class="cart-item-category">${product.category}</span>
        <span class="cart-item-price">${product.price}</span>
    </div>
    <button type="button" class="cart-item-del-btn">
        <i class="uil uil-times-circle"></i>
    </button>
    `;
    cartList.appendChild(cartItem);
}


// save the product in the local storage
function saveProductInStorage(item) {
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

//get all the product info if there is any local storage
function getProductFromStorage() {
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // returns empty array if there isn't any product info
}

//load cart products
function loadCart() {
    let products = getProductFromStorage();
    if (products.length < 1) {
        cartItemID = 1; // if there is no any product in the local storage
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // else get the id of the last product and increase it by 1
    }
    products.forEach(product => addToCartList(product));

    // calculate and update UI of cart info 
    updateCartInfo();
}

// calculate total price of the cart and other info
function findCartInfo() {
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); // removing dollar sign
        return acc += price;
    }, 0); // adding all the prices

    return {
        total: total.toFixed(3),
        productCount: products.length
    }
}


// delete product from cart list and local storage
function deleteProduct(e) {
    let cartItem;
    if (e.target.tagName === "BUTTON") {
        cartItem = e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    } else if (e.target.tagName === "I") {
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
    updateCartInfo();
}