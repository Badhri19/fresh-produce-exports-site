document.documentElement.classList.add('js-enabled');
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
}

const path = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === path || (path === "" && href === "index.html")) {
    link.classList.add("active");
  }
});

document.querySelectorAll(".js-year").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

function setFormMessage(form, text, type) {
  const msg = form.querySelector("#formMessage");
  if (!msg) return;
  msg.textContent = text;
  msg.classList.remove("success", "error");
  if (type) msg.classList.add(type);
}

function clearFieldError(field) {
  field.classList.remove("input-error");
  const wrapper = field.closest(".field") || field.parentElement;
  if (!wrapper) return;
  const err = wrapper.querySelector(".field-error");
  if (err) err.remove();
}

function setFieldError(field, message) {
  field.classList.add("input-error");
  const wrapper = field.closest(".field") || field.parentElement;
  if (!wrapper) return;

  let err = wrapper.querySelector(".field-error");
  if (!err) {
    err = document.createElement("div");
    err.className = "field-error";
    wrapper.appendChild(err);
  }
  err.textContent = message;
}

function validateInquiryForm(form) {
  let valid = true;
  const requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    clearFieldError(field);
    const value = String(field.value || "").trim();
    if (!value) {
      setFieldError(field, "This is necessary, please fill it.");
      valid = false;
    }
  });

  const emailField = form.querySelector("#email");
  if (emailField && emailField.value.trim()) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
    if (!emailOk) {
      setFieldError(emailField, "Please enter a valid email address.");
      valid = false;
    }
  }

  const quantityField = form.querySelector("#quantity");
  if (quantityField && quantityField.value) {
    if (Number(quantityField.value) <= 0) {
      setFieldError(quantityField, "Quantity must be greater than 0.");
      valid = false;
    }
  }

  const phoneField = form.querySelector("#phone_number") || form.querySelector("#phone");
  if (phoneField && phoneField.value.trim()) {
    const phoneOk = /^[0-9\s\-]{6,20}$/.test(phoneField.value.trim());
    if (!phoneOk) {
      setFieldError(phoneField, "Please enter a valid phone number.");
      valid = false;
    }
  }

  return valid;
}

function collectInquiryData(form) {
  const get = (selector) => String(form.querySelector(selector)?.value || "").trim();

  return {
    productCategory: get("#product_category"),
    productName: get("#product_name"),
    variantName: get("#variant_name") || "Not specified",
    quantity: get("#quantity"),
    quantityUnit: get("#quantity_unit"),
    destinationCountry: get("#destination_country"),
    frequency: get("#frequency"),
    specialRequirements: get("#special_requirements") || "Not specified",
    company: get("#company"),
    contactName: get("#contact_name"),
    city: get("#city"),
    contactCountry: get("#contact_country"),
    phoneCode: get("#phone_code"),
    phoneNumber: get("#phone_number"),
    email: get("#email"),
  };
}

function buildInquiryDraft(data) {
  const lines = [
    "Hello FRIENDS FARM FRESH Team,",
    "",
    "Please find our product requirement details:",
    "",
    `Product Category: ${data.productCategory}`,
    `Product Required: ${data.productName}`,
    `Variant Name: ${data.variantName}`,
    `Required Quantity: ${data.quantity} ${data.quantityUnit}`,
    `Destination Country: ${data.destinationCountry}`,
    `Frequency: ${data.frequency}`,
    `Special Requirements: ${data.specialRequirements}`,
    "",
    "Buyer Contact Details:",
    `Company: ${data.company}`,
    `Name: ${data.contactName}`,
    `City: ${data.city}`,
    `Country: ${data.contactCountry}`,
    `Phone: ${data.phoneCode} ${data.phoneNumber}`,
    `Email: ${data.email}`,
    "",
    "Thank you. Please share your quotation and shipment options.",
  ];

  return lines.join("\n");
}

function collectContactData(form) {
  const get = (selector) => String(form.querySelector(selector)?.value || "").trim();

  return {
    name: get("#name"),
    company: get("#company"),
    email: get("#email"),
    phone: get("#phone") || "Not specified",
    product: get("#product"),
    quantity: get("#qty") || "Not specified",
    destinationPort: get("#port") || "Not specified",
    message: get("#message") || "Not specified",
  };
}

