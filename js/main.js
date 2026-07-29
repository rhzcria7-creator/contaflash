/* =========================================
   ContaFlash - JavaScript Principal
   Suporte Autônomo Interativo & Stripe Checkout
   ========================================= */

// ==========================================
// Configurações Globais
// ==========================================
const WHATSAPP_PHONE = '5531982924858';
const INSTAGRAM_HANDLE = 'contaf1sh';
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01';
const CHAT_API_URL = '/api/chat'; // Endpoint da IA vendedora

// Session ID único por visitante (persiste no localStorage)
function getChatSessionId() {
  let sid = localStorage.getItem('cf-chat-session');
  if (!sid) {
    sid = 'cf-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    localStorage.setItem('cf-chat-session', sid);
  }
  return sid;
}

// Histórico da conversa (mantido em memória)
const chatHistory = [];

// Registro Autônomo de Estoque de Produtos (Apenas 1 Mês Pago - Não Assinaturas)
const STOCK_DATA = {
  'chatgpt-plus': {
    id: 'chatgpt-plus',
    title: 'ChatGPT Plus (1 Mês de Acesso)',
    category: 'ferramentas',
    badge: '🔥 14 unidades em estoque',
    price: 'R$ 29,90',
    originalPrice: 'R$ 50,00',
    discount: '40% OFF',
    stock: 14,
    inStock: true,
    icon: '🤖',
    stripeUrl: STRIPE_CHECKOUT_URL,
    detailUrl: 'pages/produto-chatgpt.html',
    description: 'Conta individual pronta com 1 Mês de ChatGPT Plus ativado. Acesso total ao GPT-4, GPT-4o, DALL-E 3 e análise avançada.',
    features: [
      'Acesso ao GPT-4 e GPT-4o liberado',
      'Geração de Imagens DALL-E 3',
      '1 Mês Pago Sem cobrança recorrente',
      'Ativação imediata no WhatsApp ou Stripe',
      'Garantia de 30 dias'
    ]
  },
  'netflix-4k': {
    id: 'netflix-4k',
    title: 'Netflix Premium 4K (1 Mês)',
    category: 'streaming',
    badge: '🚫 Esgotado',
    price: 'R$ 19,90',
    stock: 0,
    inStock: false,
    icon: '📺',
    detailUrl: 'pages/produtos.html'
  },
  'spotify-premium': {
    id: 'spotify-premium',
    title: 'Spotify Premium (1 Mês)',
    category: 'musica',
    badge: '🚫 Esgotado',
    price: 'R$ 9,90',
    stock: 0,
    inStock: false,
    icon: '🎵',
    detailUrl: 'pages/produtos.html'
  },
  'disney-plus': {
    id: 'disney-plus',
    title: 'Disney+ Premium (1 Mês)',
    category: 'streaming',
    badge: '🚫 Esgotado',
    price: 'R$ 14,90',
    stock: 0,
    inStock: false,
    icon: '🏰',
    detailUrl: 'pages/produtos.html'
  },
  'xbox-gamepass': {
    id: 'xbox-gamepass',
    title: 'Xbox Game Pass Ultimate (1 Mês)',
    category: 'jogos',
    badge: '🚫 Esgotado',
    price: 'R$ 24,90',
    stock: 0,
    inStock: false,
    icon: '🎮',
    detailUrl: 'pages/produtos.html'
  },
  'midjourney-pro': {
    id: 'midjourney-pro',
    title: 'Midjourney Pro (1 Mês)',
    category: 'ferramentas',
    badge: '🚫 Esgotado',
    price: 'R$ 34,90',
    stock: 0,
    inStock: false,
    icon: '🎨',
    detailUrl: 'pages/produtos.html'
  },
  'hbo-max': {
    id: 'hbo-max',
    title: 'Max (HBO Max) (1 Mês)',
    category: 'streaming',
    badge: '🚫 Esgotado',
    price: 'R$ 14,90',
    stock: 0,
    inStock: false,
    icon: '🎬',
    detailUrl: 'pages/produtos.html'
  },
  'canva-pro': {
    id: 'canva-pro',
    title: 'Canva Pro (1 Mês)',
    category: 'produtividade',
    badge: '🚫 Esgotado',
    price: 'R$ 12,90',
    stock: 0,
    inStock: false,
    icon: '🎯',
    detailUrl: 'pages/produtos.html'
  },
  'deezer-premium': {
    id: 'deezer-premium',
    title: 'Deezer Premium (1 Mês)',
    category: 'musica',
    badge: '🚫 Esgotado',
    price: 'R$ 8,90',
    stock: 0,
    inStock: false,
    icon: '🎧',
    detailUrl: 'pages/produtos.html'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initParticles();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initFadeInAnimations();
  initCounterAnimations();
  initTestimonialSlider();
  initWhatsAppVIPForm();
  initContactForm();
  initFAQAccordion();
  initFAQSearch();
  initProductFilters();
  initWhatsAppTooltip();
  initCookieModal();
  initPhoneMask();
  initStripeCheckout();
  initStockManager();
  initSuporteChat();
});

