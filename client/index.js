import "./index.css";
 
console.log("Hello, world124");

// reduced motion toggle
document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('reduced-motion-toggle');
  const main = document.querySelector('main');

  // Detecteer systeemvoorkeur
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Zet checkbox en class als systeemvoorkeur reduce is
  if (prefersReducedMotion) {
    checkbox.checked = true;
    main.classList.add('reduced-motion');
  }

  // Zet class als checkbox bij init al aangevinkt is (bijv. bij terugkomen op de pagina)
  if (checkbox.checked) {
    main.classList.add('reduced-motion');
  }

  // Luister naar wijzigingen
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      main.classList.add('reduced-motion');
    } else {
      main.classList.remove('reduced-motion');
    }
  });
});


 
document.addEventListener("DOMContentLoaded", function () {
  const yellowShapes = Array.from(
    document.querySelectorAll(
      'svg [fill="#F9EA3E"], svg [fill="#f9ea3e"], svg .cls-1, svg .cls-2',
    ),
  );
  yellowShapes.forEach((el) => el.classList.add("yellow-anim"));
 
  for (let i = yellowShapes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [yellowShapes[i], yellowShapes[j]] = [yellowShapes[j], yellowShapes[i]];
  }
 
  yellowShapes.forEach((shape, i) => {
    setTimeout(() => {
      shape.setAttribute("fill", "#000");
      shape.classList.remove("cls-1", "cls-2");
    }, i * 500);
  });
});
 
window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".wrapper");
  const homes = wrapper.querySelectorAll("#huis").length;

  if (homes >= 5) {
    const secondsPerHome = 1.5;
    const minDuration = 20;
    const maxDuration = 60;

    let duration = homes * secondsPerHome;
    duration = Math.max(minDuration, Math.min(duration, maxDuration));

    wrapper.style.animationDuration = `${duration}s`;
  } else {
    wrapper.style.animation = "none";

    // Verberg de gedeelte-2 elementen
    const gedeelte2Elements = document.querySelectorAll(".gedeelte-2");
    gedeelte2Elements.forEach(el => {
      el.style.display = "none";
    });
  }
});

 
const tooltip = document.getElementById("tooltip");
const links = document.querySelectorAll(".straat-link");
 
links.forEach((link) => {
  const name = link.dataset.straat;
 
  link.addEventListener("mouseenter", (e) => {
    tooltip.style.display = "block";
    tooltip.textContent = name;
  });
 
  link.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
 
  link.addEventListener("mousemove", (e) => {
    const mapWrapper = document.querySelector(".map-wrapper");
    const rect = mapWrapper.getBoundingClientRect();
    tooltip.style.left = e.clientX - rect.left + 10 + "px";
    tooltip.style.top = e.clientY - rect.top - 10 + "px";
  });
});
 
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.from('svg[aria-label="introSVG"] path', {
    drawSVG: 0,
    duration: 30,
    ease: "power1.inOut",
  });
}
 
const steps = document.querySelectorAll(".story-step");
const overlay = document.getElementById("story-overlay");
const title = document.querySelector(".story h1");
const prevBtn = document.getElementById("prevBtn");
let currentStep = 0;
 
function showStep(index) {
  steps.forEach((step) => step.classList.remove("active"));
  steps[index].classList.add("active");
 
  if (index === 0) {
    title.style.display = "block";
    prevBtn.style.display = "none";
  } else {
    title.style.display = "none";
    prevBtn.style.display = "inline-block";
  }
}
 
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    overlay.style.display = "none";
  }
});
 
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
});
 
showStep(currentStep);
 


 
document.querySelectorAll('.dropbtn').forEach(button => {
  button.addEventListener('click', function (e) {
      e.preventDefault();
      const dropdown = this.nextElementSibling;
      const isOpen = dropdown.style.display === 'block';
 
      document.querySelectorAll('.dropdown-content').forEach(menu => {
          menu.style.display = 'none';
      });
 
      if (!isOpen) {
          dropdown.style.display = 'block';
      }
  });
});
 
document.addEventListener('click', function (e) {
  if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-content').forEach(menu => {
          menu.style.display = 'none';
      });
  }
});

 
 

document.addEventListener("DOMContentLoaded", function () {
  const straatTextLinks = document.querySelectorAll(".straat-link-text");
  const straatPathLinks = document.querySelectorAll(".straat-link");

  function setHover(straat, active) {
    const textLink = document.querySelector(`.straat-link-text[data-straat="${straat}"]`);
    const mapLink = document.querySelector(`.straat-link[data-straat="${straat}"]`);
    const path = mapLink?.querySelector("path");

    if (active) {
      textLink?.classList.add("hover");
      path?.classList.add("hover");
    } else {
      textLink?.classList.remove("hover");
      path?.classList.remove("hover");
    }
  }

  straatTextLinks.forEach(link => {
    const straat = link.dataset.straat;
    link.addEventListener("mouseenter", () => setHover(straat, true));
    link.addEventListener("mouseleave", () => setHover(straat, false));
  });

  straatPathLinks.forEach(link => {
    const straat = link.dataset.straat;
    const path = link.querySelector("path");

    path?.addEventListener("mouseenter", () => setHover(straat, true));
    path?.addEventListener("mouseleave", () => setHover(straat, false));
  });
});








