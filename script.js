/* ======================================================
   ARIES WEBS — Interactive Script
   Scroll animations, counter, navigation, form handling
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // ============ NAVBAR SCROLL EFFECT ============
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Navbar glassmorphism on scroll
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (scrollY > 500) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Scroll to top click
  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============ MOBILE NAV TOGGLE ============
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ============ SCROLL REVEAL ANIMATIONS ============
  const revealElements = document.querySelectorAll('.reveal, .reveal-child');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for children
        if (entry.target.classList.contains('reveal-child')) {
          const parent = entry.target.parentElement;
          const siblings = parent.querySelectorAll('.reveal-child');
          const childIndex = Array.from(siblings).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('active');
          }, childIndex * 120);
        } else {
          entry.target.classList.add('active');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============ ANIMATED COUNTERS ============
  const counterElements = document.querySelectorAll('[data-count]');
  let countersAnimated = new Set();

  const animateCounter = (el) => {
    if (countersAnimated.has(el)) return;
    countersAnimated.add(el);

    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.textContent.replace(/[0-9]/g, '');
    const duration = 2000;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.floor(easedProgress * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  // ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============ ACTIVE NAV LINK HIGHLIGHT ============
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.querySelectorAll('a:not(.nav-cta)').forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--blue-600)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ============ CONTACT FORM HANDLING ============
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;

    // Show success state
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Message Sent!
    `;
    btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    btn.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.35)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.boxShadow = '';
      contactForm.reset();
      // Re-init icons after replacing innerHTML
      lucide.createIcons();
    }, 3000);
  });

  // ============ TILT EFFECT ON SERVICE CARDS ============
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;

      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============ PARALLAX ON HERO ORBS ============
  const orbs = document.querySelectorAll('.hero-orb');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 12;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  }, { passive: true });

  // ============ MAGNETIC BUTTON EFFECT ============
  const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ============ TYPING EFFECT ON HERO (subtle) ============
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';

    setTimeout(() => {
      heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 200);
  }

  // Hero content stagger entrance
  const heroItems = document.querySelectorAll('.hero-badge, .hero-description, .hero-actions, .hero-stats');
  heroItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(25px)';
    setTimeout(() => {
      item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 400 + i * 200);
  });

  // Hero visual entrance
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateX(40px) scale(0.95)';
    setTimeout(() => {
      heroVisual.style.transition = 'opacity 1s ease, transform 1s ease';
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateX(0) scale(1)';
    }, 600);
  }
});
