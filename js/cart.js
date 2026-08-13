/* ==========================================
   YUGA CART ENGINE
   Global Cart System
   ========================================== */

const CART_STORAGE_KEY = "yuga-cart";

/* ==========================================
   DOM REFERENCES
   ========================================== */

let cartDrawer = null;
let cartOverlay = null;
let cartItems = null;
let cartSubtotal = null;
let cartSavings = null;
let cartIcon = null;
let cartCount = null;

let addToCartBtn = null;
let closeCartBtn = null;
let viewCartBtn = null;
let checkoutBtn = null;
let buyNowBtn = null;


/* ==========================================
   CART DATA
   ========================================== */

let cart =
    JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY)
    ) || [];


/* ==========================================
   INITIALIZE DOM
   ========================================== */

function initCartDOM() {

    /*
     * Get elements AFTER global components
     * have been loaded.
     */

    cartDrawer =
        document.getElementById("cartDrawer");

    cartOverlay =
        document.getElementById("cartOverlay");

    cartItems =
        document.getElementById("cartItems");

    cartSubtotal =
        document.getElementById("cartSubtotal");

    cartSavings =
        document.getElementById("cartSavings");

    cartIcon =
        document.getElementById("cartIcon");

    cartCount =
        document.getElementById("cartCount");

    addToCartBtn =
        document.getElementById("addToCart");

    closeCartBtn =
        document.getElementById("closeCart");

    /*
     * Your cart.html currently uses:
     *
     * <button class="view-cart-btn">
     *
     * So support BOTH ID and class.
     */

    viewCartBtn =
        document.getElementById("viewCartBtn") ||
        document.querySelector(".view-cart-btn");

    checkoutBtn =
        document.querySelector(".checkout-btn");

    buyNowBtn =
        document.getElementById("buyNow");


    /*
     * Debug information
     */

    console.log(
        "YUGA CART: DOM initialized"
    );

    console.log(
        "YUGA CART: cartDrawer =",
        cartDrawer
    );

    console.log(
        "YUGA CART: cartIcon =",
        cartIcon
    );

    console.log(
        "YUGA CART: cartItems =",
        cartItems
    );


    /*
     * Attach events
     */

    setupCartEvents();

    /*
     * Render cart
     */

    renderCart();

    updateCartBadge();

}


/* ==========================================
   SAVE CART
   ========================================== */

function saveCart() {

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    updateCartBadge();

}


/* ==========================================
   OPEN CART
   ========================================== */

function openCart() {

    if (!cartDrawer) {

        console.error(
            "YUGA CART: cartDrawer not found."
        );

        return;

    }


    cartDrawer.classList.add("active");


    if (cartOverlay) {

        cartOverlay.classList.add("active");

    }


    document.body.style.overflow = "hidden";

}


/* ==========================================
   CLOSE CART
   ========================================== */

function closeCart() {

    if (cartDrawer) {

        cartDrawer.classList.remove("active");

    }


    if (cartOverlay) {

        cartOverlay.classList.remove("active");

    }


    document.body.style.overflow = "";

}


/* ==========================================
   CART TOTAL
   ========================================== */

function calculateSubtotal() {

    /*
     * Calculate subtotal
     */

    const total =
        cart.reduce(

            (sum, item) => {

                return sum +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    );

            },

            0

        );


    /*
     * Calculate total savings
     */

    const totalSavings =
        cart.reduce(

            (sum, item) => {

                const originalPrice =
                    Number(
                        item.originalPrice ||
                        1699
                    );


                const sellingPrice =
                    Number(item.price);


                const savingPerItem =
                    originalPrice -
                    sellingPrice;


                return sum +
                    (
                        savingPerItem *
                        Number(item.quantity)
                    );

            },

            0

        );


    /*
     * Update subtotal
     */

    if (cartSubtotal) {

        cartSubtotal.textContent =
            "₹" +
            total.toLocaleString("en-IN");

    }


    /*
     * Update savings
     */

    if (cartSavings) {

        if (totalSavings > 0) {

            cartSavings.textContent =
                "You saved ₹" +
                totalSavings.toLocaleString(
                    "en-IN"
                );

            cartSavings.style.display =
                "block";

        }

        else {

            cartSavings.style.display =
                "none";

        }

    }


    return {
        total,
        totalSavings
    };

}


/* ==========================================
   CART BADGE
   ========================================== */

function updateCartBadge() {

    if (!cartCount) {

        return;

    }


    const totalItems =
        cart.reduce(

            (sum, item) => {

                return sum +
                    Number(item.quantity);

            },

            0

        );


    cartCount.textContent =
        totalItems;


    if (totalItems === 0) {

        cartCount.classList.add(
            "hidden"
        );

    }

    else {

        cartCount.classList.remove(
            "hidden"
        );

    }

}


