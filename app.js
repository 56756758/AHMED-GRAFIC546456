/**
 * AHMED DESIGN - Official JavaScript Application
 * High-performance, lightweight, accessible interactive layer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Loading Screen Dismissal
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 500);
      }, 350);
    });
    // Fallback if load event already fired or delayed
    setTimeout(() => {
      if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
      }
    }, 1800);
  }

  // 2. Mobile Menu Navigation
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open', !isExpanded);
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // 3. Theme Toggle (Dark / Light)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  const getSavedTheme = () => {
    return localStorage.getItem('ahmed_design_theme') || 'dark';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ahmed_design_theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-sun';
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  };

  // Initial theme application
  applyTheme(getSavedTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // 4. Quick Order Modal
  const openModalBtns = document.querySelectorAll('#open-quick-modal-btn, #hero-quick-order-btn');
  const modalOverlay = document.getElementById('quick-modal-overlay');
  const closeModalBtn = document.getElementById('modal-close-btn');

  if (modalOverlay) {
    const openModal = () => {
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 5. Scroll Header Sticky Effect
  const headerNav = document.getElementById('header-nav');
  if (headerNav) {
    const onScroll = () => {
      if (window.scrollY > 30) {
        headerNav.classList.add('scrolled');
      } else {
        headerNav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 6. Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal all immediately
    reveals.forEach(el => el.classList.add('active'));
  }

  // 7. Interactive Currency Switcher (if on pricing page)
  const currencyRadios = document.querySelectorAll('input[name="currency"]');
  const priceValues = document.querySelectorAll('[data-egp][data-usd]');

  if (currencyRadios.length > 0 && priceValues.length > 0) {
    const updatePrices = (currency) => {
      priceValues.forEach(el => {
        if (currency === 'usd') {
          el.textContent = el.getAttribute('data-usd') + ' $';
        } else {
          el.textContent = el.getAttribute('data-egp') + ' ج.م';
        }
      });
    };

    currencyRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        updatePrices(e.target.value);
      });
    });
  }

  // 8. Contact / Order WhatsApp Builder
  const quickOrderForm = document.getElementById('quick-order-form');
  if (quickOrderForm) {
    quickOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = quickOrderForm.querySelector('[name="service"]')?.value || 'تصميم عام';
      const details = quickOrderForm.querySelector('[name="details"]')?.value || '';
      
      const message = `مرحباً، أريد طلب تصميم من AHMED DESIGN.%0A- الخدمة: ${encodeURIComponent(service)}%0A- التفاصيل: ${encodeURIComponent(details)}`;
      const waUrl = `https://wa.me/201289337306?text=${message}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
