/*====================================*
*CART PAGE*
*====================================*/

const cartPageItems =
document.getElementById("cartPageItems");

const summarySubtotal =
document.getElementById("summarySubtotal");

const summaryTotal =
document.getElementById("summaryTotal");

const summarySavings =
document.getElementById("summarySavings");


// load Cart
function getCart(){

    return JSON.parse(

        localStorage.getItem("yuga-cart")

    ) || [];

}


// Empty Cart
function renderCartPage(){

    const cartData = getCart();

    if(cartData.length===0){

        cartPageItems.innerHTML = `
            <div class="empty-cart-page">

                <i class="fa-solid fa-bag-shopping"></i>

                <h2>Your shopping bag is empty</h2>

                <p>
                    Looks like you haven't added anything yet.
                </p>

                <a href="index.html" class="shop-button">
                    Continue Shopping
                </a>

            </div>
        `;

        summarySubtotal.textContent="₹0";

        summaryTotal.textContent="₹0";

        if(summarySavings){

            summarySavings.textContent="";

        }

        return;

    }


    cartPageItems.innerHTML = cartData
        .map(item=>createCartItem(item))
        .join("");


    /*====================================*
    * SUBTOTAL
    *====================================*/

    const subtotal = cartData.reduce(

        (sum,item)=>sum + item.price * item.quantity,

        0

    );


    /*====================================*
    * ORIGINAL PRICE
    *====================================*/

    const originalTotal = cartData.reduce(

        (sum,item)=>sum + 1699 * item.quantity,

        0

    );


    /*====================================*
    * TOTAL SAVINGS
    *====================================*/

    const totalSaved =
        originalTotal - subtotal;


    /*====================================*
    * UPDATE ORDER SUMMARY
    *====================================*/

    summarySubtotal.textContent =
        "₹" + subtotal.toLocaleString("en-IN");


    summaryTotal.textContent =
        "₹" + subtotal.toLocaleString("en-IN");


    if(summarySavings){

        if(totalSaved > 0){

            summarySavings.textContent =
                "You saved ₹" +
                totalSaved.toLocaleString("en-IN");

        }else{

            summarySavings.textContent = "";

        }

    }

}


renderCartPage();


/*====================================*
* QUANTITY / REMOVE
*====================================*/

cartPageItems.addEventListener("click",(e)=>{


    const plusButton =
        e.target.closest(".qty-plus");


    if(plusButton){

        increaseQuantity(

            plusButton.dataset.id,
            plusButton.dataset.color,
            plusButton.dataset.size

        );

        renderCartPage();

        return;

    }


    const minusButton =
        e.target.closest(".qty-minus");


    if(minusButton){

        decreaseQuantity(

            minusButton.dataset.id,
            minusButton.dataset.color,
            minusButton.dataset.size

        );

        renderCartPage();

        return;

    }


    const removeButton =
        e.target.closest(".remove-item");


    if(removeButton){

        removeCartItem(

            removeButton.dataset.id,
            removeButton.dataset.color,
            removeButton.dataset.size

        );

        renderCartPage();

    }

});


/*====================================*
* CHECKOUT BUTTON
*====================================*/

const checkoutPageBtn =
document.getElementById("checkoutPageBtn");


if(checkoutPageBtn){

    checkoutPageBtn.addEventListener("click",()=>{

        window.location.href = "checkout.html";

    });

}