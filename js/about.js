// ===========================
// ABOUT PAGE SPECIFIC JAVASCRIPT
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize about page specific functionality
    initTimelineAnimation();
    initFacultyCards();
    initMissionCards();
    initStatsCounters();
    initAccordions();
});

// Timeline animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Faculty cards hover effects
function initFacultyCards() {
    const facultyCards = document.querySelectorAll('.faculty-card');
    
    facultyCards.forEach(card => {
        // Hover effect for faculty images
        const image = card.querySelector('.faculty-image');
        if (image) {
            card.addEventListener('mouseenter', function() {
                image.style.transform = 'scale(1.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1)';
            });
        }
        
        // Click to expand faculty bio
        card.addEventListener('click', function() {
            const bio = this.querySelector('.faculty-bio-expanded');
            if (bio) {
                bio.style.display = bio.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
}

// Mission cards animation
function initMissionCards() {
    const missionCards = document.querySelectorAll('.mission-card, .value-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    missionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)';
        observer.observe(card);
    });
}

// Stats counters for about page
function initStatsCounters() {
    const statsSection = document.querySelector('.about-stats');
    if (!statsSection) return;
    
    const stats = [
        { element: '.stat-years', target: 25, suffix: '+' },
        { element: '.stat-graduates', target: 5000, suffix: '+' },
        { element: '.stat-awards', target: 50, suffix: '+' },
        { element: '.stat-research', target: 100, suffix: '+' }
    ];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(stats);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(statsSection);
}

function animateCounters(stats) {
    stats.forEach(stat => {
        const element = document.querySelector(stat.element);
        if (!element) return;
        
        let current = 0;
        const increment = stat.target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
                current = stat.target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + stat.suffix;
        }, 30);
    });
}

// Accordion functionality for FAQ or detailed sections
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordion = this.parentElement;
            const content = accordion.querySelector('.accordion-content');
            const icon = this.querySelector('.accordion-icon');
            
            // Close other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    const otherAccordion = otherHeader.parentElement;
                    const otherContent = otherAccordion.querySelector('.accordion-content');
                    const otherIcon = otherHeader.querySelector('.accordion-icon');
                    
                    otherAccordion.classList.remove('active');
                    otherContent.style.maxHeight = '0';
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current accordion
            accordion.classList.toggle('active');
            
            if (accordion.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                if (icon) icon.style.transform = 'rotate(45deg)';
            } else {
                content.style.maxHeight = '0';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Leadership team hover effects
function initLeadershipTeam() {
    const leadershipCards = document.querySelectorAll('.leadership-card');
    
    leadershipCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.card-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.card-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.transform = 'translateY(20px)';
            }
        });
    });
}

// History timeline interactive elements
function initHistoryTimeline() {
    const timelineItems = document.querySelectorAll('.history-item');
    
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            timelineItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show detailed information
            const details = this.querySelector('.history-details');
            if (details) {
                details.style.display = details.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
}

// Parallax effect for about hero section
function initAboutParallax() {
    const heroSection = document.querySelector('.about-hero');
    if (!heroSection) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        heroSection.style.transform = `translateY(${parallax}px)`;
    });
}

// Vision and mission tabs
function initVisionMissionTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Awards and achievements carousel
function initAwardsCarousel() {
    const carousel = document.querySelector('.awards-carousel');
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.award-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    let currentIndex = 0;
    
    function showAward(index) {
        items.forEach((item, i) => {
            item.style.transform = `translateX(${(i - index) * 100}%)`;
            item.style.opacity = i === index ? '1' : '0.5';
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            showAward(currentIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length;
            showAward(currentIndex);
        });
    }
    
    // Auto-rotate awards
    setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        showAward(currentIndex);
    }, 4000);
    
    showAward(0);
}

// Initialize additional effects
document.addEventListener('DOMContentLoaded', function() {
    initLeadershipTeam();
    initHistoryTimeline();
    initAboutParallax();
    initVisionMissionTabs();
    initAwardsCarousel();
});
