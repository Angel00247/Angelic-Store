function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.querySelector(".menu-btn");

    sidebar.classList.toggle("active");
    menuBtn.classList.toggle("active");

}

function openTable(eikona, onoma, timi) {
    document.getElementById("modalImg").src = eikona;
    document.getElementById("modalName").textContent = onoma;
    document.getElementById("modalPrice").textContent = timi;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.some(item => item.name === onoma);
    const wishlistBtn = document.getElementById("wishlist-btn");
    if (wishlistBtn) {
        wishlistBtn.textContent = exists ? "♥︎" : "♡";
    }

    document.getElementById("tableBox").style.display = "flex";
}

function closeTable() {
    const modalSize = document.getElementById("modal-size");
    if (modalSize) {
        modalSize.selectedIndex = 0;
    }

    document.getElementById("tableBox").style.display = "none";
}

window.addEventListener("click", function(event) {
    const tableBox = document.getElementById("tableBox");
    if (event.target === tableBox) {
        closeTable();
    }
});

function toggleWishlist() {
    const onoma = document.getElementById("modalName").textContent;
    const timiText = document.getElementById("modalPrice").textContent;
    const timi = parseFloat(timiText.replace("$", "")) || 0;
    const eikona = document.getElementById("modalImg").src;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const index = wishlist.findIndex(item => item.name === onoma);
    const wishlistBtn = document.getElementById("wishlist-btn")

    if (index > -1) {
        wishlist.splice(index, 1);
        if (wishlistBtn) wishlistBtn.textContent = "♡";
        alert("Removed from wishlist.");
    } else {
        wishlist.push({ name: onoma, price: timi, img: eikona });
        if (wishlistBtn) wishlistBtn.textContent = "♥︎";
        alert("Added to wishlist!")
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let countElement = document.getElementById("wishlist-count");
    if (countElement) {
        countElement.textContent = wishlist.length;
    }
}

document.addEventListener("DOMContentLoaded", updateWishlistCount);

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let countElement = document.getElementById("cart-count");
    if (countElement) {
        countElement.textContent = cart.length;
    }
}

document.addEventListener("DOMContentLoaded", updateCartCount);

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    fetch("https://formspree.io/f/mljropgq", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alert("Thank you! Your message has been sent successfully.");
            form.reset();
        } else {
            alert("Oops! There was a problem senting your message. Please try again.");
        }
    }).catch(error => {
        alert("Oops! There was a problem senting your message. Please try again.");
    });
}

document.addEventListener('click', function(e) {
    const numberOfSparkles = 8;
    for (let i = 0; i < numberOfSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';

        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        const dx = Math.cos(angle) * distance + 'px';
        const dy = Math.sin(angle) * distance + 'px';

        sparkle.style.setProperty('--dx', dx);
        sparkle.style.setProperty('--dy', dy);

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 600);
    }
});

function checkSelection(event) {
    if (event) event.preventDefault();

    const sizeSelect = document.getElementById("modal-size");
    if (sizeSelect && !sizeSelect.value) {
        alert("Please select a size.");
        return;
    }

    const selectedSize = sizeSelect ? sizeSelect.value : "One-Size"
    const name = document.getElementById("modalName").textContent;
    const priceText = document.getElementById("modalPrice").textContent;
    const price = parseFloat(priceText.replace("$", "")) || 0;
    const img = document.getElementById("modalImg").src;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(
        item => item.name === name && item.size === selectedSize
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        cart.push({
            name: name,
            price: price,
            img: img,
            size: selectedSize,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    if (typeof updateCartCount === "function") updateCartCount();
    alert("Added to cart!");
    closeTable();
}

function displayCart() {
    const container = document.getElementById("cart-items");
    const subtotalElem = document.getElementById("subtotal");
    const shippingElem = document.getElementById("shipping");
    const totalElem = document.getElementById("total");

    if (!container) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p class = 'empty'>Your cart is empty.</p>";
        if (subtotalElem) subtotalElem.textContent = "$0.00";
        if (shippingElem) shippingElem.textContent = "$0.00";
        if (totalElem) totalElem.textContent = "$0.00";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        let rawPrice = (item.price || item.timi || "0").toString().replace("$", "");
        let itemPrice = parseFloat(rawPrice) || 0;
        let itemQty = parseInt(item.quantity) || 1;

        subtotal += itemPrice * itemQty;

        let cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        let img = document.createElement("img");
        img.className = "cart-item-img";
        img.src = item.img || item.eikona;
        img.alt = item.name || item.onoma;

        let details = document.createElement("div");
        details.className = "cart-item-details";

        let title = document.createElement("h4");
        title.className = "cart-item-title";
        title.textContent = item.name || item.onoma;

        let size = document.createElement("p");
        size.className = "cart-item-size";
        size.innerHTML = "Size: <b>" + item.size + "</b>";

        let price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = "$" + itemPrice.toFixed(2) + " x " + itemQty;

        details.appendChild(title);
        details.appendChild(size);
        details.appendChild(price);

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "cart-delete-btn";
        deleteBtn.textContent = "X";
        deleteBtn.onclick = function() {
            removeFromCart(index);
        };

        cartItem.appendChild(img);
        cartItem.appendChild(details);
        cartItem.appendChild(deleteBtn);

        container.appendChild(cartItem);
    });

    let shipping = subtotal >= 75 ? 0 : 9.00;
    let total = subtotal + shipping;

    if (subtotalElem) subtotalElem.textContent = "$" + subtotal.toFixed(2);
    if (shippingElem) {
        shippingElem.textContent = shipping === 0 ? "FREE" : "$" + shipping.toFixed(2);
    }
    if (totalElem) totalElem.textContent = "$" + total.toFixed(2);
}

function updateCartQty(index, newQty) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity = parseInt(newQty) || 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function updateCartSize(index, newSize) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        cart[index].size = newSize;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
        if (typeof updateCartCount === "function") updateCartCount();
    }
}

