document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================================
  // Preloader Timer & Entrance
  // ==========================================================================
  const preloader = document.getElementById("preloader");

  if (preloader) {
    // Force preloader completion after max 2.5 seconds, or on page window load
    window.addEventListener("load", () => {
      finishPreloader();
    });

    // Backup timeout in case resource load hangs
    setTimeout(() => {
      finishPreloader();
    }, 2500);
  }

  function finishPreloader() {
    if (preloader && !preloader.classList.contains("fade-out")) {
      preloader.classList.add("fade-out");
      // Trigger scroll reveals for initial hero items after loader fades
      setTimeout(() => {
        const heroReveals = document.querySelectorAll("#home .reveal");
        heroReveals.forEach((el) => el.classList.add("active"));
      }, 300);
    }
  }

  // ==========================================================================
  // Header Scroll Status & Progress Bar
  // ==========================================================================
  const header = document.querySelector(".header-card");
  const scrollProgress = document.getElementById("scroll-progress");

  window.addEventListener("scroll", () => {

    if (header) {
      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = (window.scrollY / docHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }
  });

  // ==========================================================================
  // Magnetic Buttons Interaction (Smooth Pointer Calculations)
  // ==========================================================================
  const magneticButtons = document.querySelectorAll(".magnetic");

  // Apply magnetic effect only for devices with pointers (desktops)
  if (window.matchMedia("(pointer: fine)").matches) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        // Calculate pointer offset from button center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Displace the button slightly in translation vectors
        btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
        btn.style.transition = "transform 0.08s linear";
      });

      btn.addEventListener("mouseleave", () => {
        // Return back to standard alignment coordinates with smooth inertia transition
        btn.style.transform = "translate3d(0, 0, 0)";
        btn.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      });
    });
  }

  // ==========================================================================
  // Mobile Nav Drawer Toggle
  // ==========================================================================
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const menuClose = document.querySelector(".mobile-menu-close");
  const menuOverlay = document.querySelector(".mobile-menu-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

  const openMenu = () => {
    menuOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menuOverlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // ==========================================================================
  // Scroll Reveal Observer
  // ==========================================================================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  // Observe all elements, except hero section reveals which trigger on loader end
  revealElements.forEach((el) => {
    if (!el.closest("#home")) {
      revealObserver.observe(el);
    }
  });

  // ==========================================================================
  // Navigation Links Scroll Tracker (Active State)
  // ==========================================================================
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-item");

  window.addEventListener("scroll", () => {
    let activeSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
        activeSectionId = section.getAttribute("id") || "";
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${activeSectionId}`) {
        link.classList.add("active");
      }
    });
  });

  // ==========================================================================
  // Email Clipboard Tooltip copy utility
  // ==========================================================================
  const copyBtn = document.getElementById("copy-email-btn");
  const emailTextContainer = document.getElementById("email-text");
  const tooltipText = document.getElementById("copy-tooltip");

  if (copyBtn && emailTextContainer) {
    const emailText = emailTextContainer.innerText.trim();
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(emailText);

        // Success state UI update
        if (tooltipText) tooltipText.innerText = "Copied!";
        copyBtn.style.color = "var(--accent-cyan)";
        copyBtn.style.borderColor = "var(--accent-cyan)";

        // Reset indicator after timeout
        setTimeout(() => {
          if (tooltipText) tooltipText.innerText = "Copy";
          copyBtn.style.color = "";
          copyBtn.style.borderColor = "";
        }, 2000);
      } catch (err) {
        if (tooltipText) tooltipText.innerText = "Failed";
      }
    });
  }

  // ==========================================================================
  // Form transmission mock validation
  // ==========================================================================
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status-alert");
  const submitBtn = contactForm?.querySelector("button[type='submit']");

  if (contactForm && submitBtn) {

    contactForm.addEventListener("submit", async (e) => {

      e.preventDefault();

      submitBtn.disabled = true;

      const originalHTML = submitBtn.innerHTML;

      submitBtn.innerHTML = `
      <span>Transmitting...</span>
      <svg class="send-icon spinner" xmlns="http://www.w3.org/2000/svg"
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2v4"></path>
      </svg>
    `;

      submitBtn.style.opacity = "0.7";

      if (!document.getElementById("spinner-styles")) {
        const style = document.createElement("style");

        style.id = "spinner-styles";

        style.innerHTML = `
        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `;

        document.head.appendChild(style);
      }

      try {

        const formData = new FormData(contactForm);

        const response = await fetch(
          "https://api.web3forms.com/submit",
          {
            method: "POST",
            body: formData
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {

          showStatus(
            "Message transmitted successfully! I'll get back to you soon.",
            "success"
          );

          contactForm.reset();

        } else {

          showStatus(
            "Failed to send message.",
            "error"
          );
        }

      } catch (error) {

        showStatus(
          "Network error occurred.",
          "error"
        );

        console.error(error);
      }

      submitBtn.disabled = false;
      submitBtn.style.opacity = "";
      submitBtn.innerHTML = originalHTML;

    });

  }
  const showStatus = (msg, alertType) => {
    if (!formStatus) return;
    formStatus.innerText = msg;
    formStatus.className = `form-status-alert ${alertType}`;

    // Auto-scroll slightly to show warning/success status nicely
    formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });

    setTimeout(() => {
      formStatus.className = "form-status-alert hidden";
    }, 6000);
  };
});


const cursor = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursorTrail");

const hasHover = window.matchMedia("(hover: hover)").matches;

if (hasHover) {

  document.body.classList.add("has-custom-cursor");

  let cursorX = 0;
  let cursorY = 0;

  let trailX = 0;
  let trailY = 0;

  document.addEventListener("mousemove", (e) => {

    cursorX = e.clientX;
    cursorY = e.clientY;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

  });

  const animateTrail = () => {

    trailX += (cursorX - trailX) * 0.15;
    trailY += (cursorY - trailY) * 0.15;

    cursorTrail.style.left = trailX + "px";
    cursorTrail.style.top = trailY + "px";

    requestAnimationFrame(animateTrail);
  };

  animateTrail();

  const handleMouseEnter = () => {
    cursor.classList.add("expand");
  };

  const handleMouseLeave = () => {
    cursor.classList.remove("expand");
  };

  document.querySelectorAll(
    "a, button, select, input, textarea, .card, .modal-close, .filter-tab"
  ).forEach(el => {

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

  });

}