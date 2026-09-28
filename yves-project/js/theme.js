const themeToggle = document.querySelector(".theme-toggle");
const artistPortrait = document.querySelector("#artist-portrait");

const THEME_KEY = "theme";


/* ================= PORTRAIT ================= */

function changePortrait(src, animate = true) {
    if (!artistPortrait) {
        return;
    }

    if (!animate) {
        artistPortrait.src = src;
        return;
    }

    artistPortrait.classList.add("is-changing");

    setTimeout(() => {
        artistPortrait.src = src;

        artistPortrait.onload = () => {
            artistPortrait.classList.remove("is-changing");
        };
    }, 300);
}


/* ================= THEME ================= */

function applyTheme(theme, animate = true) {
    if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");

        changePortrait(
            "./assets/images/yves-portfolio-light.webp",
            animate
        );
    } else {
        document.documentElement.removeAttribute("data-theme");

        changePortrait(
            "./assets/images/yves-portfolio.jpg",
            animate
        );
    }
}


/* ================= INITIAL THEME ================= */

const savedTheme = localStorage.getItem(THEME_KEY);

applyTheme(
    savedTheme === "light" ? "light" : "dark",
    false
);


/* ================= THEME TOGGLE ================= */

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") === "light"
                ? "light"
                : "dark";

        const newTheme =
            currentTheme === "light"
                ? "dark"
                : "light";

        applyTheme(newTheme, true);

        localStorage.setItem(THEME_KEY, newTheme);
    });
}


/* ================= MOBILE MENU ================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const mainNavLinks = document.querySelectorAll(".main-nav a");

let savedScrollPosition = 0;
let menuIsOpen = false;


function openMenu() {
    if (!menuToggle || !mainNav || menuIsOpen) {
        return;
    }

    savedScrollPosition = window.scrollY;
    menuIsOpen = true;

    mainNav.classList.add("is-open");
    menuToggle.classList.add("is-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

    document.body.classList.add("menu-open");

    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollPosition}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
}


function closeMenu() {
    if (!menuToggle || !mainNav || !menuIsOpen) {
        return;
    }

    menuIsOpen = false;

    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    document.body.classList.remove("menu-open");

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    window.scrollTo(0, savedScrollPosition);
}


if (menuToggle && mainNav) {

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


    window.addEventListener("resize", () => {
        if (window.innerWidth >= 769 && menuIsOpen) {
            closeMenu();
        }
    });
}