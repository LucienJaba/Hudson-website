/* ========================================
   Hudson Development LLC — Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STILL = document.documentElement.classList.contains('still');

  // ---- Hero load-in ----
  const hero = document.getElementById('hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('loaded'));
  }

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Parallax on hero topo ----
  const heroTopo = document.querySelector('.hero-topo');
  if (heroTopo && !reduceMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroTopo.style.transform = `translateY(${y * 0.18}px)`;
      }
    }, { passive: true });
  }

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const setHamburger = (open) => {
    const spans = navToggle.querySelectorAll('span');
    navToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  };

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('active');
    setHamburger(open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      setHamburger(false);
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll reveal (with stagger inside grids) ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.services-grid, .process-grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.setProperty('--stagger', `${i * 0.07}s`);
    });
  });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---- Animated counters ----
  const counters = document.querySelectorAll('.count');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterObserver.unobserve(el);
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      if (reduceMotion || STILL) { el.textContent = target + suffix; return; }
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(eased * target);
        el.textContent = p < 1 ? String(val) : target + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  // ---- Magnetic buttons ----
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${mx * 0.18}px, ${my * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ---- Form handling (Formspree) ----
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(r => {
      if (r.ok) {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#2d8a4e';
        btn.style.color = '#fff';
        form.reset();
      } else {
        btn.textContent = 'Error — Try Again';
        btn.style.background = '#a03030';
        btn.style.color = '#fff';
      }
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3000);
    }).catch(() => {
      btn.textContent = 'Error — Try Again';
      btn.style.background = '#a03030';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3000);
    });
  });

  const serviceSelect = document.getElementById('service');
  serviceSelect.addEventListener('change', () => {
    if (serviceSelect.value) serviceSelect.style.color = '#0B1D3A';
  });

  // ====================================================
  // Chat Widget: Hudson the Goose
  // ====================================================
  const chatWidget = document.getElementById('chatWidget');
  const chatLauncher = document.getElementById('chatLauncher');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatQuickReplies = document.getElementById('chatQuickReplies');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSend');
  const chatInputForm = document.getElementById('chatInputForm');

  const gooseAvatarSVG = `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 40C14 32 22 28 32 28C44 28 52 32 54 38C56 44 50 48 38 48C22 48 14 46 14 40Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M14 38L8 34M14 40L6 40M14 42L8 46" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M44 28C44 18 48 12 52 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="52" cy="10" r="4" stroke="currentColor" stroke-width="2.5"/>
      <path d="M56 10L60 11L56 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="53" cy="9" r="0.9" fill="currentColor"/>
      <path d="M28 36C32 32 40 32 46 36" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M28 48L28 56M38 48L38 56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M25 56L31 56M35 56L41 56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  const chatFAQ = {
    services: {
      label: 'What services do you offer?',
      reply: `We're a full-service contractor — general contracting and carpentry, roofing, interior and exterior painting, deck staining, waterproofing, and pressure washing. We also build <strong>websites and AI solutions</strong> for local businesses. Want details on any of it?`,
      next: ['painting', 'roofing', 'digital', 'property', 'estimate']
    },
    painting: {
      label: 'Painting',
      reply: `Painting is in our blood — 12+ years of it. Premium interior and exterior work with expert color consultation, built to handle Teton Valley's UV and freeze-thaw. Want a free estimate?`,
      next: ['estimate', 'area', 'services']
    },
    roofing: {
      label: 'Roofing',
      reply: `Full roof replacements built for heavy snow loads. Want me to set up a free estimate?`,
      next: ['estimate', 'area', 'services']
    },
    digital: {
      label: 'Websites & AI',
      reply: `Yep — same builder, modern toolset. We make fast websites, set up <strong>AI assistants</strong> (like me!), and automate the busywork for local businesses — scheduling, follow-ups, reviews, invoicing. Want to talk about your business?`,
      next: ['estimate', 'contact', 'services']
    },
    security: {
      label: 'Security cameras',
      reply: `We install, sync, and troubleshoot Ring, Nest, Arlo, and Blink systems — with ongoing support if the tech side isn't your thing.`,
      next: ['estimate', 'services']
    },
    area: {
      label: 'Where do you work?',
      reply: `Teton Valley, Idaho and Jackson, Wyoming — Driggs, Victor, Tetonia, and the surrounding areas. Not sure if you're in range? Just ask.`,
      next: ['estimate', 'services']
    },
    story: {
      label: 'Who is Hudson?',
      reply: `Hudson Development is a <strong>fourth-generation builder</strong> — great-grandfather, grandfather, and stepfather all built before me. "Hudson" is the family middle name, and "Goose" is the nickname my grandfather gave me. New to the valley, not new to the work.`,
      next: ['services', 'digital', 'estimate']
    },
    pricing: {
      label: 'How much does it cost?',
      reply: `Every project is different, so we give free, honest estimates after we understand the scope. No pressure, no hidden fees. Want to set one up?`,
      next: ['estimate', 'contact']
    },
    estimate: {
      label: 'Get a free estimate',
      reply: `Happy to help! Let me grab a few quick details so we can call or text you back fast. <strong>What's your name?</strong>`,
      next: [],
      action: 'startLeadCapture'
    },
    storm: {
      label: 'Storm repair',
      reply: `We're <strong>hail and wind damage specialists</strong>. We handle insurance claims end-to-end and can usually get a free roof inspection scheduled within 48 hours. Want me to set one up?`,
      next: ['estimate', 'services']
    },
    property: {
      label: 'Property management',
      reply: `We manage vacation homes, rentals, and second homes across Teton Valley and Jackson — single point of contact, vendor coordination, emergency response. Want to talk about your property?`,
      next: ['estimate', 'contact']
    },
    contact: {
      label: 'Contact info',
      reply: `Reach us anytime:<br>Phone: <a href="tel:+12086718686">(208) 671-8686</a><br>Email: <a href="mailto:hudsontetondev@gmail.com">hudsontetondev@gmail.com</a><br>Instagram: <a href="https://www.instagram.com/hudsontetondev" target="_blank" rel="noopener">@hudsontetondev</a>`,
      next: ['estimate', 'services']
    },
    insured: {
      label: 'Are you insured?',
      reply: `Yes — fully licensed and insured. We can share documentation on request.`,
      next: ['estimate', 'services']
    }
  };

  const defaultQuickReplies = ['services', 'estimate', 'digital', 'story', 'storm'];

  let chatStarted = false;

  const leadState = { step: 'idle', data: { name: '', contact: '', service: '', time: '' } };
  const SERVICE_OPTIONS = ['Roofing', 'Painting', 'Property Mgmt', 'Website / AI Solutions', 'General Contracting', 'Other'];
  const TIME_OPTIONS = ['Morning', 'Midday', 'Afternoon', 'Evening'];

  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    if (sender === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'chat-msg-avatar';
      avatar.innerHTML = gooseAvatarSVG;
      msg.appendChild(avatar);
    }
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    bubble.innerHTML = text;
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  function showTyping() {
    const msg = document.createElement('div');
    msg.className = 'chat-message bot chat-typing';
    msg.innerHTML = `
      <div class="chat-msg-avatar">${gooseAvatarSVG}</div>
      <div class="chat-msg-bubble">
        <span class="chat-typing-dot"></span><span class="chat-typing-dot"></span><span class="chat-typing-dot"></span>
      </div>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  function renderQuickReplies(keys) {
    chatQuickReplies.innerHTML = '';
    keys.forEach(key => {
      const item = chatFAQ[key];
      if (!item) return;
      const btn = document.createElement('button');
      btn.className = 'chat-quick-reply';
      btn.textContent = item.label;
      btn.addEventListener('click', () => handleQuickReply(key));
      chatQuickReplies.appendChild(btn);
    });
  }

  function renderTextChips(labels, onPick) {
    chatQuickReplies.innerHTML = '';
    labels.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'chat-quick-reply';
      btn.textContent = label;
      btn.addEventListener('click', () => onPick(label));
      chatQuickReplies.appendChild(btn);
    });
  }

  function setChatInputEnabled(enabled, placeholder) {
    chatInput.disabled = !enabled;
    chatSendBtn.disabled = !enabled;
    if (placeholder) chatInput.placeholder = placeholder;
    if (enabled) setTimeout(() => chatInput.focus(), 50);
  }

  function handleQuickReply(key) {
    const item = chatFAQ[key];
    if (!item) return;
    appendMessage(item.label, 'user');
    chatQuickReplies.innerHTML = '';
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      appendMessage(item.reply, 'bot');
      if (item.action === 'startLeadCapture') { startLeadCapture(); return; }
      renderQuickReplies(item.next && item.next.length ? item.next : defaultQuickReplies);
    }, 650);
  }

  function startLeadCapture() {
    leadState.step = 'awaiting_name';
    leadState.data = { name: '', contact: '', service: '', time: '' };
    setChatInputEnabled(true, 'Type your name…');
  }

  function botSay(text, after) {
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      appendMessage(text, 'bot');
      if (typeof after === 'function') after();
    }, 600);
  }

  function handleLeadInput(text) {
    const value = (text || '').trim();
    if (!value) return;
    appendMessage(value, 'user');
    chatInput.value = '';

    if (leadState.step === 'awaiting_name') {
      leadState.data.name = value;
      leadState.step = 'awaiting_contact';
      setChatInputEnabled(true, 'Phone or email…');
      botSay(`Nice to meet you, <strong>${escapeHTML(value)}</strong>! What's the best <strong>phone or email</strong> to reach you?`);
      return;
    }
    if (leadState.step === 'awaiting_contact') {
      leadState.data.contact = value;
      leadState.step = 'awaiting_service';
      setChatInputEnabled(false);
      botSay(`Got it. Which service are you interested in?`, () => renderTextChips(SERVICE_OPTIONS, pickService));
      return;
    }
  }

  function pickService(label) {
    appendMessage(label, 'user');
    chatQuickReplies.innerHTML = '';
    leadState.data.service = label;
    leadState.step = 'awaiting_time';
    botSay(`Perfect. When's the best time for us to call you back?`, () => renderTextChips(TIME_OPTIONS, pickTime));
  }

  function pickTime(label) {
    appendMessage(label, 'user');
    chatQuickReplies.innerHTML = '';
    leadState.data.time = label;
    leadState.step = 'complete';
    completeLeadCapture();
  }

  function completeLeadCapture() {
    const d = leadState.data;
    const summary = `
      Awesome &mdash; here's what I've got:<br>
      <strong>Name:</strong> ${escapeHTML(d.name)}<br>
      <strong>Contact:</strong> ${escapeHTML(d.contact)}<br>
      <strong>Service:</strong> ${escapeHTML(d.service)}<br>
      <strong>Best time:</strong> ${escapeHTML(d.time)}<br><br>
      Tap the button below to send this straight to Hudson Development. We'll be in touch within 24 hours.`;
    botSay(summary, () => {
      const subject = `New Lead from Chatbot — ${d.name}`;
      const body =
        `New chatbot lead:\n\nName: ${d.name}\nContact: ${d.contact}\nService: ${d.service}\nBest callback time: ${d.time}\n\nSubmitted from hudsontetondev.com chatbot.`;
      const mailto = `mailto:hudsontetondev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.__lastLeadMailto = mailto;

      chatQuickReplies.innerHTML = '';
      const sendBtn = document.createElement('a');
      sendBtn.className = 'chat-quick-reply chat-send-lead';
      sendBtn.textContent = 'Send to Hudson';
      sendBtn.href = mailto;
      chatQuickReplies.appendChild(sendBtn);

      const restartBtn = document.createElement('button');
      restartBtn.className = 'chat-quick-reply';
      restartBtn.textContent = 'Start over';
      restartBtn.addEventListener('click', () => {
        leadState.step = 'idle';
        renderQuickReplies(defaultQuickReplies);
      });
      chatQuickReplies.appendChild(restartBtn);
      leadState.step = 'idle';
    });
  }

  function escapeHTML(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function startChatIfNeeded() {
    if (chatStarted) return;
    chatStarted = true;
    setTimeout(() => {
      appendMessage(`Hi, I'm <strong>Hudson the Goose</strong> &mdash; <em>the goose is loose!</em> I can tell you about our trades, websites &amp; AI work, property management, or get a free estimate started. What can I help with?`, 'bot');
      renderQuickReplies(defaultQuickReplies);
    }, 250);
  }

  function openChat() {
    chatWidget.classList.add('open');
    chatPanel.setAttribute('aria-hidden', 'false');
    startChatIfNeeded();
  }
  function closeChat() {
    chatWidget.classList.remove('open');
    chatPanel.setAttribute('aria-hidden', 'true');
  }

  chatLauncher.addEventListener('click', () => {
    chatWidget.classList.contains('open') ? closeChat() : openChat();
  });
  chatClose.addEventListener('click', closeChat);
  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.disabled) return;
    handleLeadInput(chatInput.value);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWidget.classList.contains('open')) closeChat();
  });

  // ====================================================
  // Lightbox for the Our Work gallery
  // ====================================================
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = document.getElementById('lbImg');
    const lbCap = document.getElementById('lbCap');
    const tiles = Array.from(document.querySelectorAll('.work-tile'));
    const items = tiles.map(t => {
      const img = t.querySelector('img');
      const tag = t.querySelector('.work-tag');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', cap: tag ? tag.textContent : '' };
    });
    let current = 0;

    const show = (i) => {
      current = (i + items.length) % items.length;
      const it = items[current];
      lbImg.src = it.src;
      lbImg.alt = it.alt;
      lbCap.textContent = it.cap;
    };
    const open = (i) => { show(i); lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); };
    const close = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); };

    tiles.forEach((t, i) => t.addEventListener('click', () => open(i)));
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbNext').addEventListener('click', () => show(current + 1));
    document.getElementById('lbPrev').addEventListener('click', () => show(current - 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

});
