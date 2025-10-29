// Start page
document.getElementById("startBtn").addEventListener("click", () => {
  document.querySelector(".intro").style.display = "none";
  document.querySelector(".message-section").style.display = "block";
  createHearts();
  typeMessage();
});

let message = "Happy Birthday to the most beautiful girl in my world 💖 Every moment with you makes life magical. You are my sunshine, my smile, my everything 💕";
let i = 0;
function typeMessage() {
  if (i < message.length) {
    document.getElementById("typewriter").innerHTML += message.charAt(i);
    i++;
    setTimeout(typeMessage, 60);
  }
}

// Show slideshow
document.getElementById("showPhotosBtn").addEventListener("click", () => {
  document.querySelector(".message-section").style.display = "none";
  document.querySelector(".photo-section").style.display = "block";
  startSlideshow();
});

// Slideshow logic
const photos = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];
let index = 0;
const slideImg = document.getElementById("slideImage");

function startSlideshow() {
  slideImg.classList.add("active");
  setInterval(() => {
    slideImg.classList.remove("active");
    setTimeout(() => {
      index = (index + 1) % photos.length;
      slideImg.src = `photos/${photos[index]}`;
      slideImg.classList.add("active");
    }, 600);
  }, 3000);
}

// Final Surprise
document.getElementById("finalBtn").addEventListener("click", () => {
  document.querySelector(".photo-section").style.display = "none";
  document.querySelector(".final-section").style.display = "block";
  startFireworks();
});

// Floating Hearts
function createHearts() {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.textContent = "💖";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 20 + 15 + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
  }, 300);
}

// Fireworks Canvas Effect
function startFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;
    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 4 + 1,
        alpha: 1
      });
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.01;
      if (p.alpha <= 0) particles.splice(i, 1);

      ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, ${150 + Math.random() * 100}, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  setInterval(createFirework, 700);
  animate();

  const sparkle = new Audio("sparkle.mp3");
  sparkle.play();
}

// Replay
document.getElementById("replayBtn").addEventListener("click", () => {
  window.location.reload();
});
