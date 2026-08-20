/*====================================
        CHECKOUT
====================================*/

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutSubtotal =
    document.getElementById("checkoutSubtotal");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const placeOrder =
    document.getElementById("placeOrder");

const CUSTOMER_STORAGE_KEY = "yuga-customer";

let isSubmitting = false;


/*====================================
        BUTTON LOADING
====================================*/

function startLoading(){

    placeOrder.disabled = true;

    placeOrder.dataset.originalText =
        placeOrder.innerHTML;

    placeOrder.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Sending...
    `;

}


function stopLoading(){

    placeOrder.disabled = false;

    placeOrder.innerHTML =
        placeOrder.dataset.originalText;

}


/*====================================
        WHATSAPP
====================================*/

const WHATSAPP_NUMBER =
    "917306520432";


/*====================================
        GOOGLE SHEETS API
====================================*/

const ORDER_API =
"https://script.google.com/macros/s/AKfycbyNqAAjJYJJDJaq9cJbEMLu9XXtFN3L1nOcABflNuwFIVs325PQoinQTFpdnQcxmPgN/exec";


/*====================================
        GET CART
====================================*/

function getCart(){

    return JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY)
    ) || [];

}


/*====================================
        CUSTOMER DETAILS
====================================*/

function saveCustomerDetails(){

    const customer = {

        name:
            document.getElementById(
                "customerName"
            ).value,

        email:
            document.getElementById(
                "customerEmail"
            ).value,

        phone:
            document.getElementById(
                "customerPhone"
            ).value,

        address:
            document.getElementById(
                "customerAddress"
            ).value,

        city:
            document.getElementById(
                "customerCity"
            ).value,

        state:
            document.getElementById(
                "customerState"
            ).value,

        pin:
            document.getElementById(
                "customerPin"
            ).value

    };


    localStorage.setItem(

        CUSTOMER_STORAGE_KEY,

        JSON.stringify(customer)

    );

}


function loadCustomerDetails(){

    const customer =
        JSON.parse(
            localStorage.getItem(
                CUSTOMER_STORAGE_KEY
            )
        );


    if(!customer) return;


    document.getElementById("customerName").value =
        customer.name || "";

    document.getElementById("customerEmail").value =
        customer.email || "";

    document.getElementById("customerPhone").value =
        customer.phone || "";

    document.getElementById("customerAddress").value =
        customer.address || "";

    document.getElementById("customerCity").value =
        customer.city || "";

    document.getElementById("customerState").value =
        customer.state || "";

    document.getElementById("customerPin").value =
        customer.pin || "";

}


/*====================================
        SAVE ORDER
====================================*/

async function saveOrder(order){

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
        JSON.stringify(order.items)
    );


    const response =
        await fetch(
            ORDER_API,
            {
                method: "POST",
                body: formData
            }
        );


    return await response.json();

}


/*====================================
        RENDER CHECKOUT
====================================*/

function renderCheckout(){

    const cart =
        getCart();


    if(cart.length === 0){

        window.location.href =
            "cart.html";

        return;

    }


    checkoutItems.innerHTML =
        cart.map(item => `

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
                        item.price *
                        item.quantity
                    ).toLocaleString("en-IN")}

                </strong>

            </div>

        `).join("");


    const subtotal =
        cart.reduce(

            (sum, item) =>

                sum +
                (
                    item.price *
                    item.quantity
                ),

            0

        );


    checkoutSubtotal.textContent =
        "₹" +
        subtotal.toLocaleString(
            "en-IN"
        );


    checkoutTotal.textContent =
        "₹" +
        subtotal.toLocaleString(
            "en-IN"
        );


    loadCustomerDetails();

}


renderCheckout();


/*====================================
        VALIDATION ERRORS
====================================*/

function showError(
    inputId,
    errorId
){

    document
        .getElementById(inputId)
        .classList.add("error");


    document
        .getElementById(errorId)
        .classList.add("show");

}


function hideErrors(){

    document
        .querySelectorAll(".error")
        .forEach(
            el =>
                el.classList.remove(
                    "error"
                )
        );


    document
        .querySelectorAll(".error-message")
        .forEach(
            el =>
                el.classList.remove(
                    "show"
                )
        );

}


/*====================================
        META PIXEL
        INITIATE CHECKOUT
====================================*/

function trackInitiateCheckout(
    cart,
    subtotal
){

    if(
        typeof fbq !== "function"
    ){

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
        cart.map(item => ({

            id: item.id,

            quantity:
                Number(
                    item.quantity
                ),

            item_price:
                Number(
                    item.price
                )

        }));


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


/*====================================
        PLACE ORDER
====================================*/

placeOrder.addEventListener(
    "click",
    async () => {


        /*================================
            PREVENT DOUBLE CLICK
        =================================*/

        if(isSubmitting){

            return;

        }


        /*================================
            CUSTOMER DETAILS
        =================================*/

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


        /*================================
            VALIDATION
        =================================*/

        hideErrors();


        let valid = true;


        if(!name){

            showError(
                "customerName",
                "nameError"
            );

            valid = false;

        }


        if(!phone){

            showError(
                "customerPhone",
                "phoneError"
            );

            valid = false;

        }


        if(!address){

            showError(
                "customerAddress",
                "addressError"
            );

            valid = false;

        }


        if(!city){

            showError(
                "customerCity",
                "cityError"
            );

            valid = false;

        }


        if(!state){

            showError(
                "customerState",
                "stateError"
            );

            valid = false;

        }


        if(!pin){

            showError(
                "customerPin",
                "pinError"
            );

            valid = false;

        }


        /*
         * IMPORTANT:
         * Do not lock the button if
         * validation fails.
         */

        if(!valid){

            return;

        }


        /*================================
            GET CART
        =================================*/

        const cart =
            getCart();


        if(cart.length === 0){

            alert(
                "Your cart is empty."
            );

            window.location.href =
                "cart.html";

            return;

        }


        /*================================
            CALCULATE TOTAL
        =================================*/

        let subtotal = 0;

        let orderText = "";


        cart.forEach(
            (item, index) => {


                const total =
                    item.price *
                    item.quantity;


                subtotal +=
                    total;


                orderText +=

`${index + 1}.

${item.name}

${item.color}

Size: ${item.size}

Qty: ${item.quantity}

₹${total.toLocaleString("en-IN")}


`;

            }
        );


        /*================================
            META PIXEL
            INITIATE CHECKOUT
        =================================*/

        trackInitiateCheckout(
            cart,
            subtotal
        );


        /*================================
            WHATSAPP MESSAGE
        =================================*/

        const message =

`Hello YUGA,

I would like to place an order.

━━━━━━━━━━━━━━

CUSTOMER DETAILS

Name:
${name}

Phone:
${phone}

Email:
${email || "-"}

Address:
${address}

${city}

${state}

${pin}

━━━━━━━━━━━━━━

ORDER

${orderText}

━━━━━━━━━━━━━━

Subtotal:
₹${subtotal.toLocaleString("en-IN")}

Shipping:
FREE

Total:
₹${subtotal.toLocaleString("en-IN")}

Thank you ❤️`;


        /*================================
            START SUBMISSION
        =================================*/

        isSubmitting = true;

        startLoading();


        try{


            /*============================
                SAVE ORDER
            ============================*/

            const order = {

                name,

                email,

                phone,

                address,

                city,

                state,

                pin,

                items: cart,

                total: subtotal

            };


            const result =
                await saveOrder(
                    order
                );


            const orderId =
                result.orderId;


                /*================================
    META PIXEL - CONTACT
=================================*/

if (typeof fbq === "function") {

    fbq(
        "track",
        "Contact",
        {
            content_ids: cart.map(item => item.id),

            contents: cart.map(item => ({
                id: item.id,
                quantity: Number(item.quantity)
            })),

            content_type: "product",

            value: Number(subtotal),

            currency: "INR"
        }
    );

}


            /*============================
                FINAL WHATSAPP MESSAGE
            ============================*/

            const finalMessage =

`Order ID: ${orderId}

${message}`;


            const finalURL =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(finalMessage)}`;


            /*============================
                OPEN WHATSAPP
            ============================*/

            setTimeout(
                () => {

                    window.open(
                        finalURL,
                        "_blank"
                    );


                    /*
                     * Remove cart after
                     * successful order submission.
                     */

                    localStorage.removeItem(
                        CART_STORAGE_KEY
                    );


                    stopLoading();

                    isSubmitting = false;

                },

                700

            );


        }

        catch(error){

            console.error(
                "YUGA checkout error:",
                error
            );


            stopLoading();

            isSubmitting = false;


            alert(
                "Unable to place order. Please try again."
            );

        }

    }
);


/*====================================
        AUTO SAVE CUSTOMER
====================================*/

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

        document
            .getElementById(id)
            .addEventListener(
                "input",
                saveCustomerDetails
            );

    }
);
