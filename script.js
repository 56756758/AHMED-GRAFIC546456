// ============================================================
//  Ahmed Design — Site Protection Layer
// ============================================================
(function () {
  'use strict';

  // 1. Disable right-click context menu
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  // 2. Disable keyboard shortcuts: F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (view-source)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      return false;
    }
    // Ctrl+S (save page)
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
    if (e.ctrlKey && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+A (select all)
    if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      return false;
    }
    // Ctrl+P (print)
    if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      return false;
    }
  });

  // 3. Disable text selection via CSS injected dynamically
  var style = document.createElement('style');
  style.innerHTML = [
    '* { -webkit-user-select: none !important; -moz-user-select: none !important;',
    '-ms-user-select: none !important; user-select: none !important; }',
    'input, textarea, select { -webkit-user-select: text !important;',
    '-moz-user-select: text !important; user-select: text !important; }'
  ].join(' ');
  document.head.appendChild(style);

  // 4. Disable drag-and-drop of images and elements
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  });

  // 5. DevTools Detection — blur page when DevTools is open
  var devtoolsOpen = false;
  var threshold = 160;

  function detectDevTools() {
    var widthDiff  = window.outerWidth  - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > threshold || heightDiff > threshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        document.body.style.filter = 'blur(12px)';
        document.body.style.pointerEvents = 'none';
        document.body.style.userSelect = 'none';
      }
    } else {
      if (devtoolsOpen) {
        devtoolsOpen = false;
        document.body.style.filter = '';
        document.body.style.pointerEvents = '';
        document.body.style.userSelect = '';
      }
    }
  }

  setInterval(detectDevTools, 1000);

  // 6. Console warning message for curious visitors
  setTimeout(function () {
    console.clear();
    console.log('%c⚠️ STOP!', 'color: red; font-size: 48px; font-weight: bold;');
    console.log('%cهذا الموقع محمي بحقوق الملكية — Ahmed Design © 2026', 'color: #6366f1; font-size: 18px; font-weight: bold;');
    console.log('%cAll content is protected. Unauthorized copying is prohibited.', 'color: #94a3b8; font-size: 14px;');
  }, 500);

})();

// ============================================================
//  Ahmed Design — Main Application Logic
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // 1. Header scroll effect
  var header = document.getElementById('header-nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  var mobileMenuBtn = document.getElementById('mobile-menu-btn');
  var navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('open');

      var spans = mobileMenuBtn.querySelectorAll('span');
      if (mobileMenuBtn.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('open');
        var spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });

    // Close menu when clicking outside (on overlay area)
    document.addEventListener('click', function (e) {
      var isOpen = navLinks.classList.contains('active');
      if (isOpen && !navLinks.contains(e.target) && e.target !== mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('open');
        var spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // 3. Scroll Reveal Animation (Intersection Observer)
  var revealElements = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });

  // 4. Handle Service Card CTA clicks
  var serviceCardsCta = document.querySelectorAll('.service-card-cta');
  var requestTypeSelect = document.getElementById('request-type');
  var requestStyleInput = document.getElementById('request-style');
  var contactSection = document.getElementById('contact');

  serviceCardsCta.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var serviceName = btn.getAttribute('data-service');

      if (requestTypeSelect && serviceName) {
        requestTypeSelect.value = serviceName;
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(function () {
          requestStyleInput.focus();
        }, 800);
      }
    });
  });

  // 5. Form Submission Handler
  var requestForm  = document.getElementById('design-request-form');
  var successAlert = document.getElementById('submit-success-alert');
  var submitBtn    = document.getElementById('form-submit-btn');

  if (requestForm) {
    requestForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> جاري إرسال الطلب...';
      }

      var formData = {
          "\u0627\u0644\u0627\u0633\u0645": document.getElementById('client-name').value,
          "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a": document.getElementById('client-email').value,
          "\u0646\u0648\u0639 \u0627\u0644\u062a\u0635\u0645\u064a\u0645": document.getElementById('request-type').value,
          "\u0627\u0644\u0646\u0645\u0637 \u0648\u0627\u0644\u0623\u0644\u0648\u0627\u0646": document.getElementById('request-style') ? document.getElementById('request-style').value : 'لم يُحدد',
          "\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0637\u0644\u0628": document.getElementById('request-details').value,
          "_subject": "\u0637\u0644\u0628 \u062a\u0635\u0645\u064a\u0645 \u062c\u062f\u064a\u062f - \u0645\u0648\u0642\u0639 Ahmed Design",
          "_template": "table"
      };

      fetch("https://formsubmit.co/ajax/am9495741@gmail.com", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(function (response) {
          if (!response.ok) throw new Error('Form submission failed');
          return response.json();
        })
        .then(function (data) {
          if (data.success === "true" || data.success === true) {
            if (submitBtn) { submitBtn.style.display = 'none'; }
            if (successAlert) successAlert.style.display = 'flex';
            requestForm.reset();
            showToast('success', 'fa-circle-check', 'تم استلام طلبك بنجاح! سنتواصل معك قريباً');
          } else {
            throw new Error('Form service rejected submission');
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال طلب التصميم';
          }
          showToast('warning', 'fa-triangle-exclamation', 'تعذر الإرسال عبر البريد، حاول مرة أخرى أو تواصل عبر واتساب.');
        });
    });
  }

  // ─────────────────────────────────────────
  // 6. Loading Screen — hide fast
  // ─────────────────────────────────────────
  var loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(function () {
      loadingScreen.classList.add('hidden');
    }, 900);
  }

  // ─────────────────────────────────────────
  // 7. Scroll To Top Button
  // ─────────────────────────────────────────
  var scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─────────────────────────────────────────
  // 8. Toast Notification System
  // ─────────────────────────────────────────
  window.showToast = function (type, icon, message, duration) {
    var container = document.getElementById('toast-container');
    if (!container) return;

    duration = duration || 3500;
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = '<i class="fa-solid ' + icon + '"></i><span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('removing');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, duration);
  };

  // ─────────────────────────────────────────
  // 9. Lazy Loading for Portfolio Images
  // ─────────────────────────────────────────
  var lazyImages = document.querySelectorAll('img');
  lazyImages.forEach(function (img) {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // ─────────────────────────────────────────
  // 10. Welcome Toast on first visit
  // ─────────────────────────────────────────
  setTimeout(function () {
    showToast('info', 'fa-wand-magic-sparkles', 'مرحباً بك في AHMED DESIGN ✨');
  }, 1200);

});
