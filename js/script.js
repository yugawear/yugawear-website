/* ==========================================
        YUGA WEBSITE
        script.js
        GLOBAL / PAGE-SAFE VERSION
========================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ==========================================
            STICKY NAVBAR
    ========================================== */

    const header =
        document.querySelector(".header");


    /*
        Some pages may not have .header
        because the navbar is loaded dynamically.

        Therefore we only attach the scroll
        behavior when the header exists.
    */

    if (header) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 80) {

                header.style.background =
                    "rgba(10,10,10,.94)";

                header.style.backdropFilter =
                    "blur(10px)";

                header.style.padding =
                    "16px 0";

                header.style.boxShadow =
                    "0 8px 30px rgba(0,0,0,.25)";

            } else {

                header.style.background =
                    "transparent";

                header.style.backdropFilter =
                    "none";

                header.style.padding =
                    "25px 0";

                header.style.boxShadow =
                    "none";

            }

        });

    }


    /* ==========================================
            SCROLL REVEAL
    ========================================== */

    const reveals =
        document.querySelectorAll(
            ".feature," +
            ".collection-card," +
            ".story-left," +
            ".story-right," +
            ".product-card," +
            ".why-card," +
            ".instagram-grid img," +
            "footer"
        );


    /*
        IntersectionObserver is supported by
        modern browsers, including Chrome/Safari.
    */

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "active"
                            );

                        }

                    });

                },

                {
                    threshold: 0.15
                }

            );


        reveals.forEach(el => {

            el.classList.add("reveal");

            observer.observe(el);

        });

    } else {

        /*
            Fallback for older browsers.
        */

        reveals.forEach(el => {

            el.classList.add("reveal");
            el.classList.add("active");

        });

    }


    /* ==========================================
            HERO PARALLAX
    ========================================== */

    const heroImage =
        document.querySelector(
            ".hero-right img"
        );


    /*
        No error if hero image doesn't exist.
    */

    if (heroImage) {

        window.addEventListener(
            "mousemove",
            (e) => {

                const x =
                    (
                        window.innerWidth / 2 -
                        e.clientX
                    ) / 45;

                const y =
                    (
                        window.innerHeight / 2 -
                        e.clientY
                    ) / 45;


                heroImage.style.transform =
                    `translate(${x}px, ${y}px)`;

            }
        );

    }


    /* ==========================================
            BUTTON HOVER
    ========================================== */

    const buttons =
        document.querySelectorAll(".btn");


    buttons.forEach(button => {

        button.addEventListener(
            "mouseenter",
            () => {

                button.style.transform =
                    "translateY(-4px)";

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.style.transform =
                    "translateY(0)";

            }
        );

    });


    /* ==========================================
            COLLECTION HOVER
    ========================================== */

    const collectionCards =
        document.querySelectorAll(
            ".collection-card"
        );


    collectionCards.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.boxShadow =
                    "0 30px 70px rgba(0,0,0,.25)";

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.boxShadow =
                    "none";

            }
        );

    });


    /* ==========================================
            PRODUCT IMAGE SWITCH
    ========================================== */

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    productCards.forEach(card => {

        const front =
            card.querySelector(
                ".product-front"
            );

        const back =
            card.querySelector(
                ".product-back"
            );


        /*
            Some product cards may not have
            both images.
        */

        if (!front || !back) {

            return;

        }


        let timer = null;

        let frontVisible = true;


        /* ==============================
                MOUSE ENTER
        ============================== */

        card.addEventListener(
            "mouseenter",
            () => {

                /*
                    Clear any previous timer
                    before creating a new one.
                */

                if (timer) {

                    clearInterval(timer);

                }


                front.style.opacity = "1";

                back.style.opacity = "0";

                frontVisible = true;


                timer = setInterval(
                    () => {

                        frontVisible =
                            !frontVisible;


                        if (frontVisible) {

                            front.style.opacity =
                                "1";

                            back.style.opacity =
                                "0";

                        } else {

                            front.style.opacity =
                                "0";

                            back.style.opacity =
                                "1";

                        }

                    },
                    3000
                );

            }
        );


        /* ==============================
                MOUSE LEAVE
        ============================== */

        card.addEventListener(
            "mouseleave",
            () => {

                if (timer) {

                    clearInterval(timer);

                    timer = null;

                }


                front.style.opacity =
                    "0";

                back.style.opacity =
                    "1";

            }
        );

    });


    /* ==========================================
            SMOOTH SCROLL
    ========================================== */

    const smoothLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    smoothLinks.forEach(anchor => {

        anchor.addEventListener(
            "click",
            function (e) {

                const href =
                    this.getAttribute("href");


                /*
                    Ignore empty "#"
                */

                if (
                    !href ||
                    href === "#"
                ) {

                    return;

                }


                let target = null;


                try {

                    target =
                        document.querySelector(
                            href
                        );

                } catch (error) {

                    /*
                        Invalid selector.
                        Do nothing.
                    */

                    return;

                }


                if (target) {

                    e.preventDefault();


                    target.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }

            }
        );

    });


    /* ==========================================
            LOADER
    ========================================== */

    /*
        The loader may not exist on checkout
        or other pages.

        Therefore we check first.
    */

    const loader =
        document.getElementById(
            "loader"
        );


    if (loader) {

        /*
            Hide after page has loaded.
        */

        const hideLoader = () => {

            setTimeout(
                () => {

                    if (loader) {

                        loader.classList.add(
                            "hide"
                        );

                    }

                },
                1200
            );

        };


        /*
            If the page is already loaded,
            hide immediately with delay.
        */

        if (
            document.readyState ===
            "complete"
        ) {

            hideLoader();

        } else {

            window.addEventListener(
                "load",
                hideLoader,
                {
                    once: true
                }
            );

        }

    }


    /* ==========================================
            MOBILE MENU
    ========================================== */

    const menuToggle =
        document.querySelector(
            ".menu-toggle"
        );


    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );


    const closeMenu =
        document.querySelector(
            ".close-menu"
        );


    /*
        IMPORTANT:

        The old code assumed all three
        elements existed.

        Checkout pages may not contain them.

        We only attach events when the
        required elements exist.
    */


    /* ==========================================
            OPEN MOBILE MENU
    ========================================== */

    if (
        menuToggle &&
        mobileMenu
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                mobileMenu.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";

            }
        );

    }


    /* ==========================================
            CLOSE MOBILE MENU
    ========================================== */

    if (
        closeMenu &&
        mobileMenu
    ) {

        closeMenu.addEventListener(
            "click",
            () => {

                mobileMenu.classList.remove(
                    "active"
                );

                document.body.style.overflow =
                    "";

            }
        );

    }


    /* ==========================================
            MOBILE MENU LINKS
    ========================================== */

    if (mobileMenu) {

        const mobileLinks =
            mobileMenu.querySelectorAll(
                "a"
            );


        mobileLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileMenu.classList.remove(
                        "active"
                    );

                    document.body.style.overflow =
                        "";

                }
            );

        });

    }


    /* ==========================================
            ESCAPE KEY
            CLOSE MOBILE MENU
    ========================================== */

    if (mobileMenu) {

        document.addEventListener(
            "keydown",
            (e) => {

                if (
                    e.key === "Escape" &&
                    mobileMenu.classList.contains(
                        "active"
                    )
                ) {

                    mobileMenu.classList.remove(
                        "active"
                    );

                    document.body.style.overflow =
                        "";

                }

            }
        );

    }


    /* ==========================================
            YUGA SCRIPT INITIALIZED
    ========================================== */

    console.log(
        "YUGA: script.js initialized successfully."
    );

});