document.addEventListener("DOMContentLoaded", displayCart);

function closeProductModal() {
    closeTable();
    currentEditIndex = null;

    let btn = document.getElementById("add-to-cart-btn");
    if (btn) {
        btn.textContent = "Add to Cart";
    }
}

function displayWishlist() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const container = document.getElementById("wishlist-container");

    if (!container) return;
    container.innerHTML = "";

    if (wishlist.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "empty-wishlist-msg";
        emptyMsg.textContent = "Your wishlist is empty.";
        container.appendChild(emptyMsg);
        return;
    }

    wishlist.forEach(function(item, index) {
        const card = document.createElement("div");
        card.className = "wishlist-card";

        const removeBtn = document.createElement("button");
        removeBtn.className = "wishlist-remove-btn";
        removeBtn.textContent = "X";
        removeBtn.onclick = function() {
            removeFromWishlist(index);
        };

        const img = document.createElement("img");
        img.className = "wishlist-card-img";
        img.src = item.img || item.eikona || item.image;
        img.alt = item.name || item.onoma;

        const title = document.createElement("h3");
        title.className = "wishlist-card-title";
        title.textContent = item.name || item.onoma;

        const price = document.createElement("p");
        price.className = "wishlist-card-price";
        const itemPrice = parseFloat(item.price || item.timi).toFixed(2);
        price.textContent = "$" + itemPrice;

        const sizeSelect = document.createElement('select');
        sizeSelect.className = 'wishlist-size-select';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Select Size:";
        sizeSelect.appendChild(defaultOption);

        const imagePath = (item.img || item.eikona || item.image || "").toLowerCase();
        let sizes = {};

        if (imagePath.includes('shoes')) {
            sizes = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11', '12'];
        } else if (imagePath.includes('accessories')) {
            sizes = ['One-Size'];
        } else {
            sizes = ['XS', 'S', 'M', 'L', 'XL'];
        }

        sizes.forEach(size => {
            const opt = document.createElement('option');
            opt.value = size;
            opt.textContent = size;
            sizeSelect.appendChild(opt);
        });

        const addCartBtn = document.createElement('button');
        addCartBtn.className = 'wishlist-add-cart-btn';
        addCartBtn.textContent = 'Add to Cart';

        addCartBtn.addEventListener('click', function() {
            const selectedSize = sizeSelect.value;

            if (!selectedSize) {
                alert('Please select a size.');
                return;
            }

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            const name = item.name || item.onoma;
            const price = parseFloat(item.price || item.timi);
            const image = item.img || item.eikona || item.image;

            const existingItem = cart.find(cartItem => (cartItem.name || cartItem.onoma) === name && cartItem.size === selectedSize);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({
                    name: name,
                    onoma: name,
                    price: price,
                    timi: price,
                    img: image,
                    eikona: image,
                    image: image,
                    size: selectedSize,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Added to cart!');
        });

        card.appendChild(removeBtn);
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(sizeSelect);
        card.appendChild(addCartBtn);

        container.appendChild(card);
    });
}

function removeFromWishlist(index) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    displayWishlist();
}

document.addEventListener("DOMContentLoaded", displayWishlist);

function openCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length == 0) {
        alert("Your cart is empty.");
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += parseFloat(item.price) * (item.quantity || 1);
    });

    document.getElementById('checkout-total-price').textContent = '$' + total.toFixed(2);
    document.getElementById('checkoutModal').classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.body.classList.remove('no-scroll');
}

