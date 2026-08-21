/* =========================================================
        YUGA CHECKOUT
        Razorpay + Google Sheets + Meta Pixel
        + Thank You Page
========================================================= */


/* =========================================================
        DOM ELEMENTS
========================================================= */

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const placeOrder =
    document.getElementById("placeOrder");


/* =========================================================
        STORAGE
========================================================= */

const CUSTOMER_STORAGE_KEY =
    "yuga-customer";

const LAST_ORDER_STORAGE_KEY =
    "yuga-last-order";


/* =========================================================
        STATE
========================================================= */

let isSubmitting = false;


/* =========================================================
        GOOGLE APPS SCRIPT API
========================================================= */

const ORDER_API =
    "https://script.google.com/macros/s/AKfycbyNqAAjJYJJDJaq9cJbEMLu9XXtFN3L1nOcABflNuwFIVs325PQoinQTFpdnQcxmPgN/exec";


/* =========================================================
        RAZORPAY
========================================================= */

/*
    IMPORTANT:

    This is your TEST Key ID.

    NEVER put your Razorpay Key Secret
    inside this JavaScript file.

    Keep the Key Secret inside:

    Google Apps Script
    → Project Settings
    → Script Properties
*/

const RAZORPAY_KEY_ID =
    "rzp_test_TSMxJ1qO9OjBZ2";


/* =========================================================
        BUTTON LOADING
========================================================= */

function startLoading(text = "Processing...") {

    if (!placeOrder) {
        return;
    }

    placeOrder.disabled = true;

    placeOrder.dataset.originalText =
        placeOrder.innerHTML;

    placeOrder.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        ${text}
    `;
}


function updateLoading(text) {

    if (!placeOrder) {
        return;
    }

    placeOrder.disabled = true;

    placeOrder.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        ${text}
    `;
}


function stopLoading() {

    if (!placeOrder) {
        return;
    }

    placeOrder.disabled = false;

    placeOrder.innerHTML =
        placeOrder.dataset.originalText ||
        "Pay Securely →";
}


/* =========================================================
        GET CART
========================================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CART_STORAGE_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "YUGA cart error:",
            error
        );

        return [];

    }

}


/* =========================================================
        CUSTOMER DETAILS
========================================================= */

function saveCustomerDetails() {

    const nameInput =
        document.getElementById(
            "customerName"
        );

    const emailInput =
        document.getElementById(
            "customerEmail"
        );

    const phoneInput =
        document.getElementById(
            "customerPhone"
        );

    const addressInput =
        document.getElementById(
            "customerAddress"
        );

    const cityInput =
        document.getElementById(
            "customerCity"
        );

    const stateInput =
        document.getElementById(
            "customerState"
        );

    const pinInput =
        document.getElementById(
            "customerPin"
        );


    const customer = {

        name:
            nameInput
                ? nameInput.value
                : "",

        email:
            emailInput
                ? emailInput.value
                : "",

        phone:
            phoneInput
                ? phoneInput.value
                : "",

        address:
            addressInput
                ? addressInput.value
                : "",

        city:
            cityInput
                ? cityInput.value
                : "",

        state:
            stateInput
                ? stateInput.value
                : "",

        pin:
            pinInput
                ? pinInput.value
                : ""

    };


    localStorage.setItem(

        CUSTOMER_STORAGE_KEY,

        JSON.stringify(
            customer
        )

    );

}


