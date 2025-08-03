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
        submitBtn.style.background = "#4f46e5";

        setTimeout(() => {
          submitBtn.textContent = "Request Catalogue";
          submitBtn.style.background = "#2d388a";
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

// Manufacturing Process Section Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const processTabs = document.querySelectorAll(".process-tab");
  const processContents = document.querySelectorAll(".process-tab-content");

  processTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      // Remove active class from all tabs and contents
      processTabs.forEach((t) => t.classList.remove("active"));
      processContents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const targetContent = document.querySelector(
        `[data-content="${targetTab}"]`
      );
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // Image slideshow functionality
  const processImages = document.querySelectorAll(".process-image");
  const prevBtn = document.querySelector(".process-image-arrow.prev");
  const nextBtn = document.querySelector(".process-image-arrow.next");

  if (processImages.length > 0 && prevBtn && nextBtn) {
    let currentImageIndex = 0;

    function showImage(index) {
      processImages.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });
    }

    function nextImage() {
      currentImageIndex = (currentImageIndex + 1) % processImages.length;
      showImage(currentImageIndex);
    }

    function prevImage() {
      currentImageIndex =
        (currentImageIndex - 1 + processImages.length) % processImages.length;
      showImage(currentImageIndex);
    }

    nextBtn.addEventListener("click", nextImage);
    prevBtn.addEventListener("click", prevImage);

    // Auto-slide functionality (optional)
    let autoSlideInterval = setInterval(nextImage, 5000);

    // Pause auto-slide on hover
    const imageWrapper = document.querySelector(".process-image-wrapper");
    if (imageWrapper) {
      imageWrapper.addEventListener("mouseenter", () => {
        clearInterval(autoSlideInterval);
      });

      imageWrapper.addEventListener("mouseleave", () => {
        autoSlideInterval = setInterval(nextImage, 5000);
      });
    }

    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const imageContainer = document.querySelector(".process-image-container");
    if (imageContainer) {
      imageContainer.addEventListener(
        "touchstart",
        (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isDragging = true;
          clearInterval(autoSlideInterval);
        },
        { passive: true }
      );

      imageContainer.addEventListener(
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

      imageContainer.addEventListener(
        "touchend",
        (e) => {
          if (!isDragging) return;

          const endX = e.changedTouches[0].clientX;
          const diffX = startX - endX;

          // Minimum swipe distance
          if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
              // Swipe left - next image
              nextImage();
            } else {
              // Swipe right - previous image
              prevImage();
            }
          }

          isDragging = false;
          autoSlideInterval = setInterval(nextImage, 5000);
        },
        { passive: true }
      );
    }
  }
});

// Testimonials Carousel Functionality
document.addEventListener("DOMContentLoaded", function () {
  const testimonialsCarousel = document.querySelector(".testimonials-carousel");
  const testimonialCards = document.querySelectorAll(".testimonial-card");

  if (testimonialsCarousel && testimonialCards.length > 0) {
    let currentIndex = 0;
    let isTransitioning = false;
    const cardCount = testimonialCards.length;
    let autoSlideInterval;

    // Clone cards for infinite scroll
    function setupInfiniteScroll() {
      // Create clones for seamless infinite scroll
      testimonialCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.add("clone");
        testimonialsCarousel.appendChild(clone);
      });
    }

    // Get card width including gap
    function getCardWidth() {
      const containerWidth = testimonialsCarousel.parentElement.offsetWidth;
      const gap = 32; // Gap between cards

      // Determine cards per view based on screen size
      let cardsPerView = 3;
      if (window.innerWidth <= 768) {
        cardsPerView = 1;
      } else if (window.innerWidth <= 1024) {
        cardsPerView = 2;
      }

      return (containerWidth + gap) / cardsPerView;
    }

    // Update carousel position
    function updateCarouselPosition(animate = true) {
      const cardWidth = getCardWidth();
      const translateX = -currentIndex * cardWidth;

      if (animate) {
        testimonialsCarousel.style.transition =
          "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      } else {
        testimonialsCarousel.style.transition = "none";
      }

      testimonialsCarousel.style.transform = `translateX(${translateX}px)`;
    }

    // Move to next slide
    function nextSlide() {
      if (isTransitioning) return;

      isTransitioning = true;
      currentIndex++;
      updateCarouselPosition();

      // Reset to beginning when reaching clones
      if (currentIndex >= cardCount) {
        setTimeout(() => {
          currentIndex = 0;
          updateCarouselPosition(false);
          isTransitioning = false;
        }, 800);
      } else {
        setTimeout(() => {
          isTransitioning = false;
        }, 800);
      }
    }

    // Start auto-slide
    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4000);
    }

    // Stop auto-slide
    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCarouselPosition(false);
      }, 250);
    });

    // Pause on hover (for desktop)
    testimonialsCarousel.addEventListener("mouseenter", stopAutoSlide);
    testimonialsCarousel.addEventListener("mouseleave", startAutoSlide);

    // Handle visibility change (pause when tab is not active)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    testimonialsCarousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopAutoSlide();
      },
      { passive: true }
    );

    testimonialsCarousel.addEventListener(
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

    testimonialsCarousel.addEventListener(
      "touchend",
      (e) => {
        if (!isDragging) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // Minimum swipe distance
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            // Swipe left - next slide
            nextSlide();
          }
          // For simplicity, we only handle next slide on swipe
        }

        isDragging = false;

        // Restart auto-slide after touch interaction
        setTimeout(() => {
          startAutoSlide();
        }, 2000);
      },
      { passive: true }
    );

    // Initialize
    setupInfiniteScroll();
    updateCarouselPosition(false);
    startAutoSlide();
  }
});

