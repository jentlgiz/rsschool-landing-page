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

        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );

        changePortrait(
            "./assets/images/yves-portfolio-light.webp",
            animate
        );

    } else {

        document.documentElement.removeAttribute(
            "data-theme"
        );

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
            document.documentElement.getAttribute(
                "data-theme"
            ) === "light"
                ? "light"
                : "dark";


        const newTheme =
            currentTheme === "light"
                ? "dark"
                : "light";


        applyTheme(newTheme, true);

        localStorage.setItem(
            THEME_KEY,
            newTheme
        );

    });

}

/* ================= BURGER MENU ================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const mainNavLinks = document.querySelectorAll(".main-nav a");

function closeMenu() {
    if (!menuToggle || !mainNav) {
        return;
    }

    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.textContent = "☰";

    document.body.classList.remove("menu-open");
}

function openMenu() {
    if (!menuToggle || !mainNav) {
        return;
    }

    mainNav.classList.add("is-open");
    menuToggle.classList.add("is-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    menuToggle.textContent = "×";

    document.body.classList.add("menu-open");
}

if (menuToggle && mainNav) {

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
        if (mainNav.classList.contains("is-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mainNavLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

/* ================= CATALOG FILTER ================= */

const filterButtons = document.querySelectorAll(".filter-button");
const catalogCards = document.querySelectorAll(".catalog-card");

if (filterButtons.length && catalogCards.length) {

    function filterCatalog(category) {

        filterButtons.forEach((button) => {
            const isActive =
                button.dataset.filter === category;

            button.classList.toggle(
                "is-active",
                isActive
            );
        });


        catalogCards.forEach((card) => {

            const cardCategory =
                card.dataset.category;

            const shouldShow =
                category === "all" ||
                cardCategory === category;

            card.hidden = !shouldShow;

        });
    }


    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.filter;

            filterCatalog(category);

        });

    });


    /* ================= INITIAL STATE ================= */

    filterCatalog("all");

}