function loadCustomerDetails() {

    let customer = null;


    try {

        customer =
            JSON.parse(
                localStorage.getItem(
                    CUSTOMER_STORAGE_KEY
                )
            );

    } catch (error) {

        console.warn(
            "Unable to load saved customer details."
        );

    }


    if (!customer) {
        return;
    }


    const nameInput =
        document.getElementById(
            "customerName"
        );

    const emailInput =
        document.getElementById(
            "customerEmail"
        );

    const phoneInput =
        document.getElementById(
            "customerPhone"
        );

    const addressInput =
        document.getElementById(
            "customerAddress"
        );

    const cityInput =
        document.getElementById(
            "customerCity"
        );

    const stateInput =
        document.getElementById(
            "customerState"
        );

    const pinInput =
        document.getElementById(
            "customerPin"
        );


    if (nameInput) {

        nameInput.value =
            customer.name || "";

    }


    if (emailInput) {

        emailInput.value =
            customer.email || "";

    }


    if (phoneInput) {

        phoneInput.value =
            customer.phone || "";

    }


    if (addressInput) {

        addressInput.value =
            customer.address || "";

    }


    if (cityInput) {

        cityInput.value =
            customer.city || "";

    }


    if (stateInput) {

        stateInput.value =
            customer.state || "";

    }


    if (pinInput) {

        pinInput.value =
            customer.pin || "";

    }

}


/* =========================================================
        CHECK RAZORPAY SCRIPT
========================================================= */

function isRazorpayReady() {

    return (
        typeof Razorpay !== "undefined"
    );

}


/* =========================================================
        VALIDATION
========================================================= */

function markFieldError(inputId) {

    const input =
        document.getElementById(
            inputId
        );

    if (input) {

        input.classList.add(
            "error"
        );

    }

}


function clearFieldErrors() {

    document
        .querySelectorAll(
            "input.error, textarea.error"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "error"
                );

            }
        );

}


function validateCustomerDetails() {

    clearFieldErrors();


    const name =
        document
            .getElementById(
                "customerName"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "customerEmail"
            )
            .value
            .trim();


    const phone =
        document
            .getElementById(
                "customerPhone"
            )
            .value
            .trim();


    const address =
        document
            .getElementById(
                "customerAddress"
            )
            .value
            .trim();


    const city =
        document
            .getElementById(
                "customerCity"
            )
            .value
            .trim();


    const state =
        document
            .getElementById(
                "customerState"
            )
            .value
            .trim();


    const pin =
        document
            .getElementById(
                "customerPin"
            )
            .value
            .trim();


    let valid = true;


    /* =========================================
            NAME
    ========================================= */

    if (!name) {

        markFieldError(
            "customerName"
        );

        valid = false;

    }


    /* =========================================
            PHONE
    ========================================= */

    if (
        !/^[6-9]\d{9}$/.test(
            phone
        )
    ) {

        markFieldError(
            "customerPhone"
        );

        valid = false;

    }


    /* =========================================
            ADDRESS
    ========================================= */

    if (!address) {

        markFieldError(
            "customerAddress"
        );

        valid = false;

    }


    /* =========================================
            CITY
    ========================================= */

    if (!city) {

        markFieldError(
            "customerCity"
        );

        valid = false;

    }


    /* =========================================
            STATE
    ========================================= */

    if (!state) {

        markFieldError(
            "customerState"
        );

        valid = false;

    }


    /* =========================================
            PIN
    ========================================= */

    if (
        !/^\d{6}$/.test(
            pin
        )
    ) {

        markFieldError(
            "customerPin"
        );

        valid = false;

    }


    /* =========================================
            OPTIONAL EMAIL
    ========================================= */

    if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        )
    ) {

        markFieldError(
            "customerEmail"
        );

        valid = false;

    }


    if (!valid) {

        alert(
            "Please check your customer and shipping details."
        );

    }


    return valid;

}


/* =========================================================
        RENDER CHECKOUT
========================================================= */

function renderCheckout() {

    const cart =
        getCart();


    if (
        !cart ||
        cart.length === 0
    ) {

        window.location.href =
            "cart.html";

        return;

    }


    if (checkoutItems) {

        checkoutItems.innerHTML =

            cart.map(
                item => `

                <div class="checkout-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}">

                    <div>

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ${item.color} • ${item.size}
                        </p>

                        <small>
                            Qty ${item.quantity}
                        </small>

                    </div>

                    <strong>

                        ₹${(
                            Number(item.price) *
                            Number(item.quantity)
                        ).toLocaleString("en-IN")}

                    </strong>

                </div>

            `
            ).join("");

    }


    const subtotal =
        calculateCartTotal(
            cart
        );


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            "₹" +
            subtotal.toLocaleString(
                "en-IN"
            );

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            "₹" +
            subtotal.toLocaleString(
                "en-IN"
            );

    }


    loadCustomerDetails();

}


