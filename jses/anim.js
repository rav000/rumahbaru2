// 1) Hero: pecah judul jadi huruf, lalu naik satu per satu
  const judul = document.getElementById("judul");
  const teks = judul.textContent;
  judul.setAttribute("aria-label", teks);
  judul.innerHTML = "";
  [...teks].forEach((c, i) => {
    const span = document.createElement("span");
    span.className = "ch";
    span.setAttribute("aria-hidden", "true");
    span.textContent = c === " " ? "\u00A0" : c;
    span.style.transitionDelay = (i * 60) + "ms";
    judul.appendChild(span);
  });
  requestAnimationFrame(() => {
    judul.classList.add("ready");
    document.getElementById("lead").classList.add("ready");
    document.getElementById("cta").classList.add("ready");
  });

  // 2) Card: muncul saat masuk layar, angka menghitung naik
  function hitungNaik(el) {
    const target = +el.dataset.count;
    const durasi = 1200;
    const mulai = performance.now();
    (function tick(now) {
      const p = Math.min((now - mulai) / durasi, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(mulai);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("show");
      const angka = e.target.querySelector("[data-count]");
      if (angka) hitungNaik(angka);
      observer.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".card").forEach((c) => observer.observe(c));