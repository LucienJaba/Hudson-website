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

  // ---- Chat Widget: Hudson the Goose ----
  const chatWidget = document.getElementById('chatWidget');
  const chatLauncher = document.getElementById('chatLauncher');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatQuickReplies = document.getElementById('chatQuickReplies');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSend');
  const chatInputForm = document.getElementById('chatInputForm');

  // Goose avatar SVG (reused for bot message bubbles)
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

  // FAQ knowledge base — keyed quick replies and their responses
  const chatFAQ = {
    services: {
      label: 'What services do you offer?',
      reply: `We're a full-service contractor — general contracting and carpentry, roof replacements, interior and exterior painting, deck staining, wood and surface waterproofing, seasonal property care (pressure washing, gutter and snow), security camera installation (Ring, Nest, Arlo, Blink), and AI and smart-tech help. Want details on any one?`,
      next: ['painting', 'roofing', 'security', 'concierge', 'estimate']
    },
    painting: {
      label: 'Painting',
      reply: `Premium interior and exterior painting with expert color consultation. Built to handle Teton Valley's UV and freeze-thaw. Want a free estimate?`,
      next: ['estimate', 'area', 'services']
    },
    roofing: {
      label: 'Roofing',
      reply: `Full roof replacements built for heavy snow loads and mountain weather. Fully insured, licensed, and warranty-backed. Want me to set up a free estimate?`,
      next: ['estimate', 'area', 'services']
    },
    security: {
      label: 'Security cameras',
      reply: `We install, sync, and troubleshoot Ring, Nest, Arlo, and Blink systems — including ongoing support if you're not into the tech side.`,
      next: ['estimate', 'services']
    },
    concierge: {
      label: 'Concierge service',
      reply: `Need something outside our core trades? We've built a vetted network of Teton Valley pros — hot tub maintenance, house cleaning, landscaping, builders, realtors, property management. One call connects you to the right person.`,
      next: ['contact', 'services']
    },
    area: {
      label: 'Where do you work?',
      reply: `Teton Valley, Idaho and surrounding areas — Driggs, Victor, Tetonia, and nearby. If you're not sure, just ask!`,
      next: ['estimate', 'services']
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
      label: 'Storm Repair',
      reply: `We're <strong>hail and wind damage specialists</strong>. We handle insurance claims end-to-end and can usually get a free roof inspection scheduled within 48 hours. Want me to set one up?`,
      next: ['estimate', 'services']
    },
    property: {
      label: 'Property Management',
      reply: `We manage vacation homes, rentals, and second homes across Teton Valley and Jackson — single point of contact, vendor coordination, emergency response. Want to talk about your property?`,
      next: ['estimate', 'contact']
    },
    contact: {
      label: 'Contact info',
      reply: `Reach us anytime:<br>Email: <a href="mailto:hudsontetondev@gmail.com">hudsontetondev@gmail.com</a><br>Phone: <a href="tel:+12086718686">(208) 671-8686</a><br>Instagram: <a href="https://www.instagram.com/hudsontetondev" target="_blank" rel="noopener">@hudsontetondev</a>`,
      next: ['estimate', 'services']
    },
    insured: {
      label: 'Are you insured?',
      reply: `Yes — fully licensed and insured in Idaho. We can share documentation on request.`,
      next: ['estimate', 'services']
    }
  };

  // Default starting quick replies
  const defaultQuickReplies = ['services', 'estimate', 'storm', 'property', 'area'];

  let chatStarted = false;

  // ---- Lead capture state machine ----
  // Steps: idle → awaiting_name → awaiting_contact → awaiting_service → awaiting_time → complete
  const leadState = {
    step: 'idle',
    data: { name: '', contact: '', service: '', time: '' }
  };

  const SERVICE_OPTIONS = [
    'Roofing & Storm Restoration',
    'Painting',
    'Property Management',
    'General Contracting',
    'Other'
  ];
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
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
      </div>
    `;
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

  // Render free-text chips (used for service / time picks during lead capture)
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
    if (enabled) {
      setTimeout(() => chatInput.focus(), 50);
    }
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

      if (item.action === 'startLeadCapture') {
        startLeadCapture();
        return;
      }

      renderQuickReplies(item.next && item.next.length ? item.next : defaultQuickReplies);
    }, 650);
  }

  // ---- Lead capture flow ----
  function startLeadCapture() {
    leadState.step = 'awaiting_name';
    leadState.data = { name: '', contact: '', service: '', time: '' };
    setChatInputEnabled(true, 'Type your name...');
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
      setChatInputEnabled(true, 'Phone or email...');
      botSay(`Nice to meet you, <strong>${escapeHTML(value)}</strong>! What's the best <strong>phone or email</strong> to reach you?`);
      return;
    }

    if (leadState.step === 'awaiting_contact') {
      leadState.data.contact = value;
      leadState.step = 'awaiting_service';
      setChatInputEnabled(false);
      botSay(`Got it. Which service are you interested in?`, () => {
        renderTextChips(SERVICE_OPTIONS, pickService);
      });
      return;
    }
  }

  function pickService(label) {
    appendMessage(label, 'user');
    chatQuickReplies.innerHTML = '';
    leadState.data.service = label;
    leadState.step = 'awaiting_time';
    botSay(`Perfect. When's the best time for us to call you back?`, () => {
      renderTextChips(TIME_OPTIONS, pickTime);
    });
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
      Tap the button below to send this straight to Hudson Development. We'll be in touch within 24 hours.
    `;
    botSay(summary, () => {
      const subject = `New Lead from Chatbot — ${d.name}`;
      const body =
        `New chatbot lead:\n\n` +
        `Name: ${d.name}\n` +
        `Contact: ${d.contact}\n` +
        `Service: ${d.service}\n` +
        `Best callback time: ${d.time}\n\n` +
        `Submitted from hudsontetondev.com chatbot.`;
      const mailto = `mailto:hudsontetondev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Save the constructed mailto for verification + provide a button to send.
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
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function startChatIfNeeded() {
    if (chatStarted) return;
    chatStarted = true;
    setTimeout(() => {
      appendMessage(`Hi, I'm <strong>Hudson the Goose</strong> &mdash; <em>the goose is loose</em>! I can answer questions about our services, storm restoration, property management, or get a free estimate started for you. What can I help with?`, 'bot');
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
    if (chatWidget.classList.contains('open')) {
      closeChat();
    } else {
      openChat();
    }
  });

  chatClose.addEventListener('click', closeChat);

  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.disabled) return;
    handleLeadInput(chatInput.value);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWidget.classList.contains('open')) {
      closeChat();
    }
  });

});
