/* ===================================
   CONTAFLASH - JAVASCRIPT PRINCIPAL
   Funcionalidades e Interatividade
   =================================== */

// ===================================
// SEGURANÇA E VALIDAÇÃO
// ===================================

// Sanitização de input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validação de email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validação de telefone brasileiro
function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
}

// Escape HTML para prevenir XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Máscara de telefone
function phoneMask(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 0) {
        value = '(' + value;
    }
    if (value.length > 3) {
        value = value.slice(0, 3) + ') ' + value.slice(3);
    }
    if (value.length > 10) {
        value = value.slice(0, 10) + '-' + value.slice(10);
    }
    
    input.value = value;
}

// ===================================
// PARTÍCULAS DE FUNDO
// ===================================

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        container.appendChild(particle);
    }
}

// ===================================
// HEADER & SCROLL
// ===================================

function initHeader() {
    const header = document.getElementById('header');
    const lastScroll = { y: 0 };
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Adiciona classe scrolled quando rola
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll.y = currentScroll;
    });
}

// ===================================
// MOBILE MENU
// ===================================

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Previne scroll do body quando menu está aberto
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fecha menu ao clicar em link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===================================
// BANNER DE SEGURANÇA
// ===================================

function closeBanner() {
    const banner = document.getElementById('securityBanner');
    if (banner) {
        banner.classList.add('hidden');
        // Salva no localStorage para não mostrar novamente
        localStorage.setItem('securityBannerClosed', 'true');
    }
}

function checkBannerStatus() {
    const banner = document.getElementById('securityBanner');
    if (banner && localStorage.getItem('securityBannerClosed') === 'true') {
        banner.classList.add('hidden');
    }
}

// ===================================
// CONTADOR ANIMADO (STAT NUMBERS)
// ===================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Verifica se está visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ===================================
// SLIDER DE DEPOIMENTOS
// ===================================

function initTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!track) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // incluindo gap
    
    // Cria dots
    const totalDots = Math.ceil(cards.length / 2);
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalDots;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalDots) % totalDots;
        updateSlider();
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play
    setInterval(nextSlide, 5000);
}

// ===================================
// NEWSLETTER
// ===================================

function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletterEmail');
        const email = emailInput.value.trim();
        
        // Validação
        if (!validateEmail(email)) {
            showToast('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Sanitização
        const safeEmail = sanitizeInput(email);
        
        // Simula envio (substituir por chamada real)
        console.log('Newsletter signup:', safeEmail);
        
        showToast('Obrigado por se inscrever! 🎉', 'success');
        emailInput.value = '';
        
        // Salva no localStorage (simulação)
        const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        subscribers.push({ email: safeEmail, date: new Date().toISOString() });
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    });
}

// ===================================
// COOKIES MODAL
// ===================================

function initCookieModal() {
    const modal = document.getElementById('cookieModal');
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    
    if (!modal) return;
    
    // Verifica se já aceitou
    if (localStorage.getItem('cookiesAccepted') || localStorage.getItem('cookiesRejected')) {
        modal.classList.add('hidden');
        return;
    }
    
    // Mostra modal após delay
    setTimeout(() => {
        modal.classList.remove('hidden');
    }, 2000);
    
    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        modal.classList.add('hidden');
        showToast('Cookies aceitos! 🍪', 'success');
    });
    
    rejectBtn?.addEventListener('click', () => {
        localStorage.setItem('cookiesRejected', 'true');
        modal.classList.add('hidden');
    });
}

// ===================================
// TOAST NOTIFICATIONS
// ===================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${sanitizeInput(message)}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove após 4 segundos
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ===================================
// LOADING SCREEN
// ===================================

function hideLoadingScreen() {
    const loader = document.getElementById('loadingScreen');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// ===================================
// ANIMAÇÕES AO SCROLL (AOS-like)
// ===================================

function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => observer.observe(el));
}

// ===================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// FORMULÁRIOS - VALIDAÇÃO GENERALIZADA
// ===================================

function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                const value = input.value.trim();
                
                if (!value) {
                    isValid = false;
                    input.classList.add('error');
                    showToast(`O campo "${input.name || input.id}" é obrigatório.`, 'error');
                } else if (input.type === 'email' && !validateEmail(value)) {
                    isValid = false;
                    input.classList.add('error');
                    showToast('Por favor, insira um e-mail válido.', 'error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Coleta dados sanitizados
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    data[sanitizeInput(key)] = sanitizeInput(value);
                });
                
                console.log('Form submitted:', data);
                showToast('Formulário enviado com sucesso!', 'success');
                form.reset();
            }
        });
        
        // Remove classe error ao digitar
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    });
}

