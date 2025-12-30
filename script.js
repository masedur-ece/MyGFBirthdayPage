/* ================= MOBILE VIEWPORT FIX ================= */
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`
  );
}
setVh();
window.addEventListener("resize", setVh);

/* ================= ELEMENTS ================= */
const intro = document.getElementById("intro");
const messageScreen = document.getElementById("messageScreen");
const photoScreen = document.getElementById("photoScreen");
const storyScreen = document.getElementById("storyScreen");
const finalScreen = document.getElementById("finalScreen");

const bgMusic = document.getElementById("bgMusic");
const typeText = document.getElementById("typeText");

const startBtn = document.getElementById("startBtn");
const nextMsgBtn = document.getElementById("nextMsgBtn");
const finalBtn = document.getElementById("finalBtn");
const storyNextBtn = document.getElementById("storyNextBtn");

/* ================= MESSAGES ================= */
const messages = [
  "Happy Birthday to the most special girl ❤️",
  "Every moment with you is magical ✨",
  "You are my smile, my peace, my home 🌸",
  "Even math can't calculate how much I love you 💖"
];

let msgIndex = 0;
let charIndex = 0;
let typing = false;

/* ================= START ================= */
startBtn.addEventListener("click", () => {
  intro.classList.add("hidden");
  messageScreen.classList.remove("hidden");

  bgMusic.volume = 0.6;
  bgMusic.loop = true;
  bgMusic.play().catch(() => {
    document.body.addEventListener(
      "touchstart",
      () => bgMusic.play(),
      { once: true }
    );
  });

  startTyping();
});

/* ================= TYPEWRITER ================= */
function startTyping() {
  typing = true;
  typeText.textContent = "";
  charIndex = 0;

  function type() {
    if (charIndex < messages[msgIndex].length) {
      typeText.textContent += messages[msgIndex][charIndex];
      charIndex++;
      setTimeout(type, 60);
    } else {
      typing = false;
    }
  }
  type();
}

/* ================= NEXT MESSAGE ================= */
nextMsgBtn.addEventListener("click", () => {

  // 🔊 POP SOUND (LOUD & CLEAR)
  const popSound = new Audio("pop.mp3");
  popSound.volume = 1.0;
  popSound.play().catch(() => {});

  if (typing) {
    typeText.textContent = messages[msgIndex];
    typing = false;
    return;
  }

  msgIndex++;

  if (msgIndex < messages.length) {
    startTyping();
  } else {
    messageScreen.classList.add("hidden");
    photoScreen.classList.remove("hidden");
    initPhotoCarousel();
  }
});

/* ================= PHOTO → STORY ================= */
finalBtn.addEventListener("click", () => {
  photoScreen.classList.add("hidden");
  storyScreen.classList.remove("hidden");
});

/* ================= STORY → FINAL ================= */
storyNextBtn.addEventListener("click", () => {
  storyScreen.classList.add("hidden");
  finalScreen.classList.remove("hidden");

  // 🎧 Background music volume DOWN (ducking)
  fadeMusic(0.25);

  // ✨ SPARKLE SOUND (LOUD)
  const sparkleSound = new Audio("sparkle.mp3");
  sparkleSound.volume = 1.0;
  sparkleSound.play().catch(() => {});

  startFireworks();
});

/* ================= MUSIC FADE FUNCTION ================= */
function fadeMusic(target = 0.25, step = 0.02) {
  const interval = setInterval(() => {
    if (bgMusic.volume > target) {
      bgMusic.volume = Math.max(bgMusic.volume - step, target);
    } else {
      clearInterval(interval);
    }
  }, 80);
}

/* ================= FIREWORKS (MOBILE SAFE) ================= */
let fireworkInterval;

function startFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = [];
  const isMobile = innerWidth < 600;
  const particleCount = isMobile ? 45 : 80;

  function boom() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 100
      });
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      ctx.fillStyle = `hsl(${Math.random() * 360},100%,70%)`;
      ctx.fillRect(p.x, p.y, 2, 2);

      if (p.life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }

  clearInterval(fireworkInterval);
  fireworkInterval = setInterval(boom, 800);
  animate();
}

/* ================= 3D PHOTO CAROUSEL ================= */
function initPhotoCarousel() {
  const carousel = document.getElementById("memoryCarousel");
  const cards = carousel.querySelectorAll(".memory-card");
  const total = cards.length;

  const radius = innerWidth < 600 ? 220 : 420;
  const step = 360 / total;

  let angle = 0;
  let velocity = 0;
  let isDragging = false;
  let lastX = 0;

  cards.forEach(card => {
    card.addEventListener("click", e => {
      e.stopPropagation();
      card.classList.toggle("flipped");
    });
  });

  carousel.addEventListener("pointerdown", e => {
    isDragging = true;
    lastX = e.clientX;
    velocity = 0;
  });

  window.addEventListener("pointermove", e => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    velocity = dx * 0.18;
    angle += velocity;
    lastX = e.clientX;
  });

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });

  function animateCarousel() {
    if (!isDragging) {
      velocity *= 0.94;
      angle += velocity;

      if (Math.abs(velocity) < 0.02) {
        angle += innerWidth < 600 ? 0.015 : 0.03;
      }
    }

    carousel.style.transform = `rotateY(${angle}deg)`;

    cards.forEach((card, i) => {
      const a = (i * step + angle) * Math.PI / 180;
      const depth = (Math.cos(a) + 1) / 2;

      const scale = 0.8 + depth * 0.25;
      const blur = (1 - depth) * 3;
      const opacity = 0.4 + depth * 0.6;

      card.style.filter = `blur(${blur}px)`;
      card.style.opacity = opacity;
      card.style.transform =
        `rotateY(${i * step}deg) translateZ(${radius}px) scale(${scale})`;
    });

    requestAnimationFrame(animateCarousel);
  }

  animateCarousel();
}

/* ================= SHOOTING STARS ================= */
setInterval(() => {
  if (Math.random() < 0.35) {
    const star = document.createElement("div");
    star.className = "shooting-star";
    star.style.left = Math.random() * 80 + "vw";
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1500);
  }
}, 6000);
