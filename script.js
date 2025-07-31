// Trusted Logos Infinite Scroll
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".logos-carousel");
  if (carousel) {
    // Duplicate logos for seamless infinite scroll
    const logos = Array.from(carousel.children);
    logos.forEach((logo) => {
      const clone = logo.cloneNode(true);
      carousel.appendChild(clone);
    });
  }
});
// Sticky Header Show/Hide on Scroll
let lastScrollY = window.scrollY;
const stickyHeader = document.getElementById("sticky-header");
let ticking = false;

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          stickyHeader.classList.add("visible");
        } else {
          // Scrolling up
          stickyHeader.classList.remove("visible");
        }
      } else {
        stickyHeader.classList.remove("visible");
      }
      lastScrollY = currentScrollY;
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", handleScroll);

// Accessibility: Close dropdown on outside click (if dropdown implemented)
document.addEventListener("click", function (e) {
  // Add dropdown logic here if needed
});

// Hero Carousel Functionality
document.addEventListener("DOMContentLoaded", function () {
  const images = [
    "assets/images/hero-main.jpg",
    "assets/images/hero-main.jpg",
    "assets/images/hero-main.jpg",
    "assets/images/hero-main.jpg",
    "assets/images/hero-main.jpg",
    "assets/images/hero-main.jpg",
  ];
  let currentIndex = 0;
  const carouselImage = document.querySelector(".carousel-image");
  const leftBtn = document.querySelector(".carousel-arrow.left");
  const rightBtn = document.querySelector(".carousel-arrow.right");
  const thumbnails = document.querySelectorAll(
    ".carousel-thumbnails .thumbnail"
  );

  function showImage(index) {
    if (index === currentIndex) return;
    carouselImage.style.opacity = 0;
    setTimeout(() => {
      currentIndex = index;
      carouselImage.src = images[index];
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });
      setTimeout(() => {
        carouselImage.style.opacity = 1;
      }, 50);
    }, 200); // match CSS transition duration
  }

  // Initial image fade-in
  carouselImage.style.opacity = 0;
  setTimeout(() => {
    carouselImage.style.opacity = 1;
  }, 50);

  leftBtn.addEventListener("click", function () {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = images.length - 1;
    showImage(newIndex);
  });

  rightBtn.addEventListener("click", function () {
    let newIndex = currentIndex + 1;
    if (newIndex >= images.length) newIndex = 0;
    showImage(newIndex);
  });

  thumbnails.forEach((thumb, i) => {
    thumb.addEventListener("click", function () {
      showImage(i);
    });
  });

  // Initialize
  showImage(0);
});