/* =========================================================
        CALCULATE TOTAL
========================================================= */

function calculateCartTotal(cart) {

    return cart.reduce(

        (sum, item) =>

            sum +
            (
                Number(item.price) *
                Number(item.quantity)
            ),

        0

    );

}


/* =========================================================
        META PIXEL
        INITIATE CHECKOUT
========================================================= */

function trackInitiateCheckout(
    cart,
    subtotal
) {

    if (
        typeof fbq !== "function"
    ) {

        console.warn(
            "YUGA Meta Pixel: fbq not available."
        );

        return;

    }


    const contentIds =
        cart.map(
            item => item.id
        );


    const contents =
        cart.map(
            item => ({

                id:
                    item.id,

                quantity:
                    Number(
                        item.quantity
                    ),

                item_price:
                    Number(
                        item.price
                    )

            })
        );


    fbq(
        "track",
        "InitiateCheckout",
        {

            content_ids:
                contentIds,

            contents:
                contents,

            content_type:
                "product",

            value:
                Number(
                    subtotal
                ),

            currency:
                "INR"

        }
    );


    console.log(
        "YUGA Meta Pixel: InitiateCheckout",
        {
            content_ids:
                contentIds,

            value:
                subtotal,

            currency:
                "INR"
        }
    );

}


/* =========================================================
        META PIXEL
        PURCHASE
========================================================= */

function trackPurchase(
    cart,
    amount,
    orderId
) {

    if (
        typeof fbq !== "function"
    ) {

        console.warn(
            "YUGA Meta Pixel: fbq not available for Purchase."
        );

        return;

    }


    const contentIds =
        cart.map(
            item => item.id
        );


    const contents =
        cart.map(
            item => ({

                id:
                    item.id,

                quantity:
                    Number(
                        item.quantity
                    ),

                item_price:
                    Number(
                        item.price
                    )

            })
        );


    fbq(
        "track",
        "Purchase",
        {

            content_ids:
                contentIds,

            contents:
                contents,

            content_type:
                "product",

            value:
                Number(
                    amount
                ),

            currency:
                "INR",

            order_id:
                orderId

        }
    );


    console.log(
        "YUGA Meta Pixel: Purchase",
        {

            orderId:
                orderId,

            amount:
                amount

        }
    );

}


/* =========================================================
        CREATE RAZORPAY ORDER
========================================================= */

async function createRazorpayOrder(
    amount,
    receipt
) {

    const url =
        ORDER_API +
        "?action=createOrder" +
        "&amount=" +
        encodeURIComponent(
            amount
        ) +
        "&receipt=" +
        encodeURIComponent(
            receipt
        );


    const response =
        await fetch(
            url,
            {
                method: "GET"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Unable to connect to payment server."
        );

    }


    const result =
        await response.json();


    if (
        result.error
    ) {

        throw new Error(
            result.error.description ||
            "Razorpay order creation failed."
        );

    }


    if (
        !result.id
    ) {

        throw new Error(
            result.message ||
            "Razorpay did not return an order ID."
        );

    }


    return result;

}


/* =========================================================
        VERIFY RAZORPAY PAYMENT
========================================================= */

async function verifyRazorpayPayment(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
) {

    const url =
        ORDER_API +
        "?action=verifyPayment" +
        "&razorpay_order_id=" +
        encodeURIComponent(
            razorpayOrderId
        ) +
        "&razorpay_payment_id=" +
        encodeURIComponent(
            razorpayPaymentId
        ) +
        "&razorpay_signature=" +
        encodeURIComponent(
            razorpaySignature
        );


    const response =
        await fetch(
            url,
            {
                method: "GET"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Unable to verify payment."
        );

    }


    const result =
        await response.json();


    return result;

}


/* =========================================================
        SAVE PAID ORDER TO GOOGLE SHEETS
========================================================= */

