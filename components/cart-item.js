/*====================================*
 * CART ITEM COMPONENT
 *====================================*/

function formatPrice(price) {

    return "₹" + Number(price).toLocaleString("en-IN");

}


function createCartItem(item) {

    const sellingPrice = Number(item.price);

    const originalPrice = Number(
        item.originalPrice || 1699
    );

    const saving = originalPrice - sellingPrice;

    const quantity = Number(item.quantity) || 1;


    return `

<div
    class="cart-item"
    data-id="${item.id}">


    <!-- PRODUCT IMAGE -->

    <div class="cart-item-image">

        <img
            src="${item.image}"
            alt="${item.name}">

    </div>


    <!-- PRODUCT DETAILS -->

    <div class="cart-item-details">

        <h3>
            ${item.name}
        </h3>


        <p class="cart-item-variant">

            ${item.color} • ${item.size}

        </p>


        <div class="cart-item-bottom">


            <!-- QUANTITY -->

            <div class="cart-qty">

                <button
                    class="qty-minus"
                    data-id="${item.id}"
                    data-color="${item.color}"
                    data-size="${item.size}">

                    −

                </button>


                <span>
                    ${quantity}
                </span>


                <button
                    class="qty-plus"
                    data-id="${item.id}"
                    data-color="${item.color}"
                    data-size="${item.size}">

                    +

                </button>

            </div>


            <!-- PRICE -->

            <div class="cart-price">


                <!-- CURRENT PRICE -->

                <strong class="cart-selling-price">

                    ${formatPrice(sellingPrice)}

                </strong>


                <!-- ORIGINAL + SAVING -->

                <div class="cart-price-offer">

                    <span class="cart-original-price">

                        ${formatPrice(originalPrice)}

                    </span>


                    <span class="cart-saving">

                        SAVE ${formatPrice(saving)}

                    </span>

                </div>


            </div>


        </div>


        <!-- REMOVE -->

        <button
            class="remove-item"
            data-id="${item.id}"
            data-color="${item.color}"
            data-size="${item.size}">

            <i class="fa-solid fa-trash"></i>

            Remove

        </button>


    </div>

</div>

`;

}