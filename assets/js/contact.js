"use strict";

// Contact form validation
(() => {
    const contactForm = document.querySelector("#contact-form");
    const nameInput = document.querySelector("#contact-name");
    const emailInput = document.querySelector("#contact-email");
    const phoneInput = document.querySelector("#contact-phone");
    const subjectInput = document.querySelector("#contact-subject");
    const messageInput = document.querySelector("#contact-message");
    const formMessage = document.querySelector("#contact-form-message");

    if (!contactForm || !nameInput || !emailInput || !phoneInput || !subjectInput || !messageInput || !formMessage) {
        return;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhoneNumber(phoneNumber) {
        return /^\+?\d+$/.test(phoneNumber);
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.classList.toggle("is-error", type === "error");
        formMessage.classList.toggle("is-success", type === "success");
    }

    function setFieldError(field, hasError) {
        field.setAttribute("aria-invalid", String(hasError));
    }

    function clearFieldErrors() {
        [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach((field) => {
            setFieldError(field, false);
        });
    }

    function validateContactForm() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        clearFieldErrors();

        if (!name) {
            return {
                isValid: false,
                field: nameInput,
                message: "Please enter your full name.",
            };
        }

        if (name.length < 3) {
            return {
                isValid: false,
                field: nameInput,
                message: "Full name must be at least 3 characters.",
            };
        }

        if (!email) {
            return {
                isValid: false,
                field: emailInput,
                message: "Please enter your email address.",
            };
        }

        if (!isValidEmail(email)) {
            return {
                isValid: false,
                field: emailInput,
                message: "Please enter a valid email address.",
            };
        }

        if (!phone) {
            return {
                isValid: false,
                field: phoneInput,
                message: "Please enter your phone number.",
            };
        }

        if (!isValidPhoneNumber(phone)) {
            return {
                isValid: false,
                field: phoneInput,
                message: "Phone number must contain digits only, with an optional + at the start.",
            };
        }

        if (!subject) {
            return {
                isValid: false,
                field: subjectInput,
                message: "Please enter a subject.",
            };
        }

        if (subject.length < 3) {
            return {
                isValid: false,
                field: subjectInput,
                message: "Subject must be at least 3 characters.",
            };
        }

        if (!message) {
            return {
                isValid: false,
                field: messageInput,
                message: "Please enter your message.",
            };
        }

        if (message.length < 10) {
            return {
                isValid: false,
                field: messageInput,
                message: "Message must be at least 10 characters.",
            };
        }

        return { isValid: true };
    }

    function handleContactSubmit(event) {
        event.preventDefault();

        const result = validateContactForm();

        if (!result.isValid) {
            setFieldError(result.field, true);
            showFormMessage(result.message, "error");
            result.field.focus();
            return;
        }

        contactForm.reset();
        clearFieldErrors();
        showFormMessage("Your message has been received. Thank you for getting in touch.", "success");
        nameInput.focus();
    }

    // Clear corrected field states
    [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach((field) => {
        field.addEventListener("input", () => {
            setFieldError(field, false);

            if (formMessage.classList.contains("is-success")) {
                showFormMessage("", "");
            }
        });
    });

    contactForm.addEventListener("submit", handleContactSubmit);
})();
