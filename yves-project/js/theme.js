/* =========================================================
   YVES — THEME
   ========================================================= */

const themeToggle = document.querySelector(".theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
}


/* ================= THEME TOGGLE ================= */

themeToggle.addEventListener("click", () => {
    const isLightTheme =
        document.documentElement.getAttribute("data-theme") === "light";

    if (isLightTheme) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
});