async function savePaidOrder(
    order
) {

    const formData =
        new URLSearchParams();


    formData.append(
        "name",
        order.name
    );


    formData.append(
        "email",
        order.email
    );


    formData.append(
        "phone",
        order.phone
    );


    formData.append(
        "address",
        order.address
    );


    formData.append(
        "city",
        order.city
    );


    formData.append(
        "state",
        order.state
    );


    formData.append(
        "pin",
        order.pin
    );


    formData.append(
        "total",
        order.total
    );


    formData.append(
        "items",
        JSON.stringify(
            order.items
        )
    );


    formData.append(
        "status",
        "Paid"
    );


    formData.append(
        "razorpayOrderId",
        order.razorpayOrderId
    );


    formData.append(
        "razorpayPaymentId",
        order.razorpayPaymentId
    );


    formData.append(
        "razorpaySignature",
        order.razorpaySignature
    );


    const response =
        await fetch(
            ORDER_API,
            {

                method:
                    "POST",

                body:
                    formData

            }
        );


    if (!response.ok) {

        throw new Error(
            "Unable to save paid order."
        );

    }


    const result =
        await response.json();


    if (
        !result.success
    ) {

        throw new Error(
            result.message ||
            "Order could not be saved."
        );

    }


    return result;

}


/* =========================================================
        SAVE ORDER FOR THANK YOU PAGE
========================================================= */

function saveOrderForThankYouPage(
    order
) {

    try {

        localStorage.setItem(

            LAST_ORDER_STORAGE_KEY,

            JSON.stringify(
                order
            )

        );

        console.log(
            "YUGA: Order saved for thank you page."
        );

    } catch (error) {

        console.error(
            "YUGA: Could not save order for thank you page.",
            error
        );

    }

}


/* =========================================================
        PAYMENT FAILED
========================================================= */

function handlePaymentFailure(
    response
) {

    console.error(
        "YUGA Razorpay payment failed:",
        response
    );


    stopLoading();

    isSubmitting = false;


    let message =
        "Payment was not completed. Your cart is still saved. You can try again.";


    if (
        response &&
        response.error &&
        response.error.description
    ) {

        message +=
            "\n\n" +
            response.error.description;

    }


    alert(
        message
    );

}


/* =========================================================
        PLACE ORDER
========================================================= */

