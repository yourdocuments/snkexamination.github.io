```javascript
/* =========================================================
   SNK IT Institute — Student Portal
   Step 1.18.2 — script.js
   Premium Student Portal / Galaxy Hero UI
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     1. BASIC CONFIGURATION
     ======================================================= */

  const CONFIG = {
    studentId: "SNK-1001",
    studentName: "Demo Student",
    course: "Computer Office Application",
    batch: "Batch 01",
    classStart: "08 September 2026",
    classStartISO: "2026-09-08",
    classTime: "4:00 PM – 6:00 PM",
    duration: "6 Months",
    mode: "Offline",
    routine: "Saturday – Monday",
    instructor: "SNK IT Instructor"
  };

  const STORAGE_KEYS = {
    theme: "snkTheme",
    language: "snkLanguage",
    profile: "snkStudentProfile",
    loggedIn: "snkStudentLoggedIn",
    studentId: "snkStudentId",
    studentName: "snkStudentName",
    studentCourse: "snkStudentCourse"
  };


  /* =======================================================
     2. SAFE DOM HELPERS
     ======================================================= */

  const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
  };

  const $$ = (selector, parent = document) => {
    return [...parent.querySelectorAll(selector)];
  };

  const getStorage = (key, fallback = null) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      console.warn("localStorage read failed:", error);
      return fallback;
    }
  };

  const setStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("localStorage write failed:", error);
      return false;
    }
  };

  const removeStorage = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("localStorage remove failed:", error);
    }
  };


  /* =======================================================
     3. STUDENT DATA
     ======================================================= */

  function loadStudentData() {
    const storedId = getStorage(
      STORAGE_KEYS.studentId,
      CONFIG.studentId
    );

    const storedName = getStorage(
      STORAGE_KEYS.studentName,
      CONFIG.studentName
    );

    const storedCourse = getStorage(
      STORAGE_KEYS.studentCourse,
      CONFIG.course
    );

    const profileRaw = getStorage(STORAGE_KEYS.profile, null);

    let profile = {};

    if (profileRaw) {
      try {
        profile = JSON.parse(profileRaw);
      } catch (error) {
        profile = {};
      }
    }

    return {
      id: storedId || CONFIG.studentId,
      name: storedName || profile.name || CONFIG.studentName,
      course:
        storedCourse ||
        profile.course ||
        CONFIG.course,
      batch: profile.batch || CONFIG.batch
    };
  }

  const student = loadStudentData();


  /* =======================================================
     4. THEME SYSTEM
     ======================================================= */

  function getPreferredTheme() {
    const savedTheme = getStorage(STORAGE_KEYS.theme, "dark");

    if (savedTheme === "light") {
      return "light";
    }

    if (savedTheme === "dark") {
      return "dark";
    }

    if (
      savedTheme === "system" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }

    return "dark";
  }

  function applyTheme(theme) {
    let finalTheme = theme;

    if (theme === "system") {
      finalTheme =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    }

    document.documentElement.setAttribute(
      "data-theme",
      finalTheme
    );

    document.body.classList.toggle(
      "light-theme",
      finalTheme === "light"
    );

    document.body.classList.toggle(
      "dark-theme",
      finalTheme === "dark"
    );

    updateThemeButtons(finalTheme);
  }

  function updateThemeButtons(theme) {
    const buttons = $$(
      "[data-theme-toggle], #themeToggle, .theme-toggle"
    );

    buttons.forEach((button) => {
      if (!button) return;

      button.setAttribute(
        "aria-label",
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

      button.setAttribute(
        "title",
        theme === "dark"
          ? "Light Mode"
          : "Dark Mode"
      );

      const icon = button.querySelector(
        "i, .icon"
      );

      if (icon) {
        if (
          icon.classList.contains("fa") ||
          icon.classList.contains("fas") ||
          icon.classList.contains("far")
        ) {
          icon.className =
            theme === "dark"
              ? "fas fa-sun"
              : "fas fa-moon";
        } else {
          icon.textContent =
            theme === "dark"
              ? "☀"
              : "☾";
        }
      }
    });
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      getPreferredTheme();

    const next =
      current === "dark"
        ? "light"
        : "dark";

    setStorage(STORAGE_KEYS.theme, next);
    applyTheme(next);

    showToast(
      next === "dark"
        ? "Dark mode চালু হয়েছে"
        : "Light mode চালু হয়েছে",
      "success"
    );
  }

  function initializeTheme() {
    const saved = getStorage(
      STORAGE_KEYS.theme,
      "dark"
    );

    applyTheme(saved);

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia(
        "(prefers-color-scheme: light)"
      );

      const handleSystemTheme = () => {
        const currentSaved =
          getStorage(STORAGE_KEYS.theme, "dark");

        if (currentSaved === "system") {
          applyTheme("system");
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener(
          "change",
          handleSystemTheme
        );
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(
          handleSystemTheme
        );
      }
    }
  }


  /* =======================================================
     5. LANGUAGE SYSTEM
     ======================================================= */

  function initializeLanguage() {
    const language =
      getStorage(
        STORAGE_KEYS.language,
        "bn"
      );

    document.documentElement.setAttribute(
      "lang",
      language === "en" ? "en" : "bn"
    );

    updateLanguageButton(language);
  }

  function updateLanguageButton(language) {
    const buttons = $$(
      "[data-language-toggle], #languageToggle, .language-toggle"
    );

    buttons.forEach((button) => {
      if (!button) return;

      button.textContent =
        language === "bn"
          ? "English"
          : "বাংলা";

      button.setAttribute(
        "title",
        language === "bn"
          ? "Switch to English"
          : "বাংলা ভাষায় ফিরে যান"
      );
    });
  }

  function toggleLanguage() {
    const current =
      getStorage(
        STORAGE_KEYS.language,
        "bn"
      );

    const next =
      current === "bn"
        ? "en"
        : "bn";

    setStorage(
      STORAGE_KEYS.language,
      next
    );

    updateLanguageButton(next);

    /*
      Full bilingual content translation is intentionally
      kept simple in Step 1.18.2.

      Existing Bangla content remains unchanged.
      The language state is stored for future portal steps.
    */

    showToast(
      next === "en"
        ? "English mode selected"
        : "বাংলা মোড চালু হয়েছে",
      "success"
    );
  }


  /* =======================================================
     6. MOBILE NAVIGATION
     ======================================================= */

  function initializeMobileMenu() {
    const menuButton =
      $(
        "#mobileMenuBtn"
      ) ||
      $(
        "[data-mobile-menu]"
      ) ||
      $(
        ".mobile-menu-btn"
      );

    const nav =
      $(
        "#mainNav"
      ) ||
      $(
        ".main-nav"
      ) ||
      $(
        "nav"
      );

    if (!menuButton || !nav) {
      return;
    }

    menuButton.addEventListener(
      "click",
      () => {
        const isOpen =
          nav.classList.toggle(
            "mobile-open"
          );

        menuButton.classList.toggle(
          "active",
          isOpen
        );

        menuButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      }
    );

    $$(".nav-link, nav a", nav).forEach(
      (link) => {
        link.addEventListener(
          "click",
          () => {
            nav.classList.remove(
              "mobile-open"
            );

            menuButton.classList.remove(
              "active"
            );

            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );
          }
        );
      }
    );

    document.addEventListener(
      "click",
      (event) => {
        if (
          !nav.contains(event.target) &&
          !menuButton.contains(event.target)
        ) {
          nav.classList.remove(
            "mobile-open"
          );

          menuButton.classList.remove(
            "active"
          );

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      }
    );
  }


  /* =======================================================
     7. STUDENT INFORMATION
     ======================================================= */

  function updateStudentElements() {
    const idElements = $$(
      "[data-student-id], #studentId"
    );

    const nameElements = $$(
      "[data-student-name], #studentName"
    );

    const courseElements = $$(
      "[data-student-course], #studentCourse"
    );

    const batchElements = $$(
      "[data-student-batch], #studentBatch"
    );

    idElements.forEach(
      (element) => {
        element.textContent =
          student.id;
      }
    );

    nameElements.forEach(
      (element) => {
        element.textContent =
          student.name;
      }
    );

    courseElements.forEach(
      (element) => {
        element.textContent =
          student.course;
      }
    );

    batchElements.forEach(
      (element) => {
        element.textContent =
          student.batch;
      }
    );
  }


  /* =======================================================
     8. CLASS START COUNTDOWN
     ======================================================= */

  function getClassStartDate() {
    const date =
      new Date(
        `${CONFIG.classStartISO}T16:00:00`
      );

    return date;
  }

  function updateClassCountdown() {
    const countdownElements = $$(
      "[data-class-countdown], #classCountdown"
    );

    if (!countdownElements.length) {
      return;
    }

    const startDate =
      getClassStartDate();

    const now = new Date();

    const difference =
      startDate.getTime() -
      now.getTime();

    let text = "";

    if (difference <= 0) {
      text =
        "ক্লাস শুরু হয়ে গেছে";

      countdownElements.forEach(
        (element) => {
          element.textContent = text;
        }
      );

      return;
    }

    const totalSeconds =
      Math.floor(
        difference / 1000
      );

    const days =
      Math.floor(
        totalSeconds / 86400
      );

    const hours =
      Math.floor(
        (totalSeconds % 86400) /
          3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) /
          60
      );

    const seconds =
      totalSeconds % 60;

    if (days > 0) {
      text =
        `${days} দিন ${hours} ঘণ্টা ${minutes} মিনিট`;
    } else {
      text =
        `${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড`;
    }

    countdownElements.forEach(
      (element) => {
        element.textContent =
          text;
      }
    );
  }

  function initializeCountdown() {
    updateClassCountdown();

    window.setInterval(
      updateClassCountdown,
      1000
    );
  }


  /* =======================================================
     9. SCROLL REVEAL ANIMATION
     ======================================================= */

  function initializeRevealAnimation() {
    const elements = $$(
      ".reveal, .fade-up, .animate-on-scroll, [data-reveal]"
    );

    if (!elements.length) {
      return;
    }

    if (
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(
        (element) => {
          element.classList.add(
            "visible",
            "show"
          );
        }
      );

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "visible",
                  "show"
                );

                obs.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -40px 0px"
        }
      );

    elements.forEach(
      (element) => {
        observer.observe(element);
      }
    );
  }


  /* =======================================================
     10. HERO GALAXY INTERACTION
     ======================================================= */

  function initializeGalaxyEffects() {
    const hero =
      $(
        ".hero"
      ) ||
      $(
        ".hero-section"
      ) ||
      $(
        "#hero"
      );

    if (!hero) {
      return;
    }

    /*
      Subtle mouse movement for galaxy/orbit
      elements. No canvas or external image needed.
    */

    const orbits = $$(
      ".orbit, .hero-orbit, .galaxy-orbit",
      hero
    );

    const glows = $$(
      ".glow, .hero-glow, .galaxy-glow",
      hero
    );

    if (
      window.matchMedia &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    hero.addEventListener(
      "mousemove",
      (event) => {
        const rect =
          hero.getBoundingClientRect();

        const x =
          (event.clientX -
            rect.left) /
          rect.width;

        const y =
          (event.clientY -
            rect.top) /
          rect.height;

        const moveX =
          (x - 0.5) * 20;

        const moveY =
          (y - 0.5) * 20;

        orbits.forEach(
          (orbit, index) => {
            const amount =
              (index + 1) * 0.35;

            orbit.style.transform =
              `translate(${moveX * amount}px, ${moveY * amount}px)`;
          }
        );

        glows.forEach(
          (glow, index) => {
            const amount =
              (index + 1) * 0.6;

            glow.style.transform =
              `translate(${moveX * amount}px, ${moveY * amount}px)`;
          }
        );
      }
    );

    hero.addEventListener(
      "mouseleave",
      () => {
        orbits.forEach(
          (orbit) => {
            orbit.style.transform =
              "";
          }
        );

        glows.forEach(
          (glow) => {
            glow.style.transform =
              "";
          }
        );
      }
    );
  }


  /* =======================================================
     11. ACTIVE NAVIGATION
     ======================================================= */

  function initializeActiveNavigation() {
    const currentPage =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (!currentPage) {
      return;
    }

    const links = $$(
      "a[href]"
    );

    links.forEach(
      (link) => {
        const href =
          link.getAttribute(
            "href"
          );

        if (!href) {
          return;
        }

        if (
          href.startsWith("#") ||
          href.startsWith("http") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        ) {
          return;
        }

        const linkPage =
          href
            .split("/")
            .pop()
            .split("?")[0]
            .toLowerCase();

        if (
          linkPage === currentPage
        ) {
          link.classList.add(
            "active"
          );

          link.setAttribute(
            "aria-current",
            "page"
          );
        }
      }
    );
  }


  /* =======================================================
     12. SMOOTH SCROLL
     ======================================================= */

  function initializeSmoothScroll() {
    $$(
      'a[href^="#"]'
    ).forEach(
      (link) => {
        link.addEventListener(
          "click",
          (event) => {
            const targetId =
              link
                .getAttribute(
                  "href"
                );

            if (
              !targetId ||
              targetId === "#"
            ) {
              return;
            }

            const target =
              document.querySelector(
                targetId
              );

            if (!target) {
              return;
            }

            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        );
      }
    );
  }


  /* =======================================================
     13. TOAST NOTIFICATION
     ======================================================= */

  function createToastContainer() {
    let container =
      $(
        "#toastContainer"
      );

    if (container) {
      return container;
    }

    container =
      document.createElement(
        "div"
      );

    container.id =
      "toastContainer";

    container.className =
      "toast-container";

    document.body.appendChild(
      container
    );

    return container;
  }

  function showToast(
    message,
    type = "info",
    duration = 2800
  ) {
    const container =
      createToastContainer();

    const toast =
      document.createElement(
        "div"
      );

    toast.className =
      `snk-toast toast-${type}`;

    const iconMap = {
      success: "✓",
      error: "!",
      warning: "⚠",
      info: "i"
    };

    const icon =
      iconMap[type] ||
      iconMap.info;

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message"></span>
      <button
        class="toast-close"
        type="button"
        aria-label="Close notification"
      >×</button>
    `;

    const messageElement =
      toast.querySelector(
        ".toast-message"
      );

    if (messageElement) {
      messageElement.textContent =
        message;
    }

    container.appendChild(
      toast
    );

    requestAnimationFrame(
      () => {
        toast.classList.add(
          "show"
        );
      }
    );

    const closeButton =
      toast.querySelector(
        ".toast-close"
      );

    const removeToast = () => {
      toast.classList.remove(
        "show"
      );

      window.setTimeout(
        () => {
          toast.remove();
        },
        250
      );
    };

    if (closeButton) {
      closeButton.addEventListener(
        "click",
        removeToast
      );
    }

    window.setTimeout(
      removeToast,
      duration
    );
  }


  /* =======================================================
     14. BUTTON INTERACTIONS
     ======================================================= */

  function initializeThemeButtons() {
    $$(
      "[data-theme-toggle], #themeToggle, .theme-toggle"
    ).forEach(
      (button) => {
        button.addEventListener(
          "click",
          toggleTheme
        );
      }
    );
  }

  function initializeLanguageButtons() {
    $$(
      "[data-language-toggle], #languageToggle, .language-toggle"
    ).forEach(
      (button) => {
        button.addEventListener(
          "click",
          toggleLanguage
        );
      }
    );
  }


  /* =======================================================
     15. LOGIN REQUIRED BUTTONS
     ======================================================= */

  function initializeLoginRequiredLinks() {
    $$(
      "[data-login-required]"
    ).forEach(
      (element) => {
        element.addEventListener(
          "click",
          (event) => {
            const loggedIn =
              sessionStorage.getItem(
                STORAGE_KEYS.loggedIn
              );

            if (
              loggedIn === "true"
            ) {
              return;
            }

            event.preventDefault();

            showToast(
              "Student Dashboard ব্যবহার করতে Login করুন।",
              "warning"
            );

            window.setTimeout(
              () => {
                window.location.href =
                  "login.html";
              },
              700
            );
          }
        );
      }
    );
  }


  /* =======================================================
     16. DEMO BUTTONS
     ======================================================= */

  function initializeDemoButtons() {
    $$(
      "[data-demo-alert]"
    ).forEach(
      (button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();

            const message =
              button.getAttribute(
                "data-demo-alert"
              ) ||
              "এই ফিচারটি Demo Mode-এ আছে।";

            showToast(
              message,
              "info"
            );
          }
        );
      }
    );
  }


  /* =======================================================
     17. LOGOUT
     ======================================================= */

  function logoutStudent() {
    try {
      sessionStorage.removeItem(
        STORAGE_KEYS.loggedIn
      );

      sessionStorage.removeItem(
        STORAGE_KEYS.studentId
      );

      sessionStorage.removeItem(
        STORAGE_KEYS.studentName
      );

      sessionStorage.removeItem(
        STORAGE_KEYS.studentCourse
      );
    } catch (error) {
      console.warn(
        "Logout cleanup failed:",
        error
      );
    }

    showToast(
      "Logout করা হয়েছে।",
      "success"
    );

    window.setTimeout(
      () => {
        window.location.href =
          "login.html";
      },
      700
    );
  }

  function initializeLogoutButtons() {
    $$(
      "[data-logout], #logoutBtn, .logout-btn"
    ).forEach(
      (button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            logoutStudent();
          }
        );
      }
    );
  }


  /* =======================================================
     18. CLASS READY BUTTON
     ======================================================= */

  function initializeClassReadyButton() {
    $$(
      "[data-class-ready], #classReadyBtn, .class-ready-btn"
    ).forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const readiness = {
              studentId: student.id,
              studentName: student.name,
              classStart:
                CONFIG.classStart,
              status: "Ready",
              updatedAt:
                new Date().toISOString()
            };

            setStorage(
              "snkClassReady",
              JSON.stringify(
                readiness
              )
            );

            button.classList.add(
              "ready"
            );

            button.textContent =
              "✓ Ready";

            button.setAttribute(
              "disabled",
              "true"
            );

            showToast(
              "আপনার class readiness save হয়েছে।",
              "success"
            );
          }
        );
      }
    );
  }


  /* =======================================================
     19. STORAGE EVENT
     ======================================================= */

  function initializeStorageSync() {
    window.addEventListener(
      "storage",
      (event) => {
        if (
          event.key ===
          STORAGE_KEYS.theme
        ) {
          applyTheme(
            event.newValue ||
              "dark"
          );
        }

        if (
          event.key ===
            STORAGE_KEYS.studentId ||
          event.key ===
            STORAGE_KEYS.studentName ||
          event.key ===
            STORAGE_KEYS.studentCourse
        ) {
          updateStudentElements();
        }
      }
    );
  }


  /* =======================================================
     20. VISIBILITY REFRESH
     ======================================================= */

  function initializeVisibilityRefresh() {
    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          updateClassCountdown();
          updateStudentElements();
          applyTheme(
            getStorage(
              STORAGE_KEYS.theme,
              "dark"
            )
          );
        }
      }
    );
  }


  /* =======================================================
     21. HEADER SCROLL EFFECT
     ======================================================= */

  function initializeHeaderScroll() {
    const header =
      $(
        "header"
      ) ||
      $(
        ".site-header"
      ) ||
      $(
        ".navbar"
      );

    if (!header) {
      return;
    }

    const updateHeader =
      () => {
        header.classList.toggle(
          "scrolled",
          window.scrollY > 20
        );
      };

    updateHeader();

    window.addEventListener(
      "scroll",
      updateHeader,
      {
        passive: true
      }
    );
  }


  /* =======================================================
     22. BACK TO TOP
     ======================================================= */

  function initializeBackToTop() {
    const button =
      $(
        "#backToTop"
      ) ||
      $(
        "[data-back-to-top]"
      );

    if (!button) {
      return;
    }

    const updateVisibility =
      () => {
        button.classList.toggle(
          "show",
          window.scrollY > 500
        );
      };

    updateVisibility();

    window.addEventListener(
      "scroll",
      updateVisibility,
      {
        passive: true
      }
    );

    button.addEventListener(
      "click",
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }


  /* =======================================================
     23. PREVENT DOUBLE FORM SUBMISSION
     ======================================================= */

  function initializeForms() {
    $$(
      "form"
    ).forEach(
      (form) => {
        form.addEventListener(
          "submit",
          () => {
            const submitButton =
              form.querySelector(
                'button[type="submit"], input[type="submit"]'
              );

            if (!submitButton) {
              return;
            }

            if (
              submitButton.dataset.locked ===
              "true"
            ) {
              return;
            }

            submitButton.dataset.locked =
              "true";

            window.setTimeout(
              () => {
                submitButton.dataset.locked =
                  "false";
              },
              1200
            );
          }
        );
      }
    );
  }


  /* =======================================================
     24. IMAGE ERROR HANDLING
     ======================================================= */

  function initializeImageFallback() {
    $$(
      "img"
    ).forEach(
      (image) => {
        image.addEventListener(
          "error",
          () => {
            image.classList.add(
              "image-error"
            );

            /*
              Keep the broken image from
              creating an ugly layout.
            */

            image.setAttribute(
              "alt",
              image.getAttribute(
                "alt"
              ) ||
                "SNK IT Institute"
            );
          }
        );
      }
    );
  }


  /* =======================================================
     25. KEYBOARD ACCESSIBILITY
     ======================================================= */

  function initializeKeyboardSupport() {
    document.addEventListener(
      "keydown",
      (event) => {
        /*
          ESC closes mobile menu.
        */

        if (
          event.key ===
          "Escape"
        ) {
          const nav =
            $(
              "#mainNav"
            ) ||
            $(
              ".main-nav"
            );

          const menuButton =
            $(
              "#mobileMenuBtn"
            ) ||
            $(
              ".mobile-menu-btn"
            );

          if (nav) {
            nav.classList.remove(
              "mobile-open"
            );
          }

          if (menuButton) {
            menuButton.classList.remove(
              "active"
            );

            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );
          }
        }
      }
    );
  }


  /* =======================================================
     26. REDUCED MOTION SUPPORT
     ======================================================= */

  function initializeMotionPreference() {
    if (
      !window.matchMedia
    ) {
      return;
    }

    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const applyMotionPreference =
      () => {
        document.body.classList.toggle(
          "reduce-motion",
          reduceMotion.matches
        );
      };

    applyMotionPreference();

    if (
      reduceMotion.addEventListener
    ) {
      reduceMotion.addEventListener(
        "change",
        applyMotionPreference
      );
    }
  }


  /* =======================================================
     27. YEAR AUTO UPDATE
     ======================================================= */

  function initializeYear() {
    const year =
      new Date().getFullYear();

    $$(
      "[data-current-year], #currentYear"
    ).forEach(
      (element) => {
        element.textContent =
          year;
      }
    );
  }


  /* =======================================================
     28. COURSE START LABELS
     ======================================================= */

  function initializeCourseLabels() {
    $$(
      "[data-class-start]"
    ).forEach(
      (element) => {
        element.textContent =
          CONFIG.classStart;
      }
    );

    $$(
      "[data-class-time]"
    ).forEach(
      (element) => {
        element.textContent =
          CONFIG.classTime;
      }
    );

    $$(
      "[data-course-duration]"
    ).forEach(
      (element) => {
        element.textContent =
          CONFIG.duration;
      }
    );

    $$(
      "[data-course-mode]"
    ).forEach(
      (element) => {
        element.textContent =
          CONFIG.mode;
      }
    );

    $$(
      "[data-course-routine]"
    ).forEach(
      (element) => {
        element.textContent =
          CONFIG.routine;
      }
    );
  }


  /* =======================================================
     29. CURRENT DATE DISPLAY
     ======================================================= */

  function initializeCurrentDate() {
    const date =
      new Date();

    const formatted =
      date.toLocaleDateString(
        "bn-BD",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );

    $$(
      "[data-current-date]"
    ).forEach(
      (element) => {
        element.textContent =
          formatted;
      }
    );
  }


  /* =======================================================
     30. PORTAL STATUS
     ======================================================= */

  function initializePortalStatus() {
    $$(
      "[data-portal-status]"
    ).forEach(
      (element) => {
        element.textContent =
          "Active";
      }
    );
  }


  /* =======================================================
     31. DEMO STUDENT NOTICE
     ======================================================= */

  function initializeDemoStudentNotice() {
    $$(
      "[data-demo-student]"
    ).forEach(
      (element) => {
        element.textContent =
          `${student.name} • ${student.id}`;
      }
    );
  }


  /* =======================================================
     32. PRINT BUTTON
     ======================================================= */

  function initializePrintButtons() {
    $$(
      "[data-print], #printBtn, .print-btn"
    ).forEach(
      (button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            window.print();
          }
        );
      }
    );
  }


  /* =======================================================
     33. PAGE LOAD ANIMATION
     ======================================================= */

  function initializePageLoad() {
    requestAnimationFrame(
      () => {
        document.body.classList.add(
          "page-loaded"
        );
      }
    );
  }


  /* =======================================================
     34. GLOBAL ERROR PROTECTION
     ======================================================= */

  window.addEventListener(
    "error",
    (event) => {
      console.warn(
        "SNK Portal JS:",
        event.message
      );
    }
  );


  /* =======================================================
     35. INITIALIZE EVERYTHING
     ======================================================= */

  initializeTheme();
  initializeLanguage();

  updateStudentElements();
  initializeCourseLabels();
  initializeCurrentDate();
  initializePortalStatus();
  initializeDemoStudentNotice();

  initializeMobileMenu();
  initializeThemeButtons();
  initializeLanguageButtons();

  initializeActiveNavigation();
  initializeSmoothScroll();

  initializeCountdown();

  initializeRevealAnimation();
  initializeGalaxyEffects();

  initializeLoginRequiredLinks();
  initializeDemoButtons();

  initializeLogoutButtons();
  initializeClassReadyButton();

  initializeStorageSync();
  initializeVisibilityRefresh();

  initializeHeaderScroll();
  initializeBackToTop();

  initializeForms();
  initializeImageFallback();

  initializeKeyboardSupport();
  initializeMotionPreference();

  initializeYear();
  initializePrintButtons();

  initializePageLoad();


  /* =======================================================
     36. GLOBAL FUNCTIONS
     ======================================================= */

  window.SNKPortal = {
    config: CONFIG,
    student,

    toggleTheme,
    toggleLanguage,
    logoutStudent,
    showToast,

    refresh: () => {
      updateStudentElements();
      updateClassCountdown();

      applyTheme(
        getStorage(
          STORAGE_KEYS.theme,
          "dark"
        )
      );
    }
  };


  /* =======================================================
     37. READY MESSAGE
     ======================================================= */

  console.log(
    "SNK IT Institute Student Portal — Step 1.18.2 loaded successfully."
  );

  console.log(
    `Student: ${student.name} (${student.id})`
  );

  console.log(
    `Course: ${student.course}`
  );

});
```
