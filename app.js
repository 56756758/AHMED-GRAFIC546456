document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Security Protections & Input Sanitization Helper
  // --------------------------------------------------------------------------
  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Prevent image drag hotlinking
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // --------------------------------------------------------------------------
  // 2. Header scroll effect & Mobile menu
  // --------------------------------------------------------------------------
  const header = document.getElementById('header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Scroll Reveal Observer
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // Active Navigation Link Highlighter
  // --------------------------------------------------------------------------
  const pathName = window.location.pathname;
  let pageName = pathName.split('/').pop() || 'index.html';
  if (pageName === '' || pageName === '/') pageName = 'index.html';

  document.querySelectorAll('#nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === pageName || (pageName === 'index.html' && (href === 'index.html' || href === '#home')))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --------------------------------------------------------------------------
  // 4. Dark / Light Theme Toggle & Persistence
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeIcon) {
    themeIcon.className = savedTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  if (themeToggleBtn && themeIcon) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeIcon.className = newTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
  }

  // --------------------------------------------------------------------------
  // 5. Language Switcher (Arabic <-> English) & Persistence
  // --------------------------------------------------------------------------
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langText = document.getElementById('lang-text');
  let currentLang = localStorage.getItem('lang') || 'ar';

  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    if (langText) langText.textContent = currentLang === 'ar' ? 'EN' : 'عربي';

    document.querySelectorAll('[data-ar]').forEach(el => {
      const text = el.getAttribute(`data-${currentLang}`);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });
  }

  // Apply saved language immediately on load
  applyLanguage(currentLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      localStorage.setItem('lang', newLang);
      applyLanguage(newLang);
    });
  }

  // --------------------------------------------------------------------------
  // 6. Portfolio Category Filter
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Portfolio Lightbox Modal (Supports Real Uploaded Images)
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxBtns = document.querySelectorAll('.lightbox-btn');

  lightboxBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      const imgSrc = btn.getAttribute('data-img');

      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      if (lightboxImg && imgSrc) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = title;
      }

      if (lightboxModal) lightboxModal.classList.add('active');
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  // --------------------------------------------------------------------------
  // 8. Before / After CTR Comparison Slider
  // --------------------------------------------------------------------------
  const baSlider = document.getElementById('ba-slider');
  const baBefore = document.querySelector('.ba-before');
  const baHandle = document.getElementById('ba-handle');

  if (baSlider && baBefore && baHandle) {
    let isDragging = false;

    const moveSlider = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percent = (x / rect.width) * 100;
      baBefore.style.width = `${percent}%`;
      baHandle.style.left = `${percent}%`;
    };

    baSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile
    baSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging) moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // --------------------------------------------------------------------------
  // 9. Currency Switcher (EGP <-> USD)
  // --------------------------------------------------------------------------
  const currBtns = document.querySelectorAll('.curr-btn');
  let currentCurrency = 'egp';

  currBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCurrency = btn.getAttribute('data-curr');

      // Update price elements
      document.querySelectorAll('.price-val').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentCurrency}`);
      });
      document.querySelectorAll('.price-unit').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentCurrency}`);
      });

      // Recalculate estimator total
      updateEstimator();
    });
  });

  // --------------------------------------------------------------------------
  // 10. Cost Estimator Calculator Logic
  // --------------------------------------------------------------------------
  const calcService = document.getElementById('calc-service');
  const calcQty = document.getElementById('calc-qty');
  const calcTotalVal = document.getElementById('calc-total-val');
  const calcTotalUnit = document.getElementById('calc-total-unit');
  const calcSubmitBtn = document.getElementById('calc-submit-btn');

  function updateEstimator() {
    if (!calcService || !calcQty || !calcTotalVal || !calcTotalUnit) return;

    const [egpPrice, usdPrice, serviceName] = calcService.value.split('|');
    const qty = parseInt(calcQty.value) || 1;

    const unitPrice = currentCurrency === 'egp' ? parseFloat(egpPrice) : parseFloat(usdPrice);
    const total = (unitPrice * qty).toFixed(currentCurrency === 'usd' ? 2 : 0);

    calcTotalVal.textContent = total;
    calcTotalUnit.textContent = currentCurrency === 'egp' ? 'ج.م' : '$';
  }

  if (calcService) calcService.addEventListener('change', updateEstimator);
  if (calcQty) calcQty.addEventListener('input', updateEstimator);

  if (calcSubmitBtn) {
    calcSubmitBtn.addEventListener('click', () => {
      const [egpPrice, usdPrice, serviceName] = calcService.value.split('|');
      const qty = calcQty.value;
      const total = calcTotalVal.textContent;
      const unit = calcTotalUnit.textContent;

      const message = `أهلاً بك، أرغب في طلب ${qty} ${serviceName} من موقع AHMED DESIGN.\nالتكلفة الإجمالية المقدرة: ${total} ${unit}.\nيرجى تأكيد البدء ورابط التفاصيل.`;
      const url = `https://wa.me/201289337306?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // --------------------------------------------------------------------------
  // 11. FAQ Accordion Toggle
  // --------------------------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 12. Quick Order Modal Popup & Secure Triggers
  // --------------------------------------------------------------------------
  const quickModal = document.getElementById('quick-order-modal');
  const quickModalClose = document.getElementById('quick-modal-close');
  const quickOrderForm = document.getElementById('quick-order-form');
  const modalServiceSelect = document.getElementById('modal-service-select');
  const modalClientName = document.getElementById('modal-client-name');
  const modalNotes = document.getElementById('modal-notes');

  const openQuickModalBtns = [
    document.getElementById('open-quick-modal-btn'),
    document.getElementById('hero-quick-order-btn'),
    document.getElementById('card-action-btn'),
    ...document.querySelectorAll('.quick-order-trigger'),
    ...document.querySelectorAll('.service-order-trigger')
  ];

  openQuickModalBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const service = btn.getAttribute('data-service');
        if (service && modalServiceSelect) {
          modalServiceSelect.value = service;
        }
        if (quickModal) quickModal.classList.add('active');
      });
    }
  });

  if (quickModalClose && quickModal) {
    quickModalClose.addEventListener('click', () => {
      quickModal.classList.remove('active');
    });
    quickModal.addEventListener('click', (e) => {
      if (e.target === quickModal) quickModal.classList.remove('active');
    });
  }

  // Anti-Spam Rate Limit Variable
  let lastSubmitTime = 0;

  if (quickOrderForm) {
    quickOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastSubmitTime < 3000) {
        alert('يرجى الانتظار بضع ثوانٍ قبل إرسال طلب آخر.');
        return;
      }
      lastSubmitTime = now;

      const rawName = modalClientName ? modalClientName.value : 'عميل';
      const rawNotes = modalNotes ? modalNotes.value : '';

      const name = sanitizeInput(rawName.trim());
      const service = modalServiceSelect ? modalServiceSelect.value : 'تصميم';
      const notes = sanitizeInput(rawNotes.trim());

      const message = `أهلاً بك، أنا ${name}.\nأرغب في طلب: ${service} من موقع AHMED DESIGN.\nتفاصيل الطلب: ${notes}\nسيتم الرد عليك في أقرب وقت.`;
      const url = `https://wa.me/201289337306?text=${encodeURIComponent(message)}`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
      quickModal.classList.remove('active');
      quickOrderForm.reset();
    });
  }
});