// Image Zoom Functionality for Carousel
document.addEventListener("DOMContentLoaded", function () {
  const carouselImageContainer = document.querySelector(
    ".carousel-image-container"
  );
  const carouselImage = document.querySelector(".carousel-image");
  const zoomPreview = document.querySelector(".zoom-preview");
  const heroGallery = document.querySelector(".hero-gallery");

  if (carouselImageContainer && carouselImage && zoomPreview && heroGallery) {
    // Move the zoom preview outside the image container
    heroGallery.appendChild(zoomPreview);

    // Add a padding around the image to detect hover near the edges
    const padding = 20; // pixels of padding around the image

    carouselImageContainer.addEventListener("mousemove", (e) => {
      const rect = carouselImage.getBoundingClientRect();
      const galleryRect = heroGallery.getBoundingClientRect();

      // Calculate cursor position relative to image
      let relX = e.clientX - rect.left;
      let relY = e.clientY - rect.top;

      // Convert to percentage, accounting for position outside the image
      const xPercent = Math.max(0, Math.min(100, (relX / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, (relY / rect.height) * 100));

      // Set background position for the zoom effect
      zoomPreview.style.backgroundImage = `url(${carouselImage.src})`;
      zoomPreview.style.backgroundPosition = `${xPercent}% ${yPercent}%`;

      // Position the zoom preview to the right of the image
      // Update vertical position to be centered relative to the image container
      const zoomPreviewHeight = zoomPreview.offsetHeight || 350; // Use default if not yet rendered
      const verticalCenter = rect.top + rect.height / 2 - zoomPreviewHeight / 2;

      zoomPreview.style.left = `${rect.right + 20}px`;
      zoomPreview.style.top = `${verticalCenter}px`;
      zoomPreview.style.opacity = 1;
      zoomPreview.style.transform = "scale(1)";
    });

    // Create a larger area for hover detection
    const isNearImage = (e) => {
      const rect = carouselImage.getBoundingClientRect();
      return (
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding
      );
    };

    // Handle mouse movement in the vicinity of the image
    document.addEventListener("mousemove", (e) => {
      if (isNearImage(e)) {
        carouselImageContainer.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: e.clientX,
            clientY: e.clientY,
          })
        );
      } else {
        zoomPreview.style.opacity = 0;
        zoomPreview.style.transform = "scale(0.9)";
      }
    });

    carouselImageContainer.addEventListener("mouseleave", () => {
      // Small delay before hiding to allow smooth transition when moving just outside
      setTimeout(() => {
        if (!isNearImage(window.event)) {
          zoomPreview.style.opacity = 0;
          zoomPreview.style.transform = "scale(0.9)";
        }
      }, 50);
    });
  } else {
    console.error(
      "Zoom preview elements are missing or not properly initialized."
    );
  }
});

