const menuToggle = document.querySelector("#menuToggle");
const mainMenu = document.querySelector("#mainMenu");
const navLinks = document.querySelectorAll(".nav-link");
const skillsSection = document.querySelector("#habilidades");
const skillsGrid = document.querySelector(".skills-grid");
const progressBars = document.querySelectorAll(".progress-bar");
const projectCards = document.querySelectorAll(".project-card");
const modal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalTools = document.querySelector("#modalTools");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

// el menu hamburguesa responsive //
menuToggle.addEventListener("click", () => {
  const isOpen = mainMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Estas son las barras de progreso animadas//
progressBars.forEach((bar) => {
  bar.style.setProperty("--progress", bar.dataset.progress);
});

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Reinicia las barras a 0% //
        skillsGrid.classList.remove("visible");

        // Fuerza al navegador a aplicar primero el estado inicial//
        void skillsGrid.offsetWidth;

        // Volver a activar la animacion//
        requestAnimationFrame(() => {
          skillsGrid.classList.add("visible");
        });
      } else {
        // Al salir de la seccion, quedan en 0% para la proxima entrada
        skillsGrid.classList.remove("visible");
      }
    });
  },
  { threshold: 0.35 }
);

skillObserver.observe(skillsSection);

// Tarjetas interactivas + modal //
const openProject = (card) => {
  modalTitle.textContent = card.dataset.title;
  modalDescription.textContent = card.dataset.description;
  modalTools.textContent = card.dataset.tools;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

projectCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    // Evita abrir dos veces cuando se pulsa el boton interno//
    if (event.target.closest(".text-button") || event.target === card) {
      openProject(card);
    }
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProject(card);
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

// Validacion en tiempo real del formulario//
const fields = {
  name: {
    element: document.querySelector("#name"),
    error: document.querySelector("#nameError"),
    validate: (value) =>
      value.trim().length >= 3 ? "" : "Escribe al menos 3 caracteres."
  },
  email: {
    element: document.querySelector("#email"),
    error: document.querySelector("#emailError"),
    validate: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ""
        : "Escribe un correo válido."
  },
  message: {
    element: document.querySelector("#message"),
    error: document.querySelector("#messageError"),
    validate: (value) =>
      value.trim().length >= 10 ? "" : "El mensaje debe tener al menos 10 caracteres."
  }
};

function validateField(field) {
  const message = field.validate(field.element.value);
  const group = field.element.closest(".form-group");
  group.classList.toggle("invalid", Boolean(message));
  field.error.textContent = message;
  return !message;
}

Object.values(fields).forEach((field) => {
  field.element.addEventListener("input", () => validateField(field));
  field.element.addEventListener("blur", () => validateField(field));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid = Object.values(fields).every(validateField);

  if (!isValid) {
    formStatus.textContent = "Revisa los campos marcados antes de enviar.";
    formStatus.style.color = "#ff9aa5";
    return;
  }

  formStatus.textContent = 
  "¡Mensaje validado correctamente! Como aun no manejo el tema de base de datos ,solo es una prueba para verificar el envio del mensaje.";
  formStatus.style.color = "#64f4c4";
  contactForm.reset();

  Object.values(fields).forEach((field) => {
    field.error.textContent = "";
    field.element.closest(".form-group").classList.remove("invalid");
  });
});

// Resalta la seccion actual en la navegacion
const sections = document.querySelectorAll("main section[id], header[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));