// ===================================
// WHATSAPP FLOAT HOVER
// ===================================

function initWhatsAppFloat() {
    const whatsapp = document.getElementById('whatsappFloat');
    if (!whatsapp) return;
    
    // Animação de pulso
    setInterval(() => {
        whatsapp.style.transform = 'scale(1.1)';
        setTimeout(() => {
            whatsapp.style.transform = 'scale(1)';
        }, 200);
    }, 3000);
}

// ===================================
// COUNTER PARA TEMPO DE ENTREGA
// ===================================

function initDeliveryCounter() {
    const counters = document.querySelectorAll('.delivery-time');
    
    counters.forEach(counter => {
        const deliverySpan = counter.querySelector('.delivery-value');
        if (!deliverySpan) return;
        
        let seconds = 3;
        const interval = setInterval(() => {
            seconds--;
            if (seconds > 0) {
                deliverySpan.textContent = seconds;
            } else {
                deliverySpan.textContent = '⚡';
                clearInterval(interval);
            }
        }, 1000);
    });
}

// ===================================
// PREVENÇÃO DE XSS EM COMENTÁRIOS
// ===================================

function sanitizeComments() {
    const comments = document.querySelectorAll('.user-comment');
    
    comments.forEach(comment => {
        // Escape qualquer HTML no conteúdo
        const text = comment.textContent;
        comment.textContent = text;
    });
}

// ===================================
// ROTAÇÃO DE IMAGENS (Lazy Loading)
// ===================================

function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===================================
// DETECÇÃO DE MODO ESCURO
// ===================================

function initDarkMode() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// ===================================
// KEYBOARD NAVIGATION (ACCESSIBILITY)
// ===================================

function initKeyboardNav() {
    // Enter e Space em botões
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.classList.contains('btn-service') || 
                e.target.classList.contains('slider-btn') ||
                e.target.classList.contains('mobile-menu-btn')) {
                e.target.click();
            }
        }
        
        // ESC fecha modais e menus
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            const cookieModal = document.getElementById('cookieModal');
            
            if (mobileMenu?.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.getElementById('mobileMenuBtn')?.classList.remove('active');
            }
            
            if (!localStorage.getItem('cookiesAccepted') && !localStorage.getItem('cookiesRejected')) {
                cookieModal?.classList.add('hidden');
            }
        }
    });
}

// ===================================
// CLICKJACKING PROTECTION
// ===================================

function initSecurityHeaders() {
    // Verifica se está em iframe
    if (window.self !== window.top) {
        document.body.style.display = 'none';
        console.warn('Site não pode ser carregado em iframe.');
    }
    
    // Desabilita clique direito em elementos protegidos
    document.querySelectorAll('.protected').forEach(el => {
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });
}

// ===================================
// INICIALIZAÇÃO
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Segurança primeiro
    initSecurityHeaders();
    
    // Elementos básicos
    createParticles();
    initHeader();
    initMobileMenu();
    checkBannerStatus();
    initSmoothScroll();
    initKeyboardNav();
    initDarkMode();
    
    // Funcionalidades
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);
    
    animateCounters();
    initTestimonialsSlider();
    initNewsletter();
    initCookieModal();
    initFormValidation();
    initWhatsAppFloat();
    initScrollAnimations();
    sanitizeComments();
    
    // Console Easter Egg
    console.log('%c⚡ ContaFlash - Serviços Digitais Premium', 
                'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cJunte-se a mais de 5.000 clientes satisfeitos!', 
                'color: #ec4899; font-size: 14px;');
});

// Previne carregamento de scripts externos
document.addEventListener('securitypolicyviolation', (e) => {
    console.warn('Content Security Policy violation:', e.violatedDirective);
});

// Rate limiting básico para formulários
const formSubmissions = new Map();

function checkRateLimit(formId, maxSubmissions = 3, windowMs = 60000) {
    const now = Date.now();
    const key = formId || 'default';
    
    if (!formSubmissions.has(key)) {
        formSubmissions.set(key, []);
    }
    
    const submissions = formSubmissions.get(key);
    const recentSubmissions = submissions.filter(time => now - time < windowMs);
    
    if (recentSubmissions.length >= maxSubmissions) {
        showToast('Muitas tentativas. Tente novamente em alguns minutos.', 'error');
        return false;
    }
    
    recentSubmissions.push(now);
    formSubmissions.set(key, recentSubmissions);
    return true;
}

// Exporta funções para uso global se necessário
window.ContaFlash = {
    showToast,
    sanitizeInput,
    validateEmail,
    checkRateLimit
};
