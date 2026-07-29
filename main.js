/* =========================================
   ContaFlash - JavaScript Principal
   Suporte Autônomo Interativo & Stripe Checkout
   ========================================= */

// Configurações Globais
const WHATSAPP_PHONE = '5531982924858';
const INSTAGRAM_HANDLE = 'contaf1sh';
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/6oUbJ2e7m2H429o3T3fnO01';
const GGMAX_URL = 'https://ggmax.com.br/anuncio/conta-chatgpt-plus-mensal-acesso-exclusivo';

// Endpoint opcional de Webhook de Suporte (se houver API externa)
const WEBHOOK_SUPPORT_ENDPOINT = null; // Ex: 'https://api.contaflash.com/v1/support'

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
          // Se já é um link <a> configurado no HTML, apenas garante os dados
          // (não sobrescreve o href/conteúdo para não quebrar a navegação)
          btnEl.setAttribute('data-product', product.title);
          btnEl.setAttribute('data-price', product.price);
          if (btnEl.tagName !== 'A') {
            btnEl.innerHTML = `<i class="fab fa-stripe-s"></i> Comprar Agora — ${product.price}`;
            btnEl.className = 'btn btn-primary btn-buy-stripe';
            btnEl.setAttribute('data-stripe-url', product.stripeUrl);
          }
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
// Suporte Autônomo Chat Engine (Integração Interativa)
// ==========================================
function initSuporteChat() {
  if (!document.getElementById('suporteWidgetBtn')) {
    const chatHTML = `
      <div class="suporte-widget-btn" id="suporteWidgetBtn" title="Atendimento de Suporte 24h">
        <span class="dot-online"></span>
        <span>💬 Suporte 24h</span>
        <span class="suporte-badge" id="suporteBadge">1</span>
      </div>

      <div class="suporte-chat-window" id="suporteChatWindow">
        <div class="suporte-chat-header">
          <div class="suporte-chat-title">
            <div class="suporte-chat-avatar">💬</div>
            <div>
              <div style="font-size:.92rem; font-weight:600; line-height:1.2;">Suporte Autônomo</div>
              <div style="font-size:.74rem; opacity:.8;">Online | Respostas Imediatas</div>
            </div>
          </div>
          <button class="suporte-chat-close" id="closeSuporteChat">&times;</button>
        </div>

        <div class="suporte-chat-messages" id="suporteChatMessages">
          <div class="suporte-msg suporte-msg-bot">
            👋 Olá! Bem-vindo ao <strong>Suporte ContaFlash</strong>.<br>
            Temos <strong>ChatGPT Plus (1 Mês)</strong> em estoque por <strong>R$ 29,90</strong>.<br>
            Como posso te ajudar?
          </div>
        </div>

        <div class="suporte-chat-chips">
          <button class="suporte-chip" data-query="chatgpt">⚡ Comprar ChatGPT Plus</button>
          <button class="suporte-chip" data-query="ggmax">🛒 Comprar na GGMax</button>
          <button class="suporte-chip" data-query="estoque">📦 Consultar Estoque</button>
          <button class="suporte-chip" data-query="garantia">🔒 Garantia</button>
          <button class="suporte-chip" data-query="zap">💬 WhatsApp</button>
        </div>

        <form class="suporte-chat-input-box" id="suporteChatForm">
          <input type="text" id="suporteChatInput" placeholder="Digite sua mensagem para o Suporte..." required autocomplete="off">
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

  const badge = document.getElementById('suporteBadge');

  // Badge de notificação após 6s (se o chat nunca foi aberto)
  if (badge && !sessionStorage.getItem('cf-chat-opened')) {
    setTimeout(() => badge.classList.add('show'), 6000);
  }

  if (widgetBtn && chatWindow) {
    widgetBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active')) {
        badge?.classList.remove('show');
        sessionStorage.setItem('cf-chat-opened', '1');
        setTimeout(() => chatInput?.focus(), 400);
      }
    });
  }

  // Fecha o chat com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') chatWindow?.classList.remove('active');
  });

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
        processUserSuporteMessage('Quero comprar o ChatGPT Plus.');
      } else if (queryType === 'ggmax') {
        processUserSuporteMessage('Quero comprar o ChatGPT Plus pela GGMax.');
      } else if (queryType === 'estoque') {
        processUserSuporteMessage('Quais produtos estão disponíveis no estoque agora?');
      } else if (queryType === 'garantia') {
        processUserSuporteMessage('Como funciona a garantia do produto?');
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
        processUserSuporteMessage(text);
        chatInput.value = '';
      }
    });
  }

  function nowTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function appendChatMessage(text, isUser = false) {
    if (!messagesBox) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `suporte-msg ${isUser ? 'suporte-msg-user' : 'suporte-msg-bot'}`;
    msgDiv.innerHTML = `${text}<span class="suporte-time">${nowTime()}</span>`;
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTo({ top: messagesBox.scrollHeight, behavior: 'smooth' });
  }

  async function processUserSuporteMessage(userText) {
    appendChatMessage(sanitizeInput(userText), true);

    // Typing indicator (3 dots)
    const typingDiv = document.createElement('div');
    typingDiv.className = 'suporte-msg suporte-msg-bot';
    typingDiv.innerHTML = '<span class="suporte-typing"><span></span><span></span><span></span></span>';
    messagesBox.appendChild(typingDiv);
    messagesBox.scrollTo({ top: messagesBox.scrollHeight, behavior: 'smooth' });

    // If external Webhook configured
    if (WEBHOOK_SUPPORT_ENDPOINT) {
      try {
        const response = await fetch(WEBHOOK_SUPPORT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, phone: WHATSAPP_PHONE })
        });
        const data = await response.json();
        typingDiv.remove();
        if (data && data.reply) {
          appendChatMessage(data.reply, false);
          return;
        }
      } catch (err) {
        console.warn('Suporte webhook fallback:', err);
      }
    }

    // Built-in Intelligent Support Knowledge Engine
    setTimeout(() => {
      typingDiv.remove();
      const lower = userText.toLowerCase();
      let botReply = '';

      const stripeBtn = `<a href="${STRIPE_CHECKOUT_URL}" target="_blank" rel="noopener noreferrer" class="suporte-link-btn stripe"><i class="fab fa-stripe-s"></i> Stripe (recomendado)</a>`;
      const ggmaxBtn = `<a href="${GGMAX_URL}" target="_blank" rel="noopener noreferrer" class="suporte-link-btn ggmax"><i class="fas fa-store"></i> GGMax</a>`;
      const zapBtn = `<a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Olá! Quero comprar o ChatGPT Plus (1 Mês).')}" target="_blank" rel="noopener noreferrer" class="suporte-link-btn zap"><i class="fab fa-whatsapp"></i> WhatsApp</a>`;
      const recTip = `<span class="suporte-note">💡 Recomendamos o <strong>Stripe</strong>: aprovação instantânea e liberação em minutos.</span>`;

      const has = (...words) => words.some(w => lower.includes(w));

      if (has('oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'eae', 'opa') && lower.length < 25) {
        botReply = `Olá! 👋 Tudo bem?<br>Temos o <strong>ChatGPT Plus (1 Mês)</strong> disponível por <strong>R$ 29,90</strong>.<br><br>` +
          `Quer comprar agora ou tirar alguma dúvida?<br>` + stripeBtn + ggmaxBtn;
      } else if (has('ggmax', 'gg max')) {
        botReply = `Ótima escolha! Nosso anúncio oficial na GGMax oferece compra protegida pela plataforma:<br><br>` +
          ggmaxBtn + `<span class="suporte-note">Pagamento e entrega intermediados pela GGMax.</span>`;
      } else if (has('preço', 'preco', 'valor', 'quanto custa', 'quanto é', 'quanto e')) {
        botReply = `O <strong>ChatGPT Plus (1 Mês de Acesso)</strong> custa <strong>R$ 29,90</strong> — pagamento único, sem mensalidade.<br><br>` +
          stripeBtn + ggmaxBtn + zapBtn;
      } else if (has('chatgpt', 'comprar', 'stripe', 'pagar', 'quero', 'gpt')) {
        botReply = `O <strong>ChatGPT Plus (1 Mês de Acesso)</strong> está em estoque por <strong>R$ 29,90</strong>. Escolha como prefere pagar:<br><br>` +
          stripeBtn + ggmaxBtn + zapBtn + recTip;
      } else if (has('pix', 'cartão', 'cartao', 'boleto', 'forma de pagamento', 'parcel')) {
        botReply = `💳 <strong>Formas de pagamento:</strong><br>` +
          `• <strong>Stripe</strong>: cartão de crédito e PIX<br>` +
          `• <strong>GGMax</strong>: PIX e saldo da plataforma<br>` +
          `• <strong>WhatsApp</strong>: PIX direto<br><br>` + stripeBtn + ggmaxBtn;
      } else if (has('entrega', 'quanto tempo', 'demora', 'prazo', 'receber')) {
        botReply = `⚡ <strong>Entrega imediata!</strong><br>` +
          `Após a confirmação do pagamento, enviamos os dados de acesso no seu WhatsApp em <strong>até 5 minutos</strong>.<br><br>` +
          `Atendemos 24 horas por dia, todos os dias.`;
      } else if (has('estoque', 'disponiv', 'disponív', 'outros', 'netflix', 'spotify', 'disney', 'xbox', 'canva', 'hbo', 'deezer', 'midjourney')) {
        botReply = `📦 <strong>Status do estoque agora:</strong><br>` +
          `• <strong>ChatGPT Plus</strong> — 🔥 14 unidades (pronta entrega)<br>` +
          `• Netflix, Spotify, Disney+, Xbox, HBO, Canva, Deezer e Midjourney — 🚫 esgotados<br><br>` +
          `Quer ser avisado na reposição? Chame no WhatsApp:<br>` + zapBtn;
      } else if (has('garantia', 'troca', 'segur', 'confia', 'golpe', 'reembolso')) {
        botReply = `🔒 <strong>Garantia Imediata de 24 horas</strong> — e isso é uma grande vantagem:<br><br>` +
          `• Testamos o acesso <strong>junto com você</strong> na entrega<br>` +
          `• Qualquer problema de login é trocado <strong>na hora</strong><br>` +
          `• Sem formulário, sem protocolo, sem esperar dias<br>` +
          `• Suporte segue disponível o mês todo para dúvidas<br><br>` +
          `<span class="suporte-note">Resolvemos em minutos o que outros vendedores levam dias para responder.</span>`;
      } else if (has('assinatura', 'recorrente', 'renova', 'mensalidade', 'cobrança', 'cobranca')) {
        botReply = `✅ <strong>Não é assinatura!</strong><br>` +
          `Você compra uma conta pronta com <strong>1 mês já pago</strong>. Nenhuma cobrança recorrente será feita no seu cartão.<br><br>` +
          `Ao final dos 30 dias, você decide se quer renovar comprando novamente.`;
      } else if (has('funciona', 'como usa', 'como recebo', 'passo')) {
        botReply = `📝 <strong>Como funciona:</strong><br>` +
          `1️⃣ Você paga via Stripe, GGMax ou WhatsApp<br>` +
          `2️⃣ Confirmamos o pagamento automaticamente<br>` +
          `3️⃣ Enviamos login e senha no seu WhatsApp<br>` +
          `4️⃣ Você usa por 30 dias com garantia total<br><br>` + stripeBtn;
      } else if (has('instagram', 'insta', 'rede social', 'telegram', 'contato')) {
        botReply = `📱 <strong>Nossos canais oficiais:</strong><br>` +
          `• Instagram: <strong>@${INSTAGRAM_HANDLE}</strong><br>` +
          `• WhatsApp: <strong>(31) 98292-4858</strong><br>` +
          `• Telegram: indisponível no momento<br><br>` + zapBtn;
      } else if (has('obrigad', 'valeu', 'vlw', 'tchau', 'ok')) {
        botReply = `Por nada! 😊 Estou aqui 24h se precisar.<br>Boas compras na <strong>ContaFlash</strong>! ⚡`;
      } else {
        botReply = `Não tenho certeza se entendi. 🤔 Posso te ajudar com:<br><br>` +
          `• Preço e formas de pagamento<br>• Prazo de entrega<br>• Estoque disponível<br>• Garantia<br><br>` +
          `Ou fale direto com um atendente humano:<br>` + zapBtn;
      }

      appendChatMessage(botReply, false);
    }, 900);
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

  // Desliga partículas para quem prefere menos movimento
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const particleCount = window.innerWidth < 768 ? 8 : 16;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 22 + 28; // 28s a 50s — bem devagar
    const delay = Math.random() * 18;

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
  const elements = Array.from(document.querySelectorAll('.fade-in'));
  if (!elements.length) return;

  // Respeita quem prefere menos movimento
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  // Ativa o estado inicial escondido só agora (garante fallback sem JS)
  document.documentElement.classList.add('js-ready');

  // Revela um elemento e, ao terminar, remove as classes de animação.
  // Isso elimina o conflito de transform com o :hover dos cards.
  function reveal(el, delay = 0) {
    if (el.dataset.revealed === '1') return;
    el.dataset.revealed = '1';

    setTimeout(() => {
      el.style.willChange = 'opacity, transform';
      el.classList.add('visible');

      const cleanup = () => {
        el.classList.remove('fade-in', 'visible');
        el.classList.add('revealed');
        el.style.willChange = 'auto';
      };
      // Limpa após a transição (1s) com folga de segurança
      el.addEventListener('transitionend', cleanup, { once: true });
      setTimeout(cleanup, 1400);
    }, delay);
  }

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => reveal(el, 0));
    return;
  }

  // Elementos já visíveis no carregamento: stagger curto e ordenado
  const inView = elements.filter(el => el.getBoundingClientRect().top < window.innerHeight * 0.92);
  inView.forEach((el, i) => reveal(el, Math.min(i * 110, 550)));

  const observer = new IntersectionObserver((entries) => {
    // Ordena por posição na tela para o stagger sair de cima para baixo
    const visibles = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    visibles.forEach((entry, i) => {
      reveal(entry.target, Math.min(i * 110, 440));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => {
    if (el.dataset.revealed !== '1') observer.observe(el);
  });
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
  const duration = 2800;
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
    autoplayInterval = setInterval(nextSlide, 7500);
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
    if (!buyBtn) return;

    // Se for um link <a> real, deixa o navegador abrir nativamente.
    // (window.open + preventDefault era bloqueado por popup blockers)
    if (buyBtn.tagName === 'A' && buyBtn.getAttribute('href')) {
      showToast('Abrindo checkout seguro...', 'success');
      return;
    }

    // Caso seja um <button>, abre o modal de opções de compra
    e.preventDefault();
    activeProduct.name = buyBtn.getAttribute('data-product') || 'ChatGPT Plus (1 Mês)';
    activeProduct.price = buyBtn.getAttribute('data-price') || 'R$ 29,90';
    const nameEl = document.getElementById('modalProductName');
    const priceEl = document.getElementById('modalProductPrice');
    if (nameEl) nameEl.textContent = activeProduct.name;
    if (priceEl) priceEl.textContent = activeProduct.price;
    modalOverlay.classList.add('active');
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