function buildContactDraft(data) {
  const lines = [
    "Hello FRIENDS FARM FRESH Team,",
    "",
    "Please find our contact inquiry details:",
    "",
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone / WhatsApp: ${data.phone}`,
    `Product Required: ${data.product}`,
    `Quantity: ${data.quantity}`,
    `Destination Port: ${data.destinationPort}`,
    `Message: ${data.message}`,
    "",
    "Thank you. Please share your quotation and shipment details.",
  ];

  return lines.join("\n");
}

function sendContactInquiry(form, channel) {
  setFormMessage(form, "", "");

  if (!validateInquiryForm(form)) {
    setFormMessage(form, "Please fill all required fields.", "error");
    return;
  }

  const companyWhatsApp = "919940434138";
  const companyEmail = "info@friendsfarmfresh.com";\n  const ccEmail = "badhri191101@gmail.com";
  const data = collectContactData(form);
  const draft = buildContactDraft(data);

  if (channel === "whatsapp") {
    const whatsappUrl = `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(draft)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setFormMessage(form, "WhatsApp opened with your drafted message. Please review and send.", "success");
    return;
  }

  const subject = `New Contact Inquiry - ${data.product || "General Requirement"}`;\n  const mailtoUrl = `mailto:${companyEmail}?cc=${encodeURIComponent(ccEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;
  window.location.href = mailtoUrl;
  setFormMessage(form, "Email draft opened. Please review and send.", "success");
}
function sendInquiry(form, channel) {
  setFormMessage(form, "", "");

  if (!validateInquiryForm(form)) {
    setFormMessage(form, "Please fill all required fields.", "error");
    return;
  }

  const companyWhatsApp = "919940434138";
  const companyEmail = "info@friendsfarmfresh.com";\n  const ccEmail = "badhri191101@gmail.com";
  const data = collectInquiryData(form);
  const draft = buildInquiryDraft(data);

  if (channel === "whatsapp") {
    const whatsappUrl = `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(draft)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setFormMessage(form, "WhatsApp opened with your drafted message. Please review and send.", "success");
    return;
  }

  const subject = `New Product Inquiry - ${data.productName || "Custom Requirement"}`;\n  const mailtoUrl = `mailto:${companyEmail}?cc=${encodeURIComponent(ccEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;
  window.location.href = mailtoUrl;
  setFormMessage(form, "Email draft opened. Please review and send.", "success");
}

function setupForms() {
  document.querySelectorAll("form").forEach((form) => {
        if (form.dataset.mode === "contact-inquiry") {
      form.querySelectorAll("input, select, textarea").forEach((field) => {
        const clear = () => clearFieldError(field);
        field.addEventListener("input", clear);
        field.addEventListener("change", clear);
      });

      const sendWhatsappBtn = form.querySelector("#sendContactWhatsappBtn");
      const sendEmailBtn = form.querySelector("#sendContactEmailBtn");

      if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener("click", () => {
          sendContactInquiry(form, "whatsapp");
        });
      }

      if (sendEmailBtn) {
        sendEmailBtn.addEventListener("click", () => {
          sendContactInquiry(form, "email");
        });
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        setFormMessage(
          form,
          "Please choose Send via WhatsApp or Send via Email.",
          "error"
        );
      });

      return;
    }
    if (form.dataset.mode === "product-inquiry") {
      form.querySelectorAll("input, select, textarea").forEach((field) => {
        const clear = () => clearFieldError(field);
        field.addEventListener("input", clear);
        field.addEventListener("change", clear);
      });

      const sendWhatsappBtn = form.querySelector("#sendWhatsappBtn");
      const sendEmailBtn = form.querySelector("#sendEmailBtn");

      if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener("click", () => {
          sendInquiry(form, "whatsapp");
        });
      }

      if (sendEmailBtn) {
        sendEmailBtn.addEventListener("click", () => {
          sendInquiry(form, "email");
        });
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        setFormMessage(
          form,
          "Please choose Send via WhatsApp or Send via Email.",
          "error"
        );
      });

      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      alert(
        "Thank you. Your inquiry has been captured. Our export team will contact you shortly."
      );
      form.reset();
    });
  });
}

function svgFallback(label) {
  const safe = (label || "Product Image").replace(/[&<>"']/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700" role="img" aria-label="${safe}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3e6b43"/>
      <stop offset="50%" stop-color="#7ea85a"/>
      <stop offset="100%" stop-color="#b7c98c"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="700" fill="url(#bg)"/>
  <path d="M0 510 C150 460, 290 560, 430 510 C575 455, 710 555, 1000 495 L1000 700 L0 700 Z" fill="#2f5d3a" opacity="0.55"/>
  <path d="M0 560 C180 520, 340 605, 520 560 C700 515, 840 605, 1000 560 L1000 700 L0 700 Z" fill="#1f4028" opacity="0.5"/>
  <rect x="70" y="70" width="860" height="560" rx="20" fill="none" stroke="#ffffff" stroke-opacity="0.35"/>
  <text x="500" y="330" text-anchor="middle" fill="#ffffff" font-size="52" font-family="Segoe UI, Arial, sans-serif" font-weight="700">${safe}</text>
  <text x="500" y="380" text-anchor="middle" fill="#ecf4e2" font-size="28" font-family="Segoe UI, Arial, sans-serif">Image preview placeholder</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function applyImageFallback(img) {
  if (img.dataset.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";
  img.src = svgFallback(img.alt || "Export Product");
}

document.querySelectorAll("img").forEach((img) => {
  if (img.complete && img.naturalWidth === 0) {
    applyImageFallback(img);
  }
  img.addEventListener("error", () => applyImageFallback(img), { once: true });
});

function updateScrollBlur() {
  const blurReachPx = Math.max(window.innerHeight * 1.25, 420);
  const progress = Math.min(window.scrollY / blurReachPx, 1);
  const blurPx = progress * 9.6;
  const tint = progress * 0.18;

  document.body.style.setProperty("--scroll-blur", blurPx.toFixed(2));
  document.body.style.setProperty("--scroll-tint", tint.toFixed(3));
}

function updateHomeNavState() {
  const topbar = document.querySelector(".topbar");
  if (!topbar || !document.body.classList.contains("home-page")) return;

  if (window.scrollY > 24) {
    topbar.classList.add("scrolled-nav");
  } else {
    topbar.classList.remove("scrolled-nav");
  }
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function injectWhatsAppFloat() {
  if (document.querySelector(".whatsapp-float")) return;

  const link = document.createElement("a");
  link.className = "whatsapp-float";
  const floatMessage = encodeURIComponent("Hello, I would like to learn more about your products and export capabilities.");
  link.href = `https://wa.me/919940434138?text=${floatMessage}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "Chat on WhatsApp");
  link.innerHTML = `
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
      <path fill="#fff" d="M19.1 17.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.8 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.6.1-.8.4-.3.3-1 1-1 2.5s1 3 1.1 3.2c.1.2 2 3.1 4.8 4.4.7.3 1.2.5 1.7.7.7.2 1.4.2 1.9.1.6-.1 1.6-.7 1.8-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.3z"/>
      <path fill="#fff" d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.5L3 29l6.7-1.7c1.9 1 4 1.6 6.3 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 .9.9-3.9-.2-.4c-1-1.7-1.6-3.7-1.6-5.8 0-6 4.9-10.9 10.9-10.9S26.9 10 26.9 16 22 26.6 16 26.6z"/>
    </svg>`;

  document.body.appendChild(link);
}

setupForms();
window.addEventListener("scroll", updateScrollBlur, { passive: true });
window.addEventListener("resize", updateScrollBlur);
window.addEventListener("scroll", updateHomeNavState, { passive: true });
window.addEventListener("resize", updateHomeNavState);

updateScrollBlur();
updateHomeNavState();
setupRevealAnimations();
injectWhatsAppFloat();










