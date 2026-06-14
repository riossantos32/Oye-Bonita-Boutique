// ============================================================
// OYE BONITA BOUTIQUE - JAVASCRIPT VANILLA
// Interactividad y mejoras de UX sin dependencias externas
// ============================================================

// ============ CONSTANTES Y CONFIGURACIÓN ============
const CONFIG = {
    scrollOffset: 80, // Offset para scroll suave con navbar fijo
    animationDuration: 300,
};

// ============ DOM READY ============
document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initNavbarInteractions();
    initIntersectionObserver();
    initButtonInteractions();
});

// ============ SMOOTH SCROLL ============
/**
 * Maneja el scroll suave para navegación interna
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const targetPosition = targetElement.offsetTop - CONFIG.scrollOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });

            // Cerrar menú móvil si existe
            closeNavigationMenu();
        });
    });
}

// ============ NAVBAR INTERACCIONES ============
/**
 * Maneja efectos visuales de la navbar
 */
function initNavbarInteractions() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });
}

// ============ INTERSECTION OBSERVER (Lazy Animations) ============
/**
 * Observa elementos para activar animaciones al entrar en viewport
 */
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar cards de características
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observar cards de testimonios
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ============ BUTTON INTERACCIONES ============
/**
 * Maneja eventos de botones CTA
 */
function initButtonInteractions() {
    const ctaButtons = document.querySelectorAll('.cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Ripple effect
            createRipple(e, this);

            // Simulación de acción (puede ser reemplazada con navegación real)
            console.log('CTA Button clicked');
            // this.textContent = '¡Explorando...';
            // setTimeout(() => {
            //     this.textContent = 'Explorar Colecciones';
            // }, 1000);
        });

        // Agregar focus visible para accesibilidad
        button.addEventListener('focus', function () {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });

        button.addEventListener('blur', function () {
            this.style.outline = 'none';
        });
    });
}

/**
 * Crea efecto ripple en los botones
 */
function createRipple(event, button) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    // Estilos dinámicos del ripple
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// ============ UTILIDADES ============

/**
 * Cierra menú de navegación móvil (si existe)
 */
function closeNavigationMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
}

/**
 * Obtiene el año actual para el copyright
 */
function updateCopyrightYear() {
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        const year = new Date().getFullYear();
        copyrightElement.textContent = `© ${year} Oye Bonita Boutique. Todos los derechos reservados.`;
    }
}

updateCopyrightYear();

// ============ PERFORMANCE MONITORING ============
/**
 * Monitoreo básico de performance (opcional)
 */
if ('PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 3000) {
                    console.warn('Slow interaction detected:', entry);
                }
            }
        });

        observer.observe({ entryTypes: ['navigation', 'resource'] });
    } catch (e) {
        console.log('PerformanceObserver not available');
    }
}

// ============ ACCESIBILIDAD MEJORADA ============
/**
 * Mejora la experiencia de accesibilidad
 */
function enhanceAccessibility() {
    // Detectar preferencia de movimiento reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.documentElement.style.scrollBehavior = 'auto';
    }

    // Manejar navegación por teclado
    document.addEventListener('keydown', function (e) {
        // ESC para cerrar menús
        if (e.key === 'Escape') {
            closeNavigationMenu();
        }

        // Skip to main content (Alt + M)
        if (e.altKey && e.key === 'm') {
            const mainContent = document.querySelector('main') || document.querySelector('.hero');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

enhanceAccessibility();

// ============ LAZY LOADING DE IMÁGENES (Futuro) ============
/**
 * Lazy loading para imágenes (cuando se agreguen imágenes reales)
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

initLazyLoading();

// ============ EXPORTAR PARA TESTING ============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSmoothScroll,
        initNavbarInteractions,
        initIntersectionObserver,
        initButtonInteractions,
    };
}