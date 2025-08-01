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

// FAQ Accordion Functionality
document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = answer.classList.contains("active");

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        const otherAnswer = otherItem.querySelector(".faq-answer");
        const otherQuestion = otherItem.querySelector(".faq-question");
        otherAnswer.classList.remove("active");
        otherQuestion.setAttribute("aria-expanded", "false");
      });

      // Toggle current item
      if (!isActive) {
        answer.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Catalog form handling
  const catalogForm = document.querySelector(".catalog-form");
  const emailInput = document.querySelector(".catalog-email-input");
  const submitBtn = document.querySelector(".catalog-submit-btn");

  if (catalogForm && emailInput && submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (email && isValidEmail(email)) {
        // Handle form submission
        console.log("Requesting catalog for:", email);
        submitBtn.textContent = "Sent!";
        submitBtn.style.background = "#10b981";

        setTimeout(() => {
          submitBtn.textContent = "Request Catalogue";
          submitBtn.style.background = "#4f46e5";
          emailInput.value = "";
        }, 2000);
      } else {
        emailInput.style.borderColor = "#ef4444";
        setTimeout(() => {
          emailInput.style.borderColor = "#d1d5db";
        }, 2000);
      }
    });

    emailInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        submitBtn.click();
      }
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});

// Applications Carousel Functionality
document.addEventListener("DOMContentLoaded", function () {
  const applicationsCarousel = document.querySelector(".applications-carousel");
  const prevBtn = document.querySelector(".applications-arrow.prev");
  const nextBtn = document.querySelector(".applications-arrow.next");

  if (applicationsCarousel && prevBtn && nextBtn) {
    let currentIndex = 0;
    let isTransitioning = false;
    const originalCards = Array.from(applicationsCarousel.children);
    const cardCount = originalCards.length;

    // Clone cards for infinite scroll
    function setupInfiniteScroll() {
      // Clear existing clones
      const clones = applicationsCarousel.querySelectorAll(".clone");
      clones.forEach((clone) => clone.remove());

      // Add clones at the beginning
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.add("clone");
        applicationsCarousel.insertBefore(
          clone,
          applicationsCarousel.firstChild
        );
      });

      // Add clones at the end
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.add("clone");
        applicationsCarousel.appendChild(clone);
      });

      // Set initial position to show original cards
      currentIndex = cardCount;
      updateCarouselPosition(false);
    }

    // Get card width including gap
    function getCardWidth() {
      const card = originalCards[0];
      if (!card) return 0;
      const cardWidth = card.offsetWidth;
      const gap =
        parseInt(window.getComputedStyle(applicationsCarousel).gap) || 24;
      return cardWidth + gap;
    }

    // Get visible cards count based on screen size
    function getVisibleCards() {
      const containerWidth = applicationsCarousel.parentElement.offsetWidth;
      const cardWidth = getCardWidth();
      if (cardWidth === 0) return 1;
      return Math.floor(containerWidth / cardWidth);
    }

    // Update carousel position
    function updateCarouselPosition(animate = true) {
      const cardWidth = getCardWidth();
      const translateX = -currentIndex * cardWidth;

      if (animate) {
        applicationsCarousel.style.transition =
          "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      } else {
        applicationsCarousel.style.transition = "none";
      }

      applicationsCarousel.style.transform = `translateX(${translateX}px)`;

      // Update button states
      const visibleCards = getVisibleCards();
      const maxIndex = cardCount - visibleCards + cardCount; // Including clones

      // Always enable buttons for infinite scroll
      prevBtn.disabled = false;
      nextBtn.disabled = false;

      prevBtn.style.cursor = "pointer";
      prevBtn.style.opacity = "1";
      nextBtn.style.cursor = "pointer";
      nextBtn.style.opacity = "1";
    }

    // Handle infinite scroll reset
    function handleInfiniteScroll() {
      if (isTransitioning) return;

      const totalCards = applicationsCarousel.children.length;

      // If we're at the end clones, jump to the beginning of originals
      if (currentIndex >= cardCount * 2) {
        isTransitioning = true;
        setTimeout(() => {
          currentIndex = cardCount;
          updateCarouselPosition(false);
          isTransitioning = false;
        }, 500);
      }

      // If we're at the beginning clones, jump to the end of originals
      if (currentIndex <= 0) {
        isTransitioning = true;
        setTimeout(() => {
          currentIndex = cardCount;
          updateCarouselPosition(false);
          isTransitioning = false;
        }, 500);
      }
    }

    // Next button functionality
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isTransitioning) return;

      currentIndex++;
      updateCarouselPosition();
      handleInfiniteScroll();
    });

    // Previous button functionality
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isTransitioning) return;

      currentIndex--;
      updateCarouselPosition();
      handleInfiniteScroll();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupInfiniteScroll();
        updateCarouselPosition(false);
      }, 250);
    });

    // Initialize carousel
    setupInfiniteScroll();

    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    applicationsCarousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
      },
      { passive: true }
    );

    applicationsCarousel.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;

        // If horizontal swipe is more dominant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    applicationsCarousel.addEventListener(
      "touchend",
      (e) => {
        if (!isDragging) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // Minimum swipe distance
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            // Swipe left - next
            nextBtn.click();
          } else {
            // Swipe right - previous
            prevBtn.click();
          }
        }

        isDragging = false;
      },
      { passive: true }
    );
  }
});
