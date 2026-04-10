/* ========================================
   Hudson Development LLC — Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile nav when link clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll reveal animations ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Form handling ----
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');

    // Build mailto link as fallback
    const subject = encodeURIComponent(`New Inquiry from ${name} — Hudson Development`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nService: ${service || 'Not specified'}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:hudsontetondev@gmail.com?subject=${subject}&body=${body}`;

    // Show success feedback
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Opening Email Client...';
    btn.style.background = '#2d8a4e';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });

  // ---- Select color fix ----
  const serviceSelect = document.getElementById('service');
  serviceSelect.addEventListener('change', () => {
    if (serviceSelect.value) {
      serviceSelect.style.color = '#0B1D3A';
    }
  });

});
