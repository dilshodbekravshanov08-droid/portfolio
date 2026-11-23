// ===== Slayderlar: rasmlar o'zi aylanib turadi =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initSlider(block) {
  const slider = block.querySelector(".slider");
  const slides = slider.querySelectorAll(".slide");
  const dotsBox = block.querySelector(".dots");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const delay = Number(block.dataset.delay) || 4000;
  let current = 0;
  let timer = null;

  // Nuqtalarni yaratamiz
  slides.forEach((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", (i + 1) + "-rasm");
    dot.addEventListener("click", () => {
      show(i);
      start();
    });
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll(".dot");

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
      slide.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  function stop() {
    clearInterval(timer);
  }

  function start() {
    if (reduceMotion) return;
    stop();
    timer = setInterval(() => show(current + 1), delay);
  }

  prevBtn.addEventListener("click", () => { show(current - 1); start(); });
  nextBtn.addEventListener("click", () => { show(current + 1); start(); });

  // Sichqoncha ustida yoki tugma fokusda bo'lsa, aylanish to'xtaydi
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", start);

  show(0);
  start();
}

// Sahifada slayder bo'lsa ishga tushiramiz
document.querySelectorAll(".slider-block").forEach(initSlider);

// ===== "Promptni nusxalash" tugmasi (faqat prompt sahifasida) =====
const copyBtn = document.getElementById("copy-btn");

if (copyBtn) {
  const promptText = document.getElementById("prompt-text");
  const statusEl = document.getElementById("copy-status");

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(promptText.innerText);
      statusEl.textContent = "Nusxalandi.";
    } catch (error) {
      // Agar brauzer ruxsat bermasa, matnni belgilab qo'yamiz
      const range = document.createRange();
      range.selectNodeContents(promptText);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      statusEl.textContent = "Matn belgilandi. Ctrl+C bosib nusxalang.";
    }
  });
}
