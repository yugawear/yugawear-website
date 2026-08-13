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
       LOAD GLOBAL COMPONENTS
    ========================================== */

    await loadComponent(
        "globalNavbar",
        "/components/navbar.html"
    );


    await loadComponent(
        "globalCart",
        "/components/cart.html"
    );


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

            loader.style.display = "none";

        }, 2000);

    }

})();