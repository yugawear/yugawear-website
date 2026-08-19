/*====================================
        PRODUCT PAGE
====================================*/

/*====================================
        GET PRODUCT ID
====================================*/

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

const product = PRODUCTS[productId];


/*====================================
        CHECK PRODUCT
====================================*/

if (!product) {

    console.error("Product not found:", productId);

    window.location.href = "index.html";

}


/*====================================
        DOM ELEMENTS
====================================*/

const mainImage =
    document.getElementById("mainImage");

const thumbnailContainer =
    document.getElementById("thumbnailContainer");

const productCategory =
    document.getElementById("productCategory");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productDescription =
    document.getElementById("productDescription");

const colorOptions =
    document.getElementById("colorOptions");

const addToCart =
    document.getElementById("addToCart");


/*====================================
        PRODUCT INFORMATION
====================================*/

if (product) {

    productCategory.textContent =
        product.collection;

    productName.textContent =
        product.name;

    const originalPrice =
    product.originalPrice || product.price;

const savings =
    originalPrice - product.price;


productPrice.textContent =
    "₹" + product.price.toLocaleString("en-IN");


document.getElementById("productOriginalPrice").textContent =
    "₹" + originalPrice.toLocaleString("en-IN");


document.getElementById("productSave").textContent =
    "SAVE ₹" + savings.toLocaleString("en-IN");

    productDescription.textContent =
        product.description;

    /* Add to Cart data */

    addToCart.dataset.id =
        product.id;

    addToCart.dataset.name =
        product.name;

    addToCart.dataset.price =
        product.price;

    addToCart.dataset.category =
        product.collection;

}


/*====================================
        COLOUR HELPERS
====================================*/

const colorStyles = {

    white: {
        background: "#ffffff",
        name: "Classic White"
    },

    offwhite: {
        background: "#F5F2E8",
        name: "Vintage Off-White"
    },

    black: {
        background: "#111111",
        name: "Classic Black"
    },

    navy: {
        background: "#182A3A",
        name: "Navy Blue"
    }

};


/*====================================
        CURRENT COLOUR
====================================*/

let selectedColor =
    product ? Object.keys(product.colors)[0] : null;


/*====================================
        GALLERY
====================================*/

function loadGallery(color) {

    if (!product || !product.colors[color]) {
        return;
    }

    const colorData =
        product.colors[color];

    thumbnailContainer.innerHTML = "";

    /*
        Get all images defined for this colour.
        This allows each product to have
        different numbers of images.
    */

    const images =
        Object.values(colorData.images || {});


    if (images.length === 0) {

        console.error(
            "No images found for:",
            product.name,
            color
        );

        return;

    }


    images.forEach((image, index) => {

        const img =
            document.createElement("img");

        img.src = image;

        img.alt =
            product.name + " " + colorData.name;

        img.className = "thumb";


        if (index === 0) {

            img.classList.add("active");

            mainImage.src = image;

            mainImage.alt =
                product.name;

        }


        img.addEventListener("click", () => {

            document
                .querySelectorAll(".thumb")
                .forEach(thumb => {

                    thumb.classList.remove("active");

                });

            img.classList.add("active");

            mainImage.src = image;

        });


        thumbnailContainer.appendChild(img);

    });

}


/*====================================
        COLOUR BUTTONS
====================================*/

function renderColors() {

    if (!product) return;

    colorOptions.innerHTML = "";


    const colors =
        Object.entries(product.colors);


    colors.forEach(([colorKey, colorData], index) => {

        const colorInfo =
            colorStyles[colorKey] || {

                background: "#cccccc",

                name: colorKey

            };


        const colorItem =
            document.createElement("div");

        colorItem.className =
            "color-item";


        colorItem.innerHTML = `

            <button
                class="color ${index === 0 ? "active" : ""}"
                data-color="${colorKey}"
                title="${colorInfo.name}">

                <span
                    style="background:${colorInfo.background};">
                </span>

            </button>

            <p>
                ${colorData.name || colorInfo.name}
            </p>

        `;


        const button =
            colorItem.querySelector(".color");


        button.addEventListener("click", () => {

            document
                .querySelectorAll(".color")
                .forEach(btn => {

                    btn.classList.remove("active");

                });


            button.classList.add("active");


            selectedColor =
                colorKey;


            loadGallery(selectedColor);

        });


        colorOptions.appendChild(colorItem);

    });

}


/*====================================
        INITIALIZE PRODUCT
====================================*/

if (product) {

    renderColors();

    loadGallery(selectedColor);

    /*====================================
            META PIXEL — VIEW CONTENT
    ====================================*/

    if (typeof fbq === "function") {

        fbq("track", "ViewContent", {

            content_ids: [product.id],

            content_name: product.name,

            content_type: "product",

            content_category: product.collection,

            value: product.price,

            currency: "INR"

        });

        console.log(
            "YUGA Meta Pixel: ViewContent",
            product.name
        );

    }

}


/*====================================
        QUANTITY
====================================*/

let qty = 1;

const qtyText =
    document.getElementById("qty");


document
    .getElementById("plus")
    .addEventListener("click", () => {

        qty++;

        qtyText.textContent =
            qty;

    });


document
    .getElementById("minus")
    .addEventListener("click", () => {

        if (qty > 1) {

            qty--;

            qtyText.textContent =
                qty;

        }

    });


/*====================================
        SIZE SELECTOR
====================================*/

const sizeButtons =
    document.querySelectorAll(".size-btn");

let selectedSize = "L";


sizeButtons.forEach(button => {

    button.addEventListener("click", () => {

        sizeButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        selectedSize =
            button.textContent.trim();

    });

});

/*====================================
        ACCORDION
====================================*/

const accordionItems =
    document.querySelectorAll(".accordion-item");


accordionItems.forEach(item => {

    const header =
        item.querySelector(".accordion-header");


    header.addEventListener("click", () => {

        if (item.classList.contains("active")) {

            item.classList.remove("active");

        } else {

            accordionItems.forEach(i => {

                i.classList.remove("active");

            });

            item.classList.add("active");

        }

    });

});
