/* ==========================================
        YUGA WEBSITE
        script.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
            STICKY NAVBAR
    =============================== */

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if(window.scrollY > 80){

            header.style.background = "rgba(10,10,10,.94)";
            header.style.backdropFilter = "blur(10px)";
            header.style.padding = "16px 0";
            header.style.boxShadow = "0 8px 30px rgba(0,0,0,.25)";

        }else{

            header.style.background = "transparent";
            header.style.backdropFilter = "none";
            header.style.padding = "25px 0";
            header.style.boxShadow = "none";

        }

    });


    /* ===============================
            SCROLL REVEAL
    =============================== */

    const reveals = document.querySelectorAll(
        ".feature,.collection-card,.story-left,.story-right,.product-card,.why-card,.instagram-grid img,footer"
    );

    const observer = new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    entry.target.classList.add("active");

                }

            });

        },

        {

            threshold:.15

        }

    );

    reveals.forEach(el=>{

        el.classList.add("reveal");

        observer.observe(el);

    });


    /* ===============================
            HERO PARALLAX
    =============================== */

    const heroImage = document.querySelector(".hero-right img");

    window.addEventListener("mousemove",(e)=>{

        if(!heroImage) return;

        const x = (window.innerWidth/2 - e.clientX)/45;

        const y = (window.innerHeight/2 - e.clientY)/45;

        heroImage.style.transform =
            `translate(${x}px,${y}px)`;

    });


    /* ===============================
            BUTTON RIPPLE
    =============================== */

    document.querySelectorAll(".btn").forEach(button=>{

        button.addEventListener("mouseenter",()=>{

            button.style.transform="translateY(-4px)";

        });

        button.addEventListener("mouseleave",()=>{

            button.style.transform="translateY(0)";

        });

    });


    /* ===============================
            COLLECTION HOVER
    =============================== */

    document.querySelectorAll(".collection-card")
    .forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            card.style.boxShadow =
                "0 30px 70px rgba(0,0,0,.25)";

        });

        card.addEventListener("mouseleave",()=>{

            card.style.boxShadow =
                "none";

        });

    });


    /* ===============================
            PRODUCT HOVER
    =============================== */

    // document.querySelectorAll(".product-card")
    // .forEach(card=>{

    //     card.addEventListener("mouseenter",()=>{

    //         card.style.transform =
    //             "translateY(-10px)";

    //     });

    //     card.addEventListener("mouseleave",()=>{

    //         card.style.transform =
    //             "translateY(0)";

    //     });

    // });


    /* ===============================
        PRODUCT IMAGE SWITCH
=============================== */

document.querySelectorAll(".product-card").forEach(card=>{

    const front = card.querySelector(".product-front");
    const back = card.querySelector(".product-back");

    if(!front || !back) return;

    let timer;
    let frontVisible=true;

    card.addEventListener("mouseenter",()=>{

        front.style.opacity="1";
        back.style.opacity="0";

        frontVisible=true;

        timer=setInterval(()=>{

            frontVisible=!frontVisible;

            if(frontVisible){

                front.style.opacity="1";
                back.style.opacity="0";

            }else{

                front.style.opacity="0";
                back.style.opacity="1";

            }

        },3000);

    });

    card.addEventListener("mouseleave",()=>{

        clearInterval(timer);

        front.style.opacity="0";
        back.style.opacity="1";

    });

});



    /* ===============================
            SMOOTH SCROLL
    =============================== */

    document.querySelectorAll('a[href^="#"]')
    .forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            const target=document.querySelector(
                this.getAttribute("href")
            );

            if(target){

                e.preventDefault();

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });


    /* ===============================
        LOADER
=============================== */

    window.addEventListener("load", () => {

        const loader = document.getElementById("loader");

        setTimeout(() => {

            loader.classList.add("hide");

        }, 1200);

    });
    



/*==============================
    MOBILE MENU
==============================*/
    const menuToggle = document.querySelector(".menu-toggle");

const mobileMenu = document.querySelector(".mobile-menu");

const closeMenu = document.querySelector(".close-menu");

menuToggle.addEventListener("click", () => {

    mobileMenu.classList.add("active");

    document.body.style.overflow = "hidden";

});

closeMenu.addEventListener("click", () => {

    mobileMenu.classList.remove("active");

    document.body.style.overflow = "";

});

document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

        document.body.style.overflow = "";

    });

});


});
