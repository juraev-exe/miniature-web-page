// ===========================
// INDEX PAGE SPECIFIC JAVASCRIPT
// ===========================

// Import main functionality
// (Note: In a real project, you might use ES6 modules or a build system)

// Homepage specific functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize hero statistics animation
    initHeroStats();
    
    // Initialize feature cards hover effects
    initFeatureCards();
    
    // Initialize testimonial carousel
    initTestimonialCarousel();
    
    // Initialize news section animations
    initNewsAnimations();
    
    // Initialize homepage scroll effects
    initScrollEffects();
});

// Hero statistics animation
function initHeroStats() {
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;
    
    const stats = [
        { element: '.stat-students', target: 2500, suffix: '+' },
        { element: '.stat-faculty', target: 150, suffix: '+' },
        { element: '.stat-programs', target: 50, suffix: '+' },
        { element: '.stat-acceptance', target: 98, suffix: '%' }
    ];
    
    // Use Intersection Observer to trigger animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats(stats);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(statsSection);
}

function animateStats(stats) {
    stats.forEach(stat => {
        const element = document.querySelector(stat.element);
        if (!element) return;
        
        let current = 0;
        const increment = stat.target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
                current = stat.target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + stat.suffix;
        }, 20);
    });
}

// Feature cards hover effects
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Testimonial carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    const testimonials = carousel.querySelectorAll('.testimonial-card');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.transform = `translateX(${(i - index) * 100}%)`;
            testimonial.style.opacity = i === index ? '1' : '0.5';
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });
    
    // Initialize first testimonial
    showTestimonial(0);
}

// News section animations
function initNewsAnimations() {
    const newsCards = document.querySelectorAll('.news-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    newsCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Scroll effects for homepage
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Homepage CTA button effects
function initCTAEffects() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Quick info hover effects
function initQuickInfoEffects() {
    const quickInfoItems = document.querySelectorAll('.quick-info-item');
    
    quickInfoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.quick-info-icon');
            if (icon) {
                icon.style.transform = 'rotateY(360deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.quick-info-icon');
            if (icon) {
                icon.style.transform = 'rotateY(0deg)';
            }
        });
    });
}

// Initialize typing effect for hero text
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'Excellence in Education',
        'Shaping Future Leaders',
        'Innovation & Learning',
        'Academic Excellence'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize all effects on page load
document.addEventListener('DOMContentLoaded', function() {
    initCTAEffects();
    initQuickInfoEffects();
    initTypingEffect();
    initSmoothScroll();
});
