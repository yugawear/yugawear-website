/* ==========================================
   YUGA GLOBAL COMPONENT SYSTEM
========================================== */

(async function () {

    console.log("YUGA Components: Starting...");


    /* ==========================================
       COMPONENT LOADER
    ========================================== */

    async function loadComponent(containerId, file) {

        const container =
            document.getElementById(containerId);

        if (!container) {

            console.warn(
                `YUGA: #${containerId} not found`
            );

            return false;

        }

        try {

            const response =
                await fetch(file);

            if (!response.ok) {

                throw new Error(
                    `${response.status} ${response.statusText}`
                );

            }

            const html =
                await response.text();

            container.innerHTML =
                html;

            console.log(
                `YUGA: ${file} loaded`
            );

            return true;

        } catch (error) {

            console.error(
                `YUGA: Failed to load ${file}`,
                error
            );

            return false;

        }

    }


    /* ==========================================
       LOAD NAVBAR
    ========================================== */

    await loadComponent(
        "globalNavbar",
        "/components/navbar.html"
    );


    /* ==========================================
       LOAD MOBILE MENU
    ========================================== */

    try {

        const response =
            await fetch("/components/mobile.html");

        if (!response.ok) {

            throw new Error(
                `${response.status} ${response.statusText}`
            );

        }

        const mobileHTML =
            await response.text();


        /*
            Prevent duplicate mobile menu
        */

        const existingMobileMenu =
            document.querySelector(".mobile-menu");


        if (!existingMobileMenu) {

            document.body.insertAdjacentHTML(
                "beforeend",
                mobileHTML
            );

        }


        console.log(
            "YUGA: /components/mobile.html loaded"
        );


    } catch (error) {

        console.error(
            "YUGA: Failed to load /components/mobile.html",
            error
        );

    }


    /* ==========================================
       LOAD CART
    ========================================== */

    await loadComponent(
        "globalCart",
        "/components/cart.html"
    );


    /* ==========================================
       LOAD FOOTER
    ========================================== */

    await loadComponent(
        "globalFooter",
        "/components/footer.html"
    );


    /* ==========================================
       COMPONENTS READY
    ========================================== */

    console.log(
        "YUGA Components: All components loaded."
    );


    document.dispatchEvent(
        new Event("yugaComponentsLoaded")
    );


    /* ==========================================
       HIDE LOADER
    ========================================== */

    const loader =
        document.getElementById("loader");


    if (loader) {

        loader.classList.add("hide");


        setTimeout(() => {

            loader.style.display =
                "none";

        }, 2000);

    }

})();