// Hamburger Menu Toggle for Mobile
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerToggles = document.querySelectorAll(".hamburger-toggle");
  const mobileNavMenu = document.querySelector(".mobile-nav-menu");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileNavClose = document.querySelector(".mobile-nav-close");
  const mobileDropdownToggles = document.querySelectorAll(
    ".mobile-dropdown-toggle"
  );

  if (hamburgerToggles.length > 0) {
    // Toggle menu on hamburger click (both in main nav and sticky header)
    hamburgerToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        if (mobileNavMenu) {
          mobileNavMenu.classList.add("active");
          if (mobileNavOverlay) mobileNavOverlay.classList.add("active");
          document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
        } else {
          console.error("Mobile nav menu element not found");
        }
      });
    });

    // Close mobile menu
    if (mobileNavClose) {
      mobileNavClose.addEventListener("click", function () {
        mobileNavMenu.classList.remove("active");
        if (mobileNavOverlay) mobileNavOverlay.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable scrolling
      });
    }

    // Close mobile menu when clicking outside
    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener("click", function () {
        mobileNavMenu.classList.remove("active");
        mobileNavOverlay.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable scrolling
      });
    }

    // Handle dropdown toggles in mobile menu
    if (mobileDropdownToggles.length > 0) {
      mobileDropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
          e.preventDefault();
          const dropdownContent = this.nextElementSibling;
          this.classList.toggle("active");

          if (dropdownContent.style.maxHeight) {
            dropdownContent.style.maxHeight = null;
          } else {
            dropdownContent.style.maxHeight =
              dropdownContent.scrollHeight + "px";
          }
        });
      });
    }
  } else {
    console.error("Hamburger toggle elements not found in the DOM");
  }
});

// Process Tab Scrolling for Mobile
document.addEventListener("DOMContentLoaded", function () {
  const processTabs = document.querySelector(".process-tabs");
  const processTabsArray = document.querySelectorAll(".process-tab"); // Use this for forEach

  if (processTabs) {
    // Scroll active tab into view on page load
    const activeTab = processTabs.querySelector(".process-tab.active");
    if (activeTab && window.innerWidth <= 1023) {
      setTimeout(() => {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 300);
    }

    // Add click handler for process tabs that scrolls the clicked tab into center view
    const allProcessTabs = processTabs.querySelectorAll(".process-tab");
    allProcessTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        if (window.innerWidth <= 1023) {
          setTimeout(() => {
            this.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }, 10);
        }
      });
    });
  }

  // Add responsive image loading for process tab content
  const processImages = document.querySelectorAll(".process-image");

  function updateProcessImageForMobile() {
    const activeTab = document.querySelector(".process-tab.active");
    if (!activeTab) return;

    const activeTabId = activeTab.getAttribute("data-tab");
    const activeTabIndex = Array.from(processTabsArray).findIndex(
      (tab) => tab.getAttribute("data-tab") === activeTabId
    );

    if (activeTabIndex >= 0) {
      processImages.forEach((img, idx) => {
        img.classList.remove("active");
        if (idx === activeTabIndex && idx < processImages.length) {
          img.classList.add("active");
        }
      });
    }
  }

  // Update images when tab is clicked (for mobile)
  processTabsArray.forEach((tab) => {
    // Use processTabsArray instead of processTabs
    tab.addEventListener("click", function () {
      if (window.innerWidth <= 1023) {
        updateProcessImageForMobile();
      }
    });
  });

  // Initialize on load
  if (window.innerWidth <= 1023) {
    updateProcessImageForMobile();
  }
});