/* ==========================================
   RENDER CART
   ========================================== */

function renderCart() {

    /*
     * Refresh cart from localStorage.
     *
     * This is useful when navigating between
     * different pages.
     */

    cart =
        JSON.parse(
            localStorage.getItem(
                CART_STORAGE_KEY
            )
        ) || [];


    /*
     * If cart drawer doesn't exist on
     * this page, only update the badge.
     */

    if (!cartItems) {

        updateCartBadge();

        return;

    }


    /*
     * EMPTY CART
     */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-bag-shopping"></i>

                <h3>
                    Your bag is empty
                </h3>

                <p>
                    Add something beautiful from YUGA.
                </p>

            </div>

        `;


        calculateSubtotal();

        updateCartBadge();

        return;

    }


    /*
     * CART ITEMS
     */

    cartItems.innerHTML =
        cart
            .map(
                item =>
                    createCartItem(item)
            )
            .join("");


    /*
     * TOTALS
     */

    calculateSubtotal();

    updateCartBadge();

}


/* ==========================================
   REMOVE ITEM
   ========================================== */

function removeCartItem(
    id,
    color,
    size
) {

    cart =
        JSON.parse(
            localStorage.getItem(
                CART_STORAGE_KEY
            )
        ) || [];


    cart =
        cart.filter(

            item => !(
                item.id === id &&
                item.color === color &&
                item.size === size
            )

        );


    saveCart();

    renderCart();


    /*
     * Update cart page if it exists
     */

    if (
        typeof renderCartPage ===
        "function"
    ) {

        renderCartPage();

    }

}


/* ==========================================
   INCREASE QUANTITY
   ========================================== */

function increaseQuantity(
    id,
    color,
    size
) {

    cart =
        JSON.parse(
            localStorage.getItem(
                CART_STORAGE_KEY
            )
        ) || [];


    const item =
        cart.find(

            item =>
                item.id === id &&
                item.color === color &&
                item.size === size

        );


    if (!item) {

        return;

    }


    item.quantity++;


    saveCart();

    renderCart();


    if (
        typeof renderCartPage ===
        "function"
    ) {

        renderCartPage();

    }

}


/* ==========================================
   DECREASE QUANTITY
   ========================================== */

function decreaseQuantity(
    id,
    color,
    size
) {

    cart =
        JSON.parse(
            localStorage.getItem(
                CART_STORAGE_KEY
            )
        ) || [];


    const item =
        cart.find(

            item =>
                item.id === id &&
                item.color === color &&
                item.size === size

        );


    if (!item) {

        return;

    }


    item.quantity--;


    /*
     * Remove item when quantity reaches 0
     */

    if (item.quantity <= 0) {

        removeCartItem(
            id,
            color,
            size
        );

        return;

    }


    saveCart();

    renderCart();


    if (
        typeof renderCartPage ===
        "function"
    ) {

        renderCartPage();

    }

}


/* ==========================================
   CART ITEM BUTTONS
   ========================================== */

function setupCartItemEvents() {

    if (!cartItems) {

        return;

    }


    /*
     * Prevent duplicate listeners
     */

    if (
        cartItems.dataset.eventsAttached ===
        "true"
    ) {

        return;

    }


    cartItems.dataset.eventsAttached =
        "true";


    cartItems.addEventListener(
        "click",
        function (e) {

            /*
             * REMOVE
             */

            const removeButton =
                e.target.closest(
                    ".remove-item"
                );


            if (removeButton) {

                removeCartItem(

                    removeButton.dataset.id,

                    removeButton.dataset.color,

                    removeButton.dataset.size

                );

                return;

            }


            /*
             * PLUS
             */

            const plusButton =
                e.target.closest(
                    ".qty-plus"
                );


            if (plusButton) {

                increaseQuantity(

                    plusButton.dataset.id,

                    plusButton.dataset.color,

                    plusButton.dataset.size

                );

                return;

            }


            /*
             * MINUS
             */

            const minusButton =
                e.target.closest(
                    ".qty-minus"
                );


            if (minusButton) {

                decreaseQuantity(

                    minusButton.dataset.id,

                    minusButton.dataset.color,

                    minusButton.dataset.size

                );

            }

        }
    );

}


/* ==========================================
   ADD CURRENT PRODUCT TO CART
   ========================================== */

function addCurrentProductToCart() {

    /*
     * Make sure product button exists
     */

    if (!addToCartBtn) {

        console.error(
            "YUGA CART: addToCart button not found."
        );

        return false;

    }


    /*
     * Product ID
     */

    const id =
        addToCartBtn.dataset.id;


    /*
     * Product data
     */

    if (
        typeof PRODUCTS ===
        "undefined"
    ) {

        console.error(
            "YUGA CART: PRODUCTS is not available."
        );

        return false;

    }


    const product =
        PRODUCTS[id];


    if (!product) {

        console.error(
            "YUGA CART: Product not found:",
            id
        );

        return false;

    }


    /*
     * Selected colour
     */

    const selectedColorButton =
        document.querySelector(
            ".color.active"
        );


    if (!selectedColorButton) {

        console.error(
            "YUGA CART: No colour selected."
        );

        return false;

    }


    const colorKey =
        selectedColorButton.dataset.color;


    const colorData =
        product.colors[colorKey];


    if (!colorData) {

        console.error(
            "YUGA CART: Colour not found:",
            colorKey
        );

        return false;

    }


    const colorName =
        colorData.name;


    /*
     * Selected size
     */

    const selectedSizeButton =
        document.querySelector(
            ".size-btn.active"
        );


    if (!selectedSizeButton) {

        console.error(
            "YUGA CART: No size selected."
        );

        return false;

    }


    const selectedSize =
        selectedSizeButton.textContent.trim();


    /*
     * Quantity
     */

    const quantityElement =
        document.getElementById("qty");


    const quantity =
        quantityElement
            ? Number(
                quantityElement.textContent
            )
            : 1;


    /*
     * Product image
     */

    const image =
        colorData.images.front;


    /*
     * Check existing item
     */

    const existingItem =
        cart.find(

            item =>
                item.id === id &&
                item.color === colorName &&
                item.size === selectedSize

        );


    if (existingItem) {

        existingItem.quantity +=
            quantity;

    }

    else {

        cart.push({

            id: id,

            name: product.name,

            image: image,

            price: product.price,

            originalPrice:
                product.originalPrice,

            color: colorName,

            size: selectedSize,

            quantity: quantity

        });

    }


    /*
     * Save
     */

    saveCart();


    return true;

}


/* ==========================================
   SETUP CART EVENTS
   ========================================== */

function setupCartEvents() {

    /*
     * Prevent duplicate setup
     */

    if (
        document.body.dataset
            .yugaCartInitialized ===
        "true"
    ) {

        return;

    }


    document.body.dataset
        .yugaCartInitialized =
        "true";


    /* ========================================
       CART ICON
       ======================================== */

    if (cartIcon) {

        cartIcon.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                renderCart();

                openCart();

            }
        );

    }

    else {

        console.warn(
            "YUGA CART: cartIcon not found."
        );

    }


    /* ========================================
       CLOSE BUTTON
       ======================================== */

    if (closeCartBtn) {

        closeCartBtn.addEventListener(
            "click",
            function () {

                closeCart();

            }
        );

    }


    /* ========================================
       OVERLAY
       ======================================== */

    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            function () {

                closeCart();

            }
        );

    }


    /* ========================================
       ESC KEY
       ======================================== */

    document.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Escape") {

                closeCart();

            }

        }
    );


    /* ========================================
       VIEW CART
       ======================================== */

    if (viewCartBtn) {

        viewCartBtn.addEventListener(
            "click",
            function () {

                closeCart();

                window.location.href =
                    "cart.html";

            }
        );

    }


    /* ========================================
       CHECKOUT
       ======================================== */

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "checkout.html";

            }
        );

    }


    /* ========================================
       ADD TO CART
       ======================================== */

    if (addToCartBtn) {

        addToCartBtn.addEventListener(
            "click",
            function () {

                const added =
                    addCurrentProductToCart();


                if (!added) {

                    return;

                }


                renderCart();


                if (
                    typeof renderCartPage ===
                    "function"
                ) {

                    renderCartPage();

                }


                openCart();

            }
        );

    }


    /* ========================================
       BUY NOW
       ======================================== */

    if (buyNowBtn) {

        buyNowBtn.addEventListener(
            "click",
            function () {

                const added =
                    addCurrentProductToCart();


                if (!added) {

                    return;

                }


                window.location.href =
                    "cart.html";

            }
        );

    }


    /*
     * Cart item events
     */

    setupCartItemEvents();

}


/* ==========================================
   INITIALIZE CART
   ========================================== */

function initializeYugaCart() {

    /*
     * Components must already exist.
     */

    if (
        !document.getElementById(
            "cartDrawer"
        )
    ) {

        console.warn(
            "YUGA CART: Cart component not loaded yet. Retrying..."
        );


        setTimeout(
            initializeYugaCart,
            50
        );


        return;

    }


    /*
     * Initialize
     */

    initCartDOM();

}


/* ==========================================
   START CART
   ========================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeYugaCart
    );

}

else {

    /*
     * Important for your global
     * components architecture.
     *
     * cart.js is dynamically loaded
     * AFTER components.js.
     */

    initializeYugaCart();

}