// Where estimate requests are sent. Update this to the business inbox.
const CONTACT_EMAIL = "theo.ksrpainting@gmail.com";

// Business phone, written how it should appear, e.g. "(312) 555-0123".
// Leave empty to hide every call link on the page.
const PHONE_NUMBER = "(###) - ### - ####";

// Footer year + contact email
document.getElementById("year").textContent = new Date().getFullYear();
document.querySelectorAll("[data-contact-email]").forEach((link) => {
  link.href = `mailto:${CONTACT_EMAIL}`;
  link.textContent = CONTACT_EMAIL;
});

// Tap-to-call links stay hidden until a phone number is set
if (PHONE_NUMBER) {
  const tel = `tel:${PHONE_NUMBER.replace(/[^\d+]/g, "")}`;
  document.querySelectorAll("[data-contact-phone]").forEach((link) => {
    link.href = tel;
    link.hidden = false;
  });
  document.querySelectorAll("[data-phone-text]").forEach((el) => (el.textContent = PHONE_NUMBER));
  document.querySelectorAll("[data-phone-item]").forEach((el) => (el.hidden = false));
}

// Mobile nav
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function setNavOpen(open) {
  navToggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
}

navToggle.addEventListener("click", () => {
  setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNavOpen(false)));

// Close the menu with Escape or a tap outside the header
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    setNavOpen(false);
    navToggle.focus();
  }
});
document.addEventListener("click", (e) => {
  if (nav.classList.contains("is-open") && !header.contains(e.target)) setNavOpen(false);
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Service cards: before/after photos appear once both files exist; tap toggles on touch screens
const imageLoaded = (img) =>
  new Promise((resolve, reject) => {
    if (img.complete) return img.naturalWidth ? resolve() : reject();
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", reject, { once: true });
  });

document.querySelectorAll(".service-photo").forEach((photo) => {
  const imgs = [...photo.querySelectorAll("img")];
  Promise.all(imgs.map(imageLoaded)).then(() => (photo.hidden = false), () => {});
  photo.addEventListener("click", () => {
    photo.setAttribute("aria-pressed", String(photo.getAttribute("aria-pressed") !== "true"));
  });
});

// "Get a quote" links preselect the project type in the estimate form
document.querySelectorAll("[data-project]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector('#estimate-form [name="type"]').value = link.dataset.project;
  });
});

// Gallery lightbox
const items = [...document.querySelectorAll(".gallery-item")];
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
let current = 0;

function showPhoto(index) {
  current = (index + items.length) % items.length;
  const img = items[current].querySelector("img");
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = items[current].querySelector("strong").textContent;
}

items.forEach((item, i) => {
  item.addEventListener("click", () => {
    showPhoto(i);
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(current - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(current + 1));

// Close when clicking the dark backdrop, not the photo
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
});

// Estimate form: validates, then opens the visitor's email app with the details filled in.
const form = document.getElementById("estimate-form");
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const { name, phone, email } = form.elements;

  const noName = !name.value.trim();
  const noContact = !phone.value.trim() && !email.value.trim();
  const badEmail = !!email.value.trim() && !email.checkValidity();

  const errors = new Map([
    [name, noName],
    [phone, noContact],
    [email, noContact || badEmail],
  ]);
  errors.forEach((invalid, field) => {
    field.closest(".field").classList.toggle("has-error", invalid);
    field.setAttribute("aria-invalid", String(invalid));
  });

  if (noName || noContact || badEmail) {
    status.textContent = badEmail && !noName
      ? "That email address doesn't look right. Please check it."
      : "Please add your name and a phone number or email.";
    status.className = "form-status is-error";
    [...errors].find(([, invalid]) => invalid)[0].focus();
    return;
  }

  const subject = `Estimate request: ${data.get("type")}`;
  const body = [
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone") || "-"}`,
    `Email: ${data.get("email") || "-"}`,
    `Project type: ${data.get("type")}`,
    `Location: ${data.get("location") || "-"}`,
    "",
    data.get("details") || "",
  ].join("\n");

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = "Your email app should open with your request ready to send.";
  status.className = "form-status is-success";
});