window.addEventListener('click', function(event) {
    const modal = this.document.getElementById('checkoutModal');
    if (event.target === modal) {
        closeCheckout();
    }
});

function toggleCardFields(isCard) {
    const cardFields = document.getElementById('card-fields');
    if (cardFields) {
        cardFields.classList.toggle('hidden', !isCard);
    }
}

function handlePayment(event) {
    if (event) event.preventDefault();

    const cyberCardRadio = document.querySelector('input[value="card"]') || document.getElementById('payment-cyber');
    const isCyberCard = cyberCardRadio ? cyberCardRadio.checked : true;

    const nameElem = document.querySelector('.client-details input') || document.getElementById('client-name');
    const countryElem = document.getElementById('client-country');
    const cityElem = document.getElementById('client-city');
    const streetElem = document.getElementById('client-street');
    const emailElem = document.getElementById('client-email');

    const fullName = nameElem ? nameElem.value.trim() : '';
    const country = countryElem ? countryElem.value.trim() : '';
    const city = cityElem ? cityElem.value.trim() : '';
    const street = streetElem ? streetElem.value.trim() : '';
    const email = emailElem ? emailElem.value.trim() : '';

    if (fullName === '') {
        alert("Please enter your name.");
        return;
    }

    if (country === '') {
        alert("Please enter your country.");
        return;
    }

    if (city === '') {
        alert("Please enter your city.");
        return;
    }

    if (street === '') {
        alert("Please enter your street address.");
        return;
    }

    if (email === '') {
        alert("Please enter your email address.");
        return;
    }

    if (isCyberCard) {
        const cardNumElem = document.getElementById('card-num');
        const cardExpElem = document.getElementById('card-exp');
        const cardCvvElem = document.getElementById('card-cvv');

        const cardNumber = cardNumElem ? cardNumElem.value.replace(/\s+/g, '') : '';
        const expiry = cardExpElem ? cardExpElem.value.trim() : '';
        const cvv = cardCvvElem ? cardCvvElem.value.trim() : '';

        if (!/^\d{16}$/.test(cardNumber)) {
            alert("Please enter a valid 16-digit card number.");
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            alert("Please enter expiry date in MM/YY format.");
            return;
        }

        const [expMonthStr, expYearStr] = expiry.split('/');
        const expMonth = parseInt(expMonthStr, 10);
        const expYear = parseInt('20' + expYearStr, 10);

        if (expMonth < 1 || expMonth > 12) {
            alert("Please enter a valid month (01-12).");
            return;
        }

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            alert("Card has expired.");
            return;
        }

        if (!/^\d{3}$/.test(cvv)) {
            alert("Please enter a valid 3-digit CVV.");
            return;
        }
    }

    const orderId = Math.floor(100000 + Math.random() * 900000);

    const orderDetails = {
        orderId: orderId,
        fullName: fullName,
        email: email,
        country: country,
        city: city,
        street: street
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    localStorage.removeItem('cart');

    closeCheckout();
    if (typeof displayCart === 'function') {
        displayCart();
    }

    window.location.href = 'order.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.querySelector('.client-details input') || document.getElementById('client-name');
    const cardNumberInput = document.getElementById('card-num');
    const cardExpiryInput = document.getElementById('card-exp');
    const cardCvvInput = document.getElementById('card-cvv');

    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
    }

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 16);
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 4);
            
            if (value.length > 2) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2);
            } else {
                e.target.value = value;
            }
        });
    }

    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    const thanksName = document.getElementById('thanks-name');

    if (thanksName) {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("PiCqLN4iz_F-j5B6h");
        }

        const orderData = JSON.parse(localStorage.getItem('lastOrder'));

        if (orderData) {
            document.getElementById('thanks-name').innerText = "Thank you, " + orderData.fullName + "!";
            document.getElementById('order-email').innerText = orderData.email;
            document.getElementById('order-id').innerText = " #" + orderData.orderId;
            document.getElementById('order-address').innerText = " " + orderData.street + ", " + orderData.city + ", " + orderData.country;

            const templateParams = {
                to_name: orderData.fullName,
                to_email: orderData.email,
                order_id: orderData.orderId,
                address: orderData.street + ", " + orderData.city + ", " + orderData.country
            };

            if (typeof emailjs !== 'undefined') {
                emailjs.send("service_eyfgj1e", "template_goxu9a1", templateParams)
                    .then(function(response) {
                        console.log('Confirmation email sent!', response.status, response.text);
                    }, function(error) {
                        console.log('Email error:', error);
                    });
            }
        }
    }

    if (window.location.pathname.includes('order.html')) {
        const sound = new Audio('../Backgrounds & Logos/fairy_sound.mp3');
        sound.play().catch(err => console.log("Audio play error:", err));
    }
});