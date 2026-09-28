/* =========================================================
   CATALOG: FILTER + PAGINATION + SHOW MORE + MODAL
   ========================================================= */

const filterButtons = document.querySelectorAll(".filter-button");
const catalogGrid = document.querySelector("#catalog-grid");
const catalogCards = Array.from(document.querySelectorAll(".catalog-card"));
const showMoreButton = document.querySelector("#show-more");
const catalogModal = document.querySelector("#catalog-modal");
const modalDialog = catalogModal?.querySelector(".catalog-modal__dialog");
const modalImage = document.querySelector("#modal-image");
const modalCategory = document.querySelector("#modal-category");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalSelectionValue = document.querySelector("#modal-selection-value");
const modalSelectionMeta = document.querySelector("#modal-selection-meta");
const modalCloseElements = catalogModal?.querySelectorAll("[data-modal-close]");

const formatButtons = document.querySelectorAll("[data-format]");
const editionButtons = document.querySelectorAll("[data-edition]");

let activeCategory = "all";
let currentPage = 1;
let selectedFormat = "STANDARD";
let selectedEdition = "DIGITAL";
let currentModalCard = null;

const modalData = {
    STANDARD: {
        DIGITAL: { meta: "DIGITAL · AVAILABLE" },
        PHYSICAL: { meta: "PHYSICAL · AVAILABLE" }
    },
    LIMITED: {
        DIGITAL: { meta: "LIMITED DIGITAL · AVAILABLE" },
        PHYSICAL: { meta: "LIMITED PHYSICAL · LIMITED" }
    },
    ARCHIVE: {
        DIGITAL: { meta: "ARCHIVE DIGITAL · AVAILABLE" },
        PHYSICAL: { meta: "PHYSICAL · ARCHIVE ONLY" }
    }
};

