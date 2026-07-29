/* =========================================
   ContaFlash - JavaScript Principal
   ========================================= */

// Gate: habilita animações apenas quando o JS está rodando.
// Sem isso, o conteúdo nunca ficaria "preso" invisível se o JS falhar.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initParticles();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initFadeInAnimations();
  initCounterAnimations();
  initTestimonialSlider();
  initNewsletterForm();
  initContactForm();
  initFAQAccordion();
  initFAQSearch();
  initProductFilters();
  initWhatsAppTooltip();
  initCookieModal();
  initPhoneMask();
  initStripeCheckout();
  initCancelToast();
});

// ==========================================
// Loading Screen
// ==========================================
function initLoadingScreen() {
  const loader = document.querySelector('.loading-screen');
  if (!loader) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  });
  
  // Fallback: hide after 3s max
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 3000);
}

// ==========================================
// Particles
// ==========================================
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  
  const particleCount = window.innerWidth < 768 ? 20 : 40;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 20;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    // Subtle, refined dots (neutral + faint accent)
    const colors = [
      'rgba(23, 23, 23, 0.10)',
      'rgba(16, 163, 127, 0.18)',
      'rgba(23, 23, 23, 0.06)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
  }
}

// ==========================================
// Header Scroll Effect
// ==========================================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close on link click
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
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
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
  
  const observer = new IntersectionObserver((entries) => {
    // stagger limitado (máx 360ms) para não acumular atrasos absurdos
    const visible = entries.filter(e => e.isIntersecting);
    visible.forEach((entry, i) => {
      const delay = Math.min(i * 90, 360);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
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
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 2000;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
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
  let autoplayInterval;
  
  // Create dots
  if (dotsContainer) {
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
  
  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  
  startAutoplay();
  
  // Pause on hover
  slider.parentElement?.addEventListener('mouseenter', stopAutoplay);
  slider.parentElement?.addEventListener('mouseleave', startAutoplay);
  
  // Touch support
  let startX = 0;
  let isDragging = false;
  
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  });
  
  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = startX - e.changedTouches[0].clientX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      } else if (diffX < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
    startAutoplay();
  });
}

// ==========================================
// Newsletter Form
// ==========================================
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const input = form.querySelector('input[type="email"]');
    const email = input?.value.trim();
    
    if (!email || !validateEmail(email)) {
      showToast('Por favor, insira um email válido.', 'error');
      return;
    }
    
    // Simulate submission
    showToast('Inscrição realizada com sucesso! 🎉', 'success');
    input.value = '';
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==========================================
// Contact Form
// ==========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fields = {
      name: form.querySelector('[name="name"]'),
      email: form.querySelector('[name="email"]'),
      phone: form.querySelector('[name="phone"]'),
      subject: form.querySelector('[name="subject"]'),
      message: form.querySelector('[name="message"]')
    };
    
    let isValid = true;
    
    // Name validation
    if (!fields.name) {
      setFieldError(fields.name, 'Campo obrigatório');
      isValid = false;
    } else if (fields.name.value.trim().length < 2) {
      setFieldError(fields.name, 'Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    } else {
      setFieldSuccess(fields.name);
    }
    
    // Email validation
    if (!validateEmail(fields.email?.value.trim())) {
      setFieldError(fields.email, 'Insira um email válido');
      isValid = false;
    } else {
      setFieldSuccess(fields.email);
    }
    
    // Phone validation
    const phoneClean = fields.phone?.value.replace(/\D/g, '') || '';
    if (phoneClean.length < 10) {
      setFieldError(fields.phone, 'Insira um telefone válido');
      isValid = false;
    } else {
      setFieldSuccess(fields.phone);
    }
    
    // Subject validation
    if (!fields.subject?.value) {
      setFieldError(fields.subject, 'Selecione um assunto');
      isValid = false;
    } else {
      setFieldSuccess(fields.subject);
    }
    
    // Message validation
    if (!fields.message?.value.trim() || fields.message.value.trim().length < 10) {
      setFieldError(fields.message, 'Mensagem deve ter pelo menos 10 caracteres');
      isValid = false;
    } else {
      setFieldSuccess(fields.message);
    }
    
    if (isValid) {
      showToast('Mensagem enviada com sucesso! Entraremos em contato em breve. 📧', 'success');
      form.reset();
      
      // Reset field styles
      form.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('error', 'success');
      });
    }
  });
}

function setFieldError(field, message) {
  if (!field) return;
  const group = field.closest('.form-group');
  group?.classList.add('error');
  group?.classList.remove('success');
  const errorEl = group?.querySelector('.error-msg');
  if (errorEl) errorEl.textContent = message;
}

function setFieldSuccess(field) {
  if (!field) return;
  const group = field.closest('.form-group');
  group?.classList.remove('error');
  group?.classList.add('success');
}

// XSS Protection
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
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
      
      // Close all
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Open clicked if wasn't active
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
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease';
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
  
  // Show tooltip after 3 seconds
  setTimeout(() => {
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    
    // Hide after 4 seconds
    setTimeout(() => {
      tooltip.style.opacity = '';
      tooltip.style.visibility = '';
    }, 4000);
  }, 3000);
}

// ==========================================
// Cookie Modal (GDPR)
// ==========================================
function initCookieModal() {
  if (localStorage.getItem('contaflash-cookies-accepted')) return;
  
  const modal = document.querySelector('.cookie-modal');
  if (!modal) return;
  
  // Show after 2 seconds
  setTimeout(() => {
    modal.classList.add('show');
  }, 2000);
  
  const acceptBtn = modal.querySelector('.cookie-accept');
  const rejectBtn = modal.querySelector('.cookie-reject');
  
  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem('contaflash-cookies-accepted', 'true');
    modal.classList.remove('show');
    showToast('Cookies aceitos! Obrigado.', 'success');
  });
  
  rejectBtn?.addEventListener('click', () => {
    localStorage.setItem('contaflash-cookies-accepted', 'rejected');
    modal.classList.remove('show');
  });
}

// ==========================================
// Phone Mask (Brazilian)
// ==========================================
function initPhoneMask() {
  const phoneInput = document.querySelector('input[name="phone"]');
  if (!phoneInput) return;
  
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 7) {
      value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    e.target.value = value;
  });
}

// ==========================================
// Toast Notifications
// ==========================================
function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.classList.add('toast', type);
  
  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation'
  };
  
  // Construção segura via textContent (evita XSS caso a mensagem contenha HTML)
  const icon = document.createElement('i');
  icon.className = (icons[type] || icons.success) + ' toast-icon';
  const span = document.createElement('span');
  span.className = 'toast-message';
  span.textContent = message;
  toast.appendChild(icon);
  toast.appendChild(span);

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// ==========================================
// Stripe Checkout (automação de pagamento)
// ==========================================
function initStripeCheckout() {
  const buttons = document.querySelectorAll('.buy-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const productId = btn.dataset.product;
      if (!productId || btn.disabled) return;

      // Feedback visual durante a criação da sessão
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('loading');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando checkout...';

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        });
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error(data.error || 'Falha ao iniciar o checkout.');
        window.location.href = data.url; // Redireciona para o Stripe Checkout
      } catch (err) {
        showToast(err.message || 'Não foi possível iniciar o pagamento. Tente novamente.', 'error');
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.innerHTML = original;
      }
    });
  });
}

// Aviso quando o usuário cancela o pagamento no Stripe e volta
function initCancelToast() {
  if (window.location.search.includes('cancelado=1')) {
    showToast('Pagamento cancelado. Você não foi cobrado.', 'warning');
    window.history.replaceState({}, '', window.location.pathname);
  }
}