if (placeOrder) {

    placeOrder.addEventListener(
        "click",
        async function () {


            /* =========================================
                    PREVENT DOUBLE CLICK
            ========================================= */

            if (
                isSubmitting
            ) {

                return;

            }


            /* =========================================
                    CHECK RAZORPAY
            ========================================= */

            if (
                !isRazorpayReady()
            ) {

                alert(
                    "Payment system is not ready. Please refresh the page and try again."
                );

                return;

            }


            /* =========================================
                    VALIDATE CUSTOMER
            ========================================= */

            if (
                !validateCustomerDetails()
            ) {

                return;

            }


            /* =========================================
                    GET CUSTOMER
            ========================================= */

            const customer = {

                name:
                    document
                        .getElementById(
                            "customerName"
                        )
                        .value
                        .trim(),

                email:
                    document
                        .getElementById(
                            "customerEmail"
                        )
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById(
                            "customerPhone"
                        )
                        .value
                        .trim(),

                address:
                    document
                        .getElementById(
                            "customerAddress"
                        )
                        .value
                        .trim(),

                city:
                    document
                        .getElementById(
                            "customerCity"
                        )
                        .value
                        .trim(),

                state:
                    document
                        .getElementById(
                            "customerState"
                        )
                        .value
                        .trim(),

                pin:
                    document
                        .getElementById(
                            "customerPin"
                        )
                        .value
                        .trim()

            };


            /* =========================================
                    SAVE CUSTOMER DETAILS
            ========================================= */

            saveCustomerDetails();


            /* =========================================
                    GET CART
            ========================================= */

            const cart =
                getCart();


            if (
                !cart ||
                cart.length === 0
            ) {

                alert(
                    "Your cart is empty."
                );

                window.location.href =
                    "cart.html";

                return;

            }


            /* =========================================
                    CALCULATE TOTAL
            ========================================= */

            const subtotal =
                calculateCartTotal(
                    cart
                );


            if (
                !subtotal ||
                subtotal <= 0
            ) {

                alert(
                    "Invalid order amount."
                );

                return;

            }


            /* =========================================
                    META PIXEL
                    INITIATE CHECKOUT
            ========================================= */

            trackInitiateCheckout(
                cart,
                subtotal
            );


            /* =========================================
                    START PROCESS
            ========================================= */

            isSubmitting =
                true;

            startLoading(
                "Preparing payment..."
            );


            try {


                /* =====================================
                        UNIQUE RECEIPT
                ===================================== */

                const receipt =
                    "YUGA_" +
                    Date.now();


                /* =====================================
                        CREATE RAZORPAY ORDER
                ===================================== */

                updateLoading(
                    "Connecting to Razorpay..."
                );


                const razorpayOrder =
                    await createRazorpayOrder(
                        subtotal,
                        receipt
                    );


                console.log(
                    "YUGA Razorpay Order:",
                    razorpayOrder
                );


                /* =====================================
                        OPEN RAZORPAY CHECKOUT
                ===================================== */

                updateLoading(
                    "Opening secure payment..."
                );


                const options = {

                    key:
                        RAZORPAY_KEY_ID,

                    amount:
                        razorpayOrder.amount,

                    currency:
                        razorpayOrder.currency ||
                        "INR",

                    name:
                        "YUGA WEAR",

                    description:
                        "YUGA — India Reimagined",

                    image:
                        "https://yugawear.com/images/android-chrome-512x512.png",

                    order_id:
                        razorpayOrder.id,


                    /* =================================
                            CUSTOMER PREFILL
                    ================================= */

                    prefill: {

                        name:
                            customer.name,

                        email:
                            customer.email,

                        contact:
                            "+91" +
                            customer.phone

                    },


                    /* =================================
                            THEME
                    ================================= */

                    theme: {

                        color:
                            "#F26A21"

                    },


                    /* =================================
                            SUCCESS HANDLER
                    ================================= */

                    handler:
                        async function (
                            paymentResponse
                        ) {

                            try {


                                /* =========================
                                        VERIFYING PAYMENT
                                ========================= */

                                updateLoading(
                                    "Verifying payment..."
                                );


                                console.log(
                                    "YUGA Razorpay payment response:",
                                    paymentResponse
                                );


                                /* =========================
                                        VERIFY SIGNATURE
                                ========================= */

                                const verification =
                                    await verifyRazorpayPayment(

                                        paymentResponse
                                            .razorpay_order_id,

                                        paymentResponse
                                            .razorpay_payment_id,

                                        paymentResponse
                                            .razorpay_signature

                                    );


                                console.log(
                                    "YUGA Razorpay verification:",
                                    verification
                                );


                                if (
                                    !verification.success ||
                                    !verification.verified
                                ) {

                                    throw new Error(
                                        "Payment verification failed."
                                    );

                                }


                                /* =========================
                                        SAVE PAID ORDER
                                ========================= */

                                updateLoading(
                                    "Confirming your order..."
                                );


                                const savedOrder =
                                    await savePaidOrder({

                                        name:
                                            customer.name,

                                        email:
                                            customer.email,

                                        phone:
                                            customer.phone,

                                        address:
                                            customer.address,

                                        city:
                                            customer.city,

                                        state:
                                            customer.state,

                                        pin:
                                            customer.pin,

                                        items:
                                            cart,

                                        total:
                                            subtotal,

                                        razorpayOrderId:
                                            paymentResponse
                                                .razorpay_order_id,

                                        razorpayPaymentId:
                                            paymentResponse
                                                .razorpay_payment_id,

                                        razorpaySignature:
                                            paymentResponse
                                                .razorpay_signature

                                    });


                                if (
                                    !savedOrder.success
                                ) {

                                    throw new Error(
                                        "Payment succeeded but order could not be saved."
                                    );

                                }


                                /* =========================
                                        YUGA ORDER ID
                                ========================= */

                                const orderId =
                                    savedOrder.orderId;


                                console.log(
                                    "YUGA Order ID:",
                                    orderId
                                );


                                /* =========================
                                        META PIXEL PURCHASE
                                ========================= */

                                trackPurchase(
                                    cart,
                                    subtotal,
                                    orderId
                                );


                                /* =========================
                                        SAVE ORDER FOR
                                        THANK YOU PAGE
                                ========================= */

                                const lastOrder = {

                                    orderId:
                                        orderId,

                                    date:
                                        new Date()
                                            .toISOString(),

                                    total:
                                        subtotal,

                                    customer: {

                                        name:
                                            customer.name,

                                        email:
                                            customer.email,

                                        phone:
                                            customer.phone,

                                        address:
                                            customer.address,

                                        city:
                                            customer.city,

                                        state:
                                            customer.state,

                                        pin:
                                            customer.pin

                                    },

                                    items:
                                        cart,

                                    payment: {

                                        razorpayOrderId:
                                            paymentResponse
                                                .razorpay_order_id,

                                        razorpayPaymentId:
                                            paymentResponse
                                                .razorpay_payment_id,

                                        razorpaySignature:
                                            paymentResponse
                                                .razorpay_signature

                                    }

                                };


                                saveOrderForThankYouPage(
                                    lastOrder
                                );


                                /* =========================
                                        CLEAR CART
                                ========================= */

                                localStorage.removeItem(
                                    CART_STORAGE_KEY
                                );


                                /* =========================
                                        STOP LOADING
                                ========================= */

                                stopLoading();

                                isSubmitting =
                                    false;


                                /* =========================
                                        REDIRECT
                                        THANK YOU PAGE
                                ========================= */

                                window.location.href =
                                    "thankyou.html";


                            } catch (
                                verificationError
                            ) {


                                console.error(
                                    "YUGA payment processing error:",
                                    verificationError
                                );


                                stopLoading();

                                isSubmitting =
                                    false;


                                alert(
                                    "Payment was received, but we could not complete the order confirmation automatically.\n\nPlease contact YUGA support and provide your Razorpay Payment ID:\n\n" +
                                    (
                                        paymentResponse &&
                                        paymentResponse.razorpay_payment_id
                                            ? paymentResponse.razorpay_payment_id
                                            : "Unavailable"
                                    )
                                );

                            }

                        },


                    /* =================================
                            PAYMENT MODAL
                    ================================= */

                    modal: {

                        ondismiss:
                            function () {

                                console.log(
                                    "YUGA: Razorpay checkout closed."
                                );


                                stopLoading();

                                isSubmitting =
                                    false;

                            }

                    },


                    /* =================================
                            PAYMENT NOTES
                    ================================= */

                    notes: {

                        brand:
                            "YUGA WEAR",

                        receipt:
                            receipt

                    }

                };


                /* =====================================
                        CREATE RAZORPAY INSTANCE
                ===================================== */

                const razorpay =
                    new Razorpay(
                        options
                    );


                /* =====================================
                        PAYMENT FAILED EVENT
                ===================================== */

                razorpay.on(
                    "payment.failed",
                    function (
                        response
                    ) {

                        handlePaymentFailure(
                            response
                        );

                    }
                );


                /* =====================================
                        OPEN RAZORPAY CHECKOUT
                ===================================== */

                razorpay.open();


            } catch (error) {


                console.error(
                    "YUGA checkout error:",
                    error
                );


                stopLoading();

                isSubmitting =
                    false;


                alert(
                    error.message ||
                    "Unable to start payment. Please try again."
                );

            }

        }
    );

}


/* =========================================================
        AUTO SAVE CUSTOMER
========================================================= */

[
    "customerName",

    "customerEmail",

    "customerPhone",

    "customerAddress",

    "customerCity",

    "customerState",

    "customerPin"

].forEach(
    id => {

        const input =
            document.getElementById(
                id
            );


        if (input) {

            input.addEventListener(
                "input",
                saveCustomerDetails
            );

        }

    }
);


/* =========================================================
        INITIALIZE CHECKOUT
========================================================= */

renderCheckout();