// Mobile Process Navigation
document.addEventListener("DOMContentLoaded", function () {
  const processSteps = [
    {
      id: "raw-material",
      name: "Raw Material",
      title: "High-Grade Raw Material Selection",
      description:
        "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
      features: [
        "PE100 grade material",
        "Optimal molecular weight distribution",
      ],
      image: "assets/images/hero-main.jpg",
    },
    {
      id: "extrusion",
      name: "Extrusion",
      title: "Precision Extrusion Technology",
      description:
        "Advanced extrusion systems ensure consistent material flow and optimal temperature control throughout the manufacturing process.",
      features: [
        "Temperature controlled extrusion",
        "Consistent material distribution",
      ],
      image: "assets/images/hero-main.jpg",
    },
    {
      id: "cooling",
      name: "Cooling",
      title: "Controlled Cooling Process",
      description:
        "Systematic cooling ensures proper material crystallization and dimensional stability of the manufactured pipes.",
      features: ["Controlled cooling rate", "Optimal crystallization"],
      image: "assets/images/hero-main.jpg",
    },
    {
      id: "sizing",
      name: "Sizing",
      title: "Precision Sizing Control",
      description:
        "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
      features: ["Precise diameter control", "Uniform wall thickness"],
      image: "assets/images/hero-main.jpg",
    },
    {
      id: "quality-control",
      name: "Quality Control",
      title: "Comprehensive Quality Control",
      description:
        "Rigorous testing and inspection processes ensure every pipe meets international standards and quality requirements.",
      features: ["Automated testing systems", "ISO compliance verification"],
      image: "assets/images/hero-main.jpg",
    },
    {
      id: "marking",
      name: "Marking",
      title: "Professional Marking System",
      description:
        "Clear and permanent marking ensures traceability and proper identification of specifications and standards.",
      features: ["Permanent marking", "Full traceability"],
      image: "assets/images/hero-main.jpg",
    },
    {
      id: "cutting",
      name: "Cutting",
      title: "Precision Cutting Technology",
      description:
        "Automated cutting systems ensure accurate lengths and clean cuts for optimal joint performance.",
      features: ["Automated cutting", "Precise length control"],
      image: "assets/images/hero-main.jpg",
    },
    {
      id: "packaging",
      name: "Packaging",
      title: "Secure Packaging Solutions",
      description:
        "Professional packaging ensures safe transport and storage while maintaining product integrity.",
      features: ["Protective packaging", "Transport optimization"],
      image: "assets/images/hero-main.jpg",
    },
  ];

  // Mobile process navigation
  const mobileProcess = document.querySelector(".mobile-process");
  if (mobileProcess) {
    let currentStepIndex = 0;
    const totalSteps = processSteps.length;

    const stepCurrent = mobileProcess.querySelector(".step-current");
    const stepTotal = mobileProcess.querySelector(".step-total");
    const stepName = mobileProcess.querySelector(".step-name");
    const processTitle = mobileProcess.querySelector(".process-title");
    const processDescription = mobileProcess.querySelector(
      ".process-description"
    );
    const processFeatures = mobileProcess.querySelector(".process-features");
    const processImage = mobileProcess.querySelector(
      ".mobile-process-image img"
    );

    const prevBtn = mobileProcess.querySelector(".mobile-process-nav.prev");
    const nextBtn = mobileProcess.querySelector(".mobile-process-nav.next");

    // Initialize step counter
    stepTotal.textContent = totalSteps.toString();

    // Update mobile process content
    function updateMobileProcess(index) {
      const step = processSteps[index];

      // Update step indicator
      stepCurrent.textContent = (index + 1).toString();
      stepName.textContent = step.name;

      // Update content
      processTitle.textContent = step.title;
      processDescription.textContent = step.description;

      // Update features
      processFeatures.innerHTML = "";
      step.features.forEach((feature) => {
        const li = document.createElement("li");
        li.innerHTML = `<img src="assets/svgs/CheckCircle.svg" alt="Check"> ${feature}`;
        processFeatures.appendChild(li);
      });

      // Update image
      processImage.src = step.image;
      processImage.alt = `${step.name} Process`;

      // Update button states
      prevBtn.disabled = index === 0;
      // prevBtn.style.visibility = index === 0 ? "hidden" : "visible";
      nextBtn.disabled = index === totalSteps - 1;
      // nextBtn.textContent = index === totalSteps - 1 ? "Finish" : "Next";
      // nextBtn.querySelector("img").style.display =
      //   index === totalSteps - 1 ? "none" : "inline";

      // Apply fade transition
      mobileProcess.querySelector(
        ".mobile-process-content-wrapper"
      ).style.opacity = "0";
      setTimeout(() => {
        mobileProcess.querySelector(
          ".mobile-process-content-wrapper"
        ).style.opacity = "1";
      }, 50);
    }

    // Event listeners for navigation buttons
    prevBtn.addEventListener("click", () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        updateMobileProcess(currentStepIndex);
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentStepIndex < totalSteps - 1) {
        currentStepIndex++;
        updateMobileProcess(currentStepIndex);
      }
    });

    // Initialize with first step
    updateMobileProcess(currentStepIndex);

    // Sync mobile and desktop tabs
    const desktopTabs = document.querySelectorAll(".process-tab");
    desktopTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        if (window.innerWidth <= 767) {
          currentStepIndex = index;
          updateMobileProcess(currentStepIndex);
        }
      });
    });
  }
});

// Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const modal = document.getElementById("brochure-modal");
  const modalOverlay = document.getElementById("brochure-modal-overlay");
  const closeBtn = document.querySelector(".modal-close");
  const modalForm = document.querySelector(".modal-form");
  const downloadBtn = document.querySelector(".specs-download-btn");

  if (modal && modalOverlay && closeBtn && downloadBtn) {
    // Open modal when download button is clicked
    downloadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modal.classList.add("active");
      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling
    });

    // Close modal functions
    function closeModal() {
      modal.classList.remove("active");
      modalOverlay.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling
    }

    // Close on X button click
    closeBtn.addEventListener("click", closeModal);

    // Close on overlay click
    modalOverlay.addEventListener("click", closeModal);

    // Close on ESC key press
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });

    // Handle form submission
    if (modalForm) {
      modalForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const contact = document.getElementById("contact").value.trim();

        // Here you would typically send the data to your server
        console.log(
          "Form submitted with email:",
          email,
          "and contact:",
          contact
        );

        // Show success state
        const downloadBtn = modalForm.querySelector(".download-btn");
        downloadBtn.textContent = "Downloaded!";
        downloadBtn.style.backgroundColor = "#10B981";

        // Close modal after short delay
        setTimeout(() => {
          closeModal();

          // Reset form and button after closing
          setTimeout(() => {
            modalForm.reset();
            downloadBtn.textContent = "Download Brochure";
            downloadBtn.style.backgroundColor = "";
          }, 300);
        }, 1500);
      });
    }
  }
});

// Quote Request Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const quoteModal = document.getElementById("quote-modal");
  const quoteModalOverlay = document.getElementById("quote-modal-overlay");
  const quoteCloseBtn = quoteModal
    ? quoteModal.querySelector(".modal-close")
    : null;
  const quoteForm = quoteModal ? quoteModal.querySelector(".quote-form") : null;
  const quoteRequestBtns = document.querySelectorAll(
    'a[href="#quote"], .features-action .btn-primary'
  );

  if (
    quoteModal &&
    quoteModalOverlay &&
    quoteCloseBtn &&
    quoteRequestBtns.length > 0
  ) {
    // Open modal when quote buttons are clicked
    quoteRequestBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        quoteModal.classList.add("active");
        quoteModalOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent scrolling
      });
    });

    // Close modal functions
    function closeQuoteModal() {
      quoteModal.classList.remove("active");
      quoteModalOverlay.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling
    }

    // Close on X button click
    quoteCloseBtn.addEventListener("click", closeQuoteModal);

    // Close on overlay click
    quoteModalOverlay.addEventListener("click", closeQuoteModal);

    // Close on ESC key press
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && quoteModal.classList.contains("active")) {
        closeQuoteModal();
      }
    });

    // Handle form submission
    if (quoteForm) {
      quoteForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const companyName = document.getElementById("companyName").value.trim();
        const emailAddress = document
          .getElementById("emailAddress")
          .value.trim();
        const countryCode = document.getElementById("countryCode").value;
        const phoneNumber = document.getElementById("phoneNumber").value.trim();

        // Here you would typically send the data to your server
        console.log("Quote form submitted:", {
          fullName,
          companyName,
          emailAddress,
          phone: countryCode + phoneNumber,
        });

        // Show success state
        const submitBtn = quoteForm.querySelector(".submit-btn");
        submitBtn.textContent = "Request Submitted!";
        submitBtn.style.backgroundColor = "#10B981";

        // Close modal after short delay
        setTimeout(() => {
          closeQuoteModal();

          // Reset form and button after closing
          setTimeout(() => {
            quoteForm.reset();
            submitBtn.textContent = "Submit Form";
            submitBtn.style.backgroundColor = "";
          }, 300);
        }, 1500);
      });
    }
  }
});
