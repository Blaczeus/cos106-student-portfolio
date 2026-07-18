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

// Page entrance and scroll reveal animations
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function revealElement(element) {
    element.classList.add("is-visible");
    element.style.transitionDelay = "";
}

function setupScrollReveal() {
    if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
        return;
    }

    const revealGroups = [
        { selector: ".about-intro, .projects-intro, .planner-intro, .contact-intro", direction: "top" },
        { selector: ".timeline, .contact-details", direction: "left" },
        { selector: ".table-wrap, .skills-marquee, .hobbies-list, .task-section, .contact-options, .site-footer", direction: "bottom" },
        { selector: ".project-showcase .project-row:nth-child(odd), .planner-panel", direction: "left" },
        { selector: ".project-showcase .project-row:nth-child(even), .contact-form", direction: "right" },
    ];

    const revealItems = [];

    revealGroups.forEach(function (group) {
        document.querySelectorAll(group.selector).forEach(function (item) {
            item.classList.add("reveal-item", `reveal-from-${group.direction}`);
            revealItems.push(item);
        });
    });

    if (!revealItems.length) {
        return;
    }

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }

            revealElement(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.22,
        rootMargin: "0px 0px -4% 0px",
    });

    revealItems.forEach(function (item, index) {
        item.style.transitionDelay = `${Math.min((index % 4) * 130, 390)}ms`;
        revealObserver.observe(item);
    });
}

setupScrollReveal();
