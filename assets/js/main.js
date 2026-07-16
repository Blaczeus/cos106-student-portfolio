// Mobile navigation
const navMenu = document.querySelector(".nav-menu");
const navMenuButton = document.querySelector(".nav-menu-btn");
const navLinks = document.querySelectorAll(".nav-link");

function closeMobileMenu() {
    if (!navMenu || !navMenuButton) {
        return;
    }

    navMenu.classList.remove("responsive");
    navMenuButton.setAttribute("aria-expanded", "false");
}

if (navMenu && navMenuButton) {
    navMenuButton.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("responsive");
        navMenuButton.setAttribute("aria-expanded", String(isOpen));
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