// ==========================================
// Stock Manager (Autônomo)
// ==========================================
function initStockManager() {
  const productCards = document.querySelectorAll('.product-card[data-product-id]');
  productCards.forEach(card => {
    const productId = card.getAttribute('data-product-id');
    const product = STOCK_DATA[productId];

    if (product) {
      const badgeEl = card.querySelector('.product-badge');
      const btnEl = card.querySelector('.btn-buy-action');
      const imageEl = card.querySelector('.product-image');

      // Produtos sem estoque exibem automaticamente o banner ContaFlash
      if (imageEl && !product.inStock && !imageEl.querySelector('.stock-banner')) {
        imageEl.innerHTML = `
          <div class="stock-banner">
            <i class="fas fa-bolt"></i>
            <div class="stock-banner-word">Conta<span>Flash</span></div>
          </div>`;
        imageEl.style.padding = '0';
      }

      if (badgeEl) {
        badgeEl.textContent = product.badge;
        if (product.inStock) {
          badgeEl.className = 'product-badge badge-instock';
        } else {
          badgeEl.className = 'product-badge badge-outstock';
        }
      }

      if (btnEl) {
        if (product.inStock) {
          btnEl.innerHTML = `<i class="fab fa-stripe-s"></i> Compre Agora e Receba Desconto`;
          btnEl.className = 'btn btn-primary btn-buy-stripe';
          btnEl.setAttribute('data-product', product.title);
          btnEl.setAttribute('data-price', product.price);
          btnEl.setAttribute('data-stripe-url', product.stripeUrl);
        } else {
          btnEl.innerHTML = `<i class="fas fa-bell"></i> Esgotado - Falar com Suporte`;
          btnEl.className = 'btn btn-disabled btn-notify-suporte';
          btnEl.setAttribute('data-product', product.title);
        }
      }
    }
  });

  // Handle Out of Stock Notify click
  document.addEventListener('click', (e) => {
    const notifyBtn = e.target.closest('.btn-notify-suporte');
    if (notifyBtn) {
      e.preventDefault();
      const prodName = notifyBtn.getAttribute('data-product') || 'Produto';
      openSuporteChatWithQuestion(`Quando o produto ${prodName} voltará ao estoque?`);
    }
  });
}