if (catalogGrid && catalogCards.length) {

    function getCardsPerPage() {
        if (window.innerWidth <= 700) return 1;
        if (window.innerWidth <= 1100) return 2;
        return 4;
    }

    function getFilteredCards() {
        return catalogCards.filter((card) => {
            return (
                activeCategory === "all" ||
                card.dataset.category === activeCategory
            );
        });
    }

    function getTotalPages() {
        const cardsPerPage = getCardsPerPage();
        const filteredCards = getFilteredCards();
        return Math.max(1, Math.ceil(filteredCards.length / cardsPerPage));
    }

    function renderPagination() {
        let pagination = document.querySelector("#catalog-pagination");

        if (!pagination) {
            pagination = document.createElement("nav");
            pagination.id = "catalog-pagination";
            pagination.className = "catalog-pagination";
            pagination.setAttribute("aria-label", "Catalog pages");

            showMoreButton
                ?.closest(".catalog-actions")
                ?.insertAdjacentElement("afterend", pagination);
        }

        pagination.innerHTML = "";
        const totalPages = getTotalPages();

        if (totalPages <= 1) {
            pagination.hidden = true;
            return;
        }

        pagination.hidden = false;

        for (let page = 1; page <= totalPages; page++) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "catalog-page";
            button.textContent = page;
            button.dataset.page = page;
            button.setAttribute("aria-label", `Go to page ${page}`);
            button.setAttribute("aria-current", page === currentPage ? "page" : "false");
            button.classList.toggle("is-active", page === currentPage);

            button.addEventListener("click", () => {
                currentPage = page;
                renderCatalog();
                scrollToCatalog();
            });

            pagination.appendChild(button);
        }
    }

    function renderCatalog() {
        const filteredCards = getFilteredCards();
        const cardsPerPage = getCardsPerPage();
        const totalPages = getTotalPages();

        currentPage = Math.min(currentPage, totalPages);

        const start = (currentPage - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        const visibleCards = filteredCards.slice(start, end);

        catalogCards.forEach((card) => {
            card.hidden = true;
            card.classList.remove("is-visible");
        });

        visibleCards.forEach((card) => {
            card.hidden = false;
            requestAnimationFrame(() => {
                card.classList.add("is-visible");
            });
        });

        filterButtons.forEach((button) => {
            const isActive = button.dataset.filter === activeCategory;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        if (showMoreButton) {
            const hasMore = currentPage < totalPages;
            showMoreButton.classList.toggle("is-hidden", !hasMore);
            showMoreButton.setAttribute("aria-expanded", hasMore ? "false" : "true");
        }

        renderPagination();
    }

    function setCategory(category) {
        activeCategory = category;
        currentPage = 1;
        renderCatalog();
    }

    function scrollToCatalog() {
        const catalogSection = document.querySelector("#catalog");
        if (!catalogSection) return;

        const headerHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue("--header-height")
        ) || 80;

        const top = catalogSection.getBoundingClientRect().top + window.scrollY - headerHeight - 24;

        window.scrollTo({
            top,
            behavior: "smooth"
        });
    }

    function updateModalSelection() {
        if (!modalSelectionValue || !modalSelectionMeta) return;

        modalSelectionValue.textContent = `${selectedFormat} / ${selectedEdition}`;
        modalSelectionMeta.textContent = modalData[selectedFormat][selectedEdition].meta;
    }

    function openModal(card) {
        if (!catalogModal) return;

        currentModalCard = card;

        const image = card.querySelector(".catalog-image img");
        const category = card.dataset.category || "";
        const title = card.querySelector(".catalog-info h2")?.textContent.trim() || "";
        const description = card.querySelector(".catalog-info p")?.textContent.trim() || "";

        if (modalImage && image) {
            modalImage.classList.add("is-changing");
            modalImage.onload = () => {
                modalImage.classList.remove("is-changing");
            };
            modalImage.src = image.src;
            modalImage.alt = image.alt;
        }

        if (modalCategory) {
            modalCategory.textContent = category.toUpperCase();
        }

        if (modalTitle) {
            modalTitle.textContent = title;
        }

        if (modalDescription) {
            modalDescription.textContent = description;
        }

        selectedFormat = "STANDARD";
        selectedEdition = "DIGITAL";

        formatButtons.forEach((button) => {
            button.classList.toggle("is-selected", button.dataset.format === selectedFormat);
        });

        editionButtons.forEach((button) => {
            button.classList.toggle("is-selected", button.dataset.edition === selectedEdition);
        });

        updateModalSelection();

        catalogModal.classList.add("is-open");
        catalogModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        const closeButton = catalogModal.querySelector(".catalog-modal__close");
        closeButton?.focus();
    }

    function closeModal() {
        if (!catalogModal) return;

        catalogModal.classList.remove("is-open");
        catalogModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        currentModalCard = null;
    }

    // Event Listeners

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setCategory(button.dataset.filter);
        });
    });

    if (showMoreButton) {
        showMoreButton.addEventListener("click", () => {
            const totalPages = getTotalPages();
            if (currentPage < totalPages) {
                currentPage += 1;
                renderCatalog();
                scrollToCatalog();
            }
        });
    }

    formatButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedFormat = button.dataset.format;
            formatButtons.forEach((item) => {
                item.classList.toggle("is-selected", item === button);
            });
            updateModalSelection();
        });
    });

    editionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedEdition = button.dataset.edition;
            editionButtons.forEach((item) => {
                item.classList.toggle("is-selected", item === button);
            });
            updateModalSelection();
        });
    });

    catalogCards.forEach((card) => {
        card.addEventListener("click", (event) => {
            if (event.target.closest("a, button, input, select, textarea")) {
                return;
            }
            openModal(card);
        });
    });

    modalCloseElements?.forEach((element) => {
        element.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && catalogModal?.classList.contains("is-open")) {
            closeModal();
        }
    });

    modalDialog?.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const totalPages = getTotalPages();
            currentPage = Math.min(currentPage, totalPages);
            renderCatalog();
        }, 150);
    });

    // Initial State
    setCategory("all");
}