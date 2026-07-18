// Mobile navigation
const navMenu = document.querySelector(".nav-menu");
const navMenuButton = document.querySelector(".nav-menu-btn");
const navLinks = document.querySelectorAll(".nav-link");

function updateMobileMenuButton(isOpen) {
    if (!navMenuButton) {
        return;
    }

    navMenuButton.setAttribute("aria-expanded", String(isOpen));
    navMenuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

function closeMobileMenu() {
    if (!navMenu || !navMenuButton) {
        return;
    }

    navMenu.classList.remove("responsive");
    updateMobileMenuButton(false);
}

if (navMenu && navMenuButton) {
    updateMobileMenuButton(false);

    navMenuButton.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("responsive");
        updateMobileMenuButton(isOpen);
    });

    navLinks.forEach(function (link) {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });
}

// Header scroll state
const siteHeader = document.getElementById("header");

function updateHeaderState() {
    if (!siteHeader) {
        return;
    }

    const isScrolled = window.scrollY > 50;
    siteHeader.classList.toggle("header-scrolled", isScrolled);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState);