// ==========================================
// Suporte Autônomo Chat Engine (API IA Vendedora)
// ==========================================
function initSuporteChat() {
  if (!document.getElementById('suporteWidgetBtn')) {
    const chatHTML = `
      <div class="suporte-widget-btn" id="suporteWidgetBtn" title="Atendimento de Suporte 24h">
        <span class="dot-online"></span>
        <span>💬 Suporte 24h</span>
      </div>

      <div class="suporte-chat-window" id="suporteChatWindow">
        <div class="suporte-chat-header">
          <div class="suporte-chat-title">
            <div class="suporte-chat-avatar">💬</div>
            <div>
              <div style="font-size:.92rem; font-weight:600; line-height:1.2;">ContaFlash AI</div>
              <div style="font-size:.74rem; opacity:.8;">Vendedora Online | Respostas Imediatas</div>
            </div>
          </div>
          <button class="suporte-chat-close" id="closeSuporteChat">&times;</button>
        </div>

        <div class="suporte-chat-messages" id="suporteChatMessages">
          <div class="suporte-msg suporte-msg-bot">
            Olá! Sou a vendedora da <strong>ContaFlash</strong>. Como posso te ajudar? 😊
          </div>
        </div>

        <div class="suporte-chat-chips">
          <button class="suporte-chip" data-query="chatgpt">⚡ Comprar ChatGPT Plus</button>
          <button class="suporte-chip" data-query="estoque">📦 Consultar Estoque</button>
          <button class="suporte-chip" data-query="garantia">🔒 Garantia de 30 Dias</button>
          <button class="suporte-chip" data-query="zap">💬 WhatsApp Direto</button>
        </div>

        <form class="suporte-chat-input-box" id="suporteChatForm">
          <input type="text" id="suporteChatInput" placeholder="Digite sua mensagem..." required autocomplete="off">
          <button type="submit" aria-label="Enviar"><i class="fas fa-paper-plane"></i></button>
        </form>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);
  }

  const widgetBtn = document.getElementById('suporteWidgetBtn');
  const chatWindow = document.getElementById('suporteChatWindow');
  const closeBtn = document.getElementById('closeSuporteChat');
  const chatForm = document.getElementById('suporteChatForm');
  const chatInput = document.getElementById('suporteChatInput');
  const messagesBox = document.getElementById('suporteChatMessages');

  if (widgetBtn && chatWindow) {
    widgetBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });
  }

  if (closeBtn && chatWindow) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

  // Quick Chips
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.suporte-chip');
    if (chip) {
      const queryType = chip.getAttribute('data-query');
      if (queryType === 'chatgpt') {
        sendToAI('Quero comprar o ChatGPT Plus com desconto.');
      } else if (queryType === 'estoque') {
        sendToAI('Quais produtos estão disponíveis no estoque agora?');
      } else if (queryType === 'garantia') {
        sendToAI('Como funciona a garantia do produto?');
      } else if (queryType === 'zap') {
        window.open(`https://wa.me/${WHATSAPP_PHONE}`, '_blank');
      }
    }
  });

  // Chat Form Submit
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) {
        sendToAI(text);
        chatInput.value = '';
      }
    });
  }

  // Envia mensagem pra API da IA
  async function sendToAI(userText) {
    appendChatMessage(sanitizeInput(userText), true);

    // Salva no histórico local
    chatHistory.push({ role: 'user', content: userText });

    // Mostra "Digitando..."
    const typingDiv = document.createElement('div');
    typingDiv.className = 'suporte-msg suporte-msg-bot';
    typingDiv.innerHTML = '<i>Digitando...</i>';
    messagesBox.appendChild(typingDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          sessionId: getChatSessionId(),
          conversationHistory: chatHistory.slice(-10)
        })
      });

      const data = await response.json();
      typingDiv.remove();

      const reply = data.reply || 'Desculpe, tive um problema. Fala comigo no WhatsApp: https://wa.me/5531982924858';
      appendChatMessage(reply, false);
      chatHistory.push({ role: 'assistant', content: reply });

    } catch (err) {
      typingDiv.remove();
      appendChatMessage('Erro de conexão. Tenta novamente ou fala no WhatsApp: https://wa.me/5531982924858', false);
      console.error('Chat API error:', err);
    }
  }

  function appendChatMessage(text, isUser = false) {
    if (!messagesBox) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `suporte-msg ${isUser ? 'suporte-msg-user' : 'suporte-msg-bot'}`;
    // Converte markdown simples (**, links)
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent-2);font-weight:600;">$1</a>')
      .replace(/\n/g, '<br>');
    msgDiv.innerHTML = html;
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }
}

function openSuporteChatWithQuestion(questionText) {
  const chatWindow = document.getElementById('suporteChatWindow');
  const chatInput = document.getElementById('suporteChatInput');

  if (chatWindow) chatWindow.classList.add('active');
  if (chatInput && questionText) {
    chatInput.value = questionText;
  }
}

// ==========================================
// Loading Screen
// ==========================================
function initLoadingScreen() {
  const loader = document.querySelector('.loading-screen');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  };

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 300));
    setTimeout(hideLoader, 1500);
  }
}

// ==========================================
// Particles
// ==========================================
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const particleCount = window.innerWidth < 768 ? 10 : 20;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 16 + 12;
    const delay = Math.random() * 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    const colors = [
      'rgba(23, 23, 23, 0.08)',
      'rgba(16, 163, 127, 0.16)',
      'rgba(23, 23, 23, 0.05)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    fragment.appendChild(particle);
  }

  container.appendChild(fragment);
}

// ==========================================
// Header Scroll Effect
// ==========================================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ==========================================
// Mobile Menu
// ==========================================
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ==========================================
// Smooth Scroll
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==========================================
// Fade-in Animations
// ==========================================
function initFadeInAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

    elements.forEach(el => {
      if (!el.classList.contains('visible')) {
        observer.observe(el);
      }
    });
  } else {
    elements.forEach(el => el.classList.add('visible'));
  }
}

// ==========================================
// Counter Animations
// ==========================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * easeOut);

    element.textContent = current.toLocaleString('pt-BR') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ==========================================
// Testimonial Slider
// ==========================================
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonials-slider');
  const dotsContainer = document.querySelector('.testimonials-dots');

  if (!slider) return;

  const slides = slider.querySelectorAll('.testimonial-card');
  if (!slides.length) return;

  let currentSlide = 0;
  let autoplayInterval = null;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Depoimento ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    slider.style.transform = `translateX(-${index * 100}%)`;

    const dots = dotsContainer?.querySelectorAll('.dot');
    dots?.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 4500);
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  startAutoplay();

  slider.parentElement?.addEventListener('mouseenter', stopAutoplay);
  slider.parentElement?.addEventListener('mouseleave', startAutoplay);

  let startX = 0;
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0 && currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      } else if (diffX < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
    startAutoplay();
  }, { passive: true });
}

// ==========================================
// WhatsApp VIP Club Form
// ==========================================
function initWhatsAppVIPForm() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const input = form.querySelector('input[name="phone"], input[type="tel"], input[type="text"]');
    const phone = input?.value.replace(/\D/g, '') || '';

    if (phone.length < 10) {
      showToast('Insira um WhatsApp válido com DDD.', 'error');
      return;
    }

    showToast('Inscrição no Clube VIP realizada! 🎉', 'success');
    input.value = '';

    const text = encodeURIComponent(`Olá! Quero entrar no Clube VIP ContaFlash para receber descontos e reposições de estoque.`);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank');
  });
}

