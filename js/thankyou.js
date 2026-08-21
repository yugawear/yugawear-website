/* =====================================================
        YUGA THANK YOU PAGE
===================================================== */


const LAST_ORDER_KEY = "yuga-last-order";


/* =====================================================
        GET ORDER
===================================================== */

const order =
    JSON.parse(
        localStorage.getItem(
            LAST_ORDER_KEY
        )
    );


/* =====================================================
        PROTECTION
===================================================== */

if (!order) {

    window.location.href = "index.html";

}


/* =====================================================
        FORMAT CURRENCY
===================================================== */

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");

}


/* =====================================================
        FORMAT DATE
===================================================== */

function formatDate(dateValue) {

    if (!dateValue) {

        return "—";

    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {

        return dateValue;

    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


/* =====================================================
        RENDER ORDER
===================================================== */

function renderOrder() {

    if (!order) return;


    /* ================================
        ORDER ID
    ================================= */

    document.getElementById(
        "thankyouOrderId"
    ).textContent =
        order.orderId || "—";


    document.getElementById(
        "bottomOrderId"
    ).textContent =
        order.orderId || "—";


    /* ================================
        DATE
    ================================= */

    document.getElementById(
        "orderDate"
    ).textContent =
        formatDate(order.date);


    /* ================================
        TOTAL
    ================================= */

    document.getElementById(
        "orderTotal"
    ).textContent =
        formatCurrency(order.total);


    document.getElementById(
        "detailsTotal"
    ).textContent =
        formatCurrency(order.total);


    /* ================================
        CUSTOMER
    ================================= */

    document.getElementById(
        "customerName"
    ).textContent =
        order.customer?.name || "—";


    document.getElementById(
        "customerPhone"
    ).textContent =
        order.customer?.phone || "—";


    document.getElementById(
        "customerEmail"
    ).textContent =
        order.customer?.email || "—";


    document.getElementById(
        "customerCity"
    ).textContent =
        order.customer?.city || "—";


    document.getElementById(
        "customerState"
    ).textContent =
        order.customer?.state || "—";


    document.getElementById(
        "customerPin"
    ).textContent =
        order.customer?.pin || "—";


    document.getElementById(
        "customerAddress"
    ).textContent =
        order.customer?.address || "—";


    /* ================================
        RAZORPAY
    ================================= */

    document.getElementById(
        "razorpayOrderId"
    ).textContent =
        order.razorpayOrderId || "—";


    document.getElementById(
        "razorpayPaymentId"
    ).textContent =
        order.razorpayPaymentId || "—";


    /* ================================
        PRODUCTS
    ================================= */

    const itemsContainer =
        document.getElementById(
            "thankyouItems"
        );


    if (
        !order.items ||
        !order.items.length
    ) {

        itemsContainer.innerHTML = `
            <p style="color:#777;">
                Order details unavailable.
            </p>
        `;

        return;

    }


    itemsContainer.innerHTML =
        order.items.map(item => {

            const itemTotal =
                Number(item.price || 0) *
                Number(item.quantity || 1);


            return `

                <div class="thankyou-item">

                    <img
                        class="thankyou-item-image"
                        src="${item.image || ""}"
                        alt="${item.name || "YUGA product"}"
                    >

                    <div class="thankyou-item-info">

                        <h3>
                            ${item.name || "YUGA Product"}
                        </h3>

                        <p>

                            ${item.color || ""}

                            •

                            Size:
                            ${item.size || "-"}

                            •

                            Qty:
                            ${item.quantity || 1}

                        </p>

                    </div>

                    <strong class="thankyou-item-price">

                        ${formatCurrency(itemTotal)}

                    </strong>

                </div>

            `;

        }).join("");

}


/* =====================================================
        META PIXEL PURCHASE
===================================================== */

function trackPurchase() {

    if (
        typeof fbq !== "function" ||
        !order
    ) {

        return;

    }


    const trackingKey =
        "yuga-purchase-" +
        order.orderId;


    if (
        localStorage.getItem(
            trackingKey
        )
    ) {

        return;

    }


    fbq(
        "track",
        "Purchase",
        {

            content_ids:
                (order.items || [])
                    .map(item => item.id),

            contents:
                (order.items || [])
                    .map(item => ({

                        id: item.id,

                        quantity:
                            Number(
                                item.quantity || 1
                            )

                    })),

            content_type:
                "product",

            value:
                Number(order.total || 0),

            currency:
                "INR"

        }
    );


    localStorage.setItem(
        trackingKey,
        "true"
    );

}


/* =====================================================
        INITIALIZE
===================================================== */

renderOrder();

trackPurchase();