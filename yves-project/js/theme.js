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