// ==========================================
// Contact Form
// ==========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = form.querySelector('[name="name"]');
    const phoneEl = form.querySelector('[name="phone"]');
    const subjectEl = form.querySelector('[name="subject"]');
    const messageEl = form.querySelector('[name="message"]');

    const name = sanitizeInput(nameEl?.value.trim() || '');
    const phone = phoneEl?.value.replace(/\D/g, '') || '';
    const subject = subjectEl?.value || 'Outro';
    const message = sanitizeInput(messageEl?.value.trim() || '');

    let isValid = true;

    if (!name || name.length < 2) {
      setFieldError(nameEl, 'Insira seu nome completo');
      isValid = false;
    } else {
      setFieldSuccess(nameEl);
    }

    if (!phone || phone.length < 10) {
      setFieldError(phoneEl, 'Insira seu WhatsApp com DDD');
      isValid = false;
    } else {
      setFieldSuccess(phoneEl);
    }

    if (!message || message.length < 5) {
      setFieldError(messageEl, 'Mensagem muito curta');
      isValid = false;
    } else {
      setFieldSuccess(messageEl);
    }

    if (isValid) {
      showToast('Enviando para o Suporte Atendimento...', 'success');

      const text = encodeURIComponent(
        `⚡ *ATENDIMENTO DE SUPORTE CONTAFLASH*\n\n` +
        `👤 *Nome:* ${name}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `🏷️ *Assunto:* ${subject}\n` +
        `💬 *Mensagem:* ${message}`
      );

      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank');
        form.reset();
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error', 'success'));
      }, 800);
    }
  });
}

function setFieldError(field, message) {
  if (!field) return;
  const group = field.closest('.form-group');
  if (group) {
    group.classList.add('error');
    group.classList.remove('success');
    const errorEl = group.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = message;
  }
}

function setFieldSuccess(field) {
  if (!field) return;
  const group = field.closest('.form-group');
  if (group) {
    group.classList.remove('error');
    group.classList.add('success');
  }
}

function sanitizeInput(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================
// Stripe Checkout Integration
// ==========================================
function initStripeCheckout() {
  if (!document.getElementById('checkoutModalOverlay')) {
    const modalHTML = `
      <div class="checkout-modal-overlay" id="checkoutModalOverlay">
        <div class="checkout-modal">
          <button class="modal-close-btn" id="closeCheckoutModal" aria-label="Fechar">&times;</button>
          <div class="checkout-badge-stripe">
            <i class="fas fa-shield-alt"></i> Checkout Seguro via Stripe
          </div>

          <div class="checkout-product-header">
            <div class="checkout-product-icon" id="modalProductIcon">🤖</div>
            <div class="checkout-product-info">
              <h3 id="modalProductName">ChatGPT Plus (1 Mês de Acesso)</h3>
              <p id="modalProductPrice">R$ 29,90</p>
            </div>
          </div>

          <div class="checkout-security-box">
            <i class="fas fa-lock"></i>
            <span>Pagamento Único processado pela Stripe (PIX / Cartão com desconto imediato).</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:.75rem; margin-top:1.2rem;">
            <a href="${STRIPE_CHECKOUT_URL}" target="_blank" rel="noopener" class="btn btn-stripe btn-lg" style="justify-content:center; width:100%;">
              <i class="fab fa-stripe-s"></i> Ir Direto para o Stripe Checkout
            </a>

            <button type="button" id="buyDirectWhatsApp" class="btn btn-whatsapp" style="justify-content:center; width:100%;">
              <i class="fab fa-whatsapp"></i> Comprar pelo WhatsApp Direct
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modalOverlay = document.getElementById('checkoutModalOverlay');
  const closeBtn = document.getElementById('closeCheckoutModal');
  const buyWaBtn = document.getElementById('buyDirectWhatsApp');

  let activeProduct = { name: 'ChatGPT Plus', price: 'R$ 29,90' };

  document.addEventListener('click', (e) => {
    const buyBtn = e.target.closest('.btn-buy-stripe');
    if (buyBtn) {
      e.preventDefault();
      const directStripeUrl = buyBtn.getAttribute('data-stripe-url') || STRIPE_CHECKOUT_URL;

      if (directStripeUrl) {
        window.open(directStripeUrl, '_blank');
      } else {
        activeProduct.name = buyBtn.getAttribute('data-product') || 'ChatGPT Plus';
        activeProduct.price = buyBtn.getAttribute('data-price') || 'R$ 29,90';
        document.getElementById('modalProductName').textContent = activeProduct.name;
        document.getElementById('modalProductPrice').textContent = activeProduct.price;
        modalOverlay.classList.add('active');
      }
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (buyWaBtn) {
    buyWaBtn.addEventListener('click', () => {
      const text = encodeURIComponent(
        `Olá! Quero comprar a conta pronta do *ChatGPT Plus (1 Mês de Acesso)* no valor de R$ 29,90.`
      );
      modalOverlay.classList.remove('active');
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank');
    });
  }
}

// ==========================================
// FAQ Accordion
// ==========================================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ==========================================
// FAQ Search
// ==========================================
function initFAQSearch() {
  const searchInput = document.querySelector('.faq-search input');
  if (!searchInput) return;

  const faqItems = document.querySelectorAll('.faq-item');
  const noResults = document.querySelector('.faq-no-results');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
      const answer = item.querySelector('.faq-answer-inner')?.textContent.toLowerCase() || '';

      if (question.includes(query) || answer.includes(query)) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

// ==========================================
// Product Filters
// ==========================================
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.classList.add('visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================
// WhatsApp Tooltip
// ==========================================
function initWhatsAppTooltip() {
  const float = document.querySelector('.whatsapp-float');
  if (!float) return;

  const tooltip = float.querySelector('.whatsapp-tooltip');
  if (!tooltip) return;

  setTimeout(() => {
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';

    setTimeout(() => {
      tooltip.style.opacity = '';
      tooltip.style.visibility = '';
    }, 4000);
  }, 2500);
}

// ==========================================
// Cookie Modal
// ==========================================
function initCookieModal() {
  if (localStorage.getItem('contaflash-cookies-accepted')) return;

  const modal = document.querySelector('.cookie-modal');
  if (!modal) return;

  setTimeout(() => {
    modal.classList.add('show');
  }, 1800);

  const acceptBtn = modal.querySelector('.cookie-accept');
  const rejectBtn = modal.querySelector('.cookie-reject');

  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem('contaflash-cookies-accepted', 'true');
    modal.classList.remove('show');
    showToast('Cookies aceitos com sucesso!', 'success');
  });

  rejectBtn?.addEventListener('click', () => {
    localStorage.setItem('contaflash-cookies-accepted', 'rejected');
    modal.classList.remove('show');
  });
}

// ==========================================
// Phone Mask
// ==========================================
function initPhoneMask() {
  document.querySelectorAll('input[name="phone"], input[type="tel"]').forEach(phoneInput => {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }

      e.target.value = value;
    });
  });
}

// ==========================================
// Toast Notifications
// ==========================================
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.classList.add('toast', type);

  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation'
  };

  toast.innerHTML = `
    <i class="${icons[type] || icons.success} toast-icon"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.35s forwards';
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}
