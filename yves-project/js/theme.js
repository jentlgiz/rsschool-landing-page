/* =========================================================
   CORE SITE SCRIPT: THEME TOGGLE & MOBILE NAVIGATION
   ========================================================= */

// DOM Selectors
const themeToggle = document.querySelector(".theme-toggle");
const artistPortrait = document.querySelector("#artist-portrait");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const mainNavLinks = document.querySelectorAll(".main-nav a");

// Constants & State
const THEME_KEY = "theme";
const LIGHT_PORTRAIT_SRC = "./assets/images/yves-portfolio-light.webp";
const DARK_PORTRAIT_SRC = "./assets/images/yves-portfolio.jpg";

let savedScrollPosition = 0;
let menuIsOpen = false;

/* =========================================================
   PORTRAIT & THEME MANAGEMENT
   ========================================================= */

function changePortrait(src, animate = true) {
    if (!artistPortrait) return;

    if (!animate) {
        artistPortrait.src = src;
        return;
    }

    artistPortrait.classList.add("is-changing");

    setTimeout(() => {
        artistPortrait.src = src;

        // Reset state once image finishes loading or if cached
        const handleImageLoad = () => {
            artistPortrait.classList.remove("is-changing");
            artistPortrait.removeEventListener("load", handleImageLoad);
        };

        if (artistPortrait.complete) {
            handleImageLoad();
        } else {
            artistPortrait.addEventListener("load", handleImageLoad);
        }
    }, 300);
}

function applyTheme(theme, animate = true) {
    const isLight = theme === "light";

    if (isLight) {
        document.documentElement.setAttribute("data-theme", "light");
        changePortrait(LIGHT_PORTRAIT_SRC, animate);
    } else {
        document.documentElement.removeAttribute("data-theme");
        changePortrait(DARK_PORTRAIT_SRC, animate);
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    applyTheme(initialTheme, false);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme") === "light"
                    ? "light"
                    : "dark";

            const newTheme = currentTheme === "light" ? "dark" : "light";

            applyTheme(newTheme, true);
            localStorage.setItem(THEME_KEY, newTheme);
        });
    }
}

/* =========================================================
   MOBILE MENU NAVIGATION
   ========================================================= */

function openMenu() {
    if (!menuToggle || !mainNav || menuIsOpen) return;

    savedScrollPosition = window.scrollY;
    menuIsOpen = true;

    mainNav.classList.add("is-open");
    menuToggle.classList.add("is-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    document.body.classList.add("menu-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollPosition}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
}

function closeMenu() {
    if (!menuToggle || !mainNav || !menuIsOpen) return;

    menuIsOpen = false;

    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    document.body.classList.remove("menu-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    window.scrollTo(0, savedScrollPosition);
}

function initMobileMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", () => {
        if (menuIsOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mainNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuIsOpen) {
            closeMenu();
        }
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 769 && menuIsOpen) {
                closeMenu();
            }
        }, 150);
    });
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

initTheme();
initMobileMenu();