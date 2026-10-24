// Where estimate requests are sent. Update this to the business inbox.
const CONTACT_EMAIL = "info@ksrpainting.com";

// Footer year + contact email
document.getElementById("year").textContent = new Date().getFullYear();
document.querySelectorAll("[data-contact-email]").forEach((link) => {
  link.href = `mailto:${CONTACT_EMAIL}`;
  link.textContent = CONTACT_EMAIL;
});

// Header shadow on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile nav
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
  let valid = true;

  ["name", "contact"].forEach((name) => {
    const field = form.elements[name];
    const empty = !field.value.trim();
    field.closest(".field").classList.toggle("has-error", empty);
    if (empty) valid = false;
  });

  if (!valid) {
    status.textContent = "Please add your name and a way to reach you.";
    status.className = "form-status is-error";
    return;
  }

  const subject = `Estimate request: ${data.get("type")}`;
  const body = [
    `Name: ${data.get("name")}`,
    `Contact: ${data.get("contact")}`,
    `Project type: ${data.get("type")}`,
    `Location: ${data.get("location") || "-"}`,
    "",
    data.get("details") || "",
  ].join("\n");

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = "Your email app should open with your request ready to send.";
  status.className = "form-status is-success";
});
