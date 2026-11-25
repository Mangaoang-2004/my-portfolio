/* =========================================================
   DEV-THEMED PORTFOLIO SCRIPT - John Paul Mangaoang
   Vanilla JavaScript only. No libraries.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. TERMINAL "TYPING" EFFECT ---------- */
  // Reveals each terminal line one after another.
  // Change DELAY to speed it up or slow it down (milliseconds).
  const DELAY = 420;
  const lines = document.querySelectorAll("#terminal .t-line");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  lines.forEach((line, i) => {
    if (reduceMotion) line.classList.add("show"); // no animation for users who opt out
    else setTimeout(() => line.classList.add("show"), 300 + i * DELAY);
  });

  /* ---------- 2. MOBILE MENU ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open)); // tells screen readers the state
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu after choosing a link
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // Close with Escape and return focus to the button
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- 3. HIGHLIGHT THE CURRENT SECTION IN THE NAV ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const current = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", current);
          if (current) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    // A section counts as "current" when it crosses the middle of the screen
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => observer.observe(section));

  /* ---------- 4. CONTACT FORM (front-end validation only) ---------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const inputs = form.querySelectorAll("input, textarea");

  // Checks one field, shows or clears its error message
  function validateField(input) {
    const field = input.closest(".field");
    const error = field.querySelector(".error");
    let message = "";

    if (!input.value.trim()) {
      message = "Please fill in this field.";
    } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      message = "Please enter a valid email address.";
    }

    error.textContent = message;
    field.classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  inputs.forEach((input) => input.addEventListener("blur", () => validateField(input)));

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stops the page from reloading
    status.textContent = "";

    let firstInvalid = null;
    inputs.forEach((input) => {
      if (!validateField(input) && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus(); // moves keyboard focus to the first problem
      return;
    }

    /* TODO: To receive real messages, connect a free form service
       (for example Formspree or Netlify Forms) or a Flask backend.
       Until then, this only shows a confirmation on the page. */
    status.textContent = "Thanks! Message ready. (Demo only: connect a form service to receive it.)";
    form.reset();
  });

  /* ---------- 5. FOOTER YEAR ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});