const navToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("[data-nav-links]");

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealEls.forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll("[data-counter]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = Number(counter.dataset.counter);
    const duration = 1300;
    let startTime = null;

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = target;
      }
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.8 });

counters.forEach((counter) => counterObserver.observe(counter));

const tabs = document.querySelector("[data-service-tabs]");
const services = document.querySelectorAll("[data-category]");

tabs?.addEventListener("click", (event) => {
  const tab = event.target.closest("button[data-filter]");
  if (!tab) return;

  tabs.querySelectorAll("button").forEach((button) => button.classList.remove("is-active"));
  tab.classList.add("is-active");

  const filter = tab.dataset.filter;
  services.forEach((service) => {
    const show = filter === "all" || service.dataset.category.includes(filter);
    service.classList.toggle("is-hidden", !show);
  });
});

const guideContent = {
  ercp: {
    title: "Suggested next step: Advanced ERCP / biliary review",
    text: "Bring ultrasound, CT/MRCP reports, LFT results and any previous surgery details. The doctor can assess whether advanced ERCP or another biliary intervention is needed."
  },
  pancreatitis: {
    title: "Suggested next step: Pancreatitis management",
    text: "Bring amylase/lipase reports, CT or ultrasound reports, admission summaries and alcohol, gallstone or medicine history so the cause and follow-up plan can be reviewed."
  },
  ibd: {
    title: "Suggested next step: IBD, UC or Crohn's disease care",
    text: "Bring colonoscopy, biopsy, stool calprotectin, CRP/ESR and previous medicine records. Long-term IBD care needs monitoring, flare control and treatment adjustment."
  },
  liver: {
    title: "Suggested next step: Liver failure / cirrhosis consultation",
    text: "Bring LFT, INR, albumin, platelet count, ultrasound/FibroScan reports and any history of ascites, vomiting blood, confusion, jaundice or swelling."
  },
  acidity: {
    title: "Suggested next step: Gas, bloating and acidity consultation",
    text: "Frequent gas, bloating, burping, heartburn, sour reflux or indigestion can be related to GERD, gastritis, food triggers, IBS or other digestive causes. Bring any previous prescriptions, endoscopy reports and medicine history."
  },
  endoscopy: {
    title: "Suggested next step: Upper GI consultation",
    text: "Symptoms like repeated vomiting, swallowing difficulty or persistent upper abdominal pain may need medical review and sometimes upper GI endoscopy."
  },
  colon: {
    title: "Suggested next step: Colonoscopy discussion",
    text: "Blood in stool, unexplained bowel changes, chronic diarrhea or screening needs can be discussed with the doctor to decide if colonoscopy is appropriate."
  },
  urgent: {
    title: "Urgent medical attention recommended",
    text: "Severe abdominal pain, black stool, blood vomiting, fainting or rapidly worsening jaundice should be assessed urgently instead of waiting for a routine appointment."
  }
};

const symptomButtons = document.querySelector("[data-symptoms]");
const guideResult = document.querySelector("[data-guide-result]");

symptomButtons?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-result]");
  if (!button || !guideResult) return;

  symptomButtons.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");

  const content = guideContent[button.dataset.result];
  guideResult.classList.toggle("is-urgent", button.dataset.result === "urgent");
  guideResult.innerHTML = `<h3>${content.title}</h3><p>${content.text}</p>`;
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const wasOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("open");
      faq.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
    });

    if (!wasOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const floatingCta = document.getElementById("floatingCta");
window.addEventListener("scroll", () => {
  floatingCta?.classList.toggle("show", window.scrollY > 520);
});

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const service = String(formData.get("service") || "").trim();

  if (!name || !phone || !service) {
    formSuccess.textContent = "Please add your name, phone number and required service.";
    formSuccess.style.color = "#b42318";
    return;
  }

  formSuccess.textContent = `Thank you, ${name}. Your request for ${service} is ready. The hospital can connect this form to WhatsApp, email or a backend.`;
  formSuccess.style.color = "#0f766e";
  contactForm.reset();
});
