/**
 * Main JavaScript file for School Website
 * Handles navigation, login validation, and general functionality
 */

// ===========================
// GLOBAL VARIABLES
// ===========================
let currentUser = null;

// Hard-coded credentials for demonstration
const validCredentials = [
  { username: 'student1', password: 'password123', role: 'student', name: 'Alex Johnson' },
  { username: 'teacher1', password: 'teacher456', role: 'teacher', name: 'Dr. Sarah Wilson' },
  { username: 'admin', password: 'admin789', role: 'admin', name: 'Admin User' }
];

// ===========================
// DOM READY AND INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeLoginForm();
  initializeContactForm();
  initializeModals();
  checkAuthentication();
  initializeThemeToggle();
  initializeGallery();
  initializeScrollAnimations();
  registerServiceWorker();
  initializeAnalytics();
  initializeSkeletonLoaders();
  
  // Set active navigation item based on current page
  setActiveNavigation();
});

// ===========================
// NAVIGATION FUNCTIONALITY
// ===========================
function initializeNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      
      // Update ARIA attributes
      const isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      
      // Animate hamburger icon
      const hamburger = navToggle.querySelector('.hamburger');
      if (hamburger) {
        hamburger.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0)';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        
        const hamburger = navToggle.querySelector('.hamburger');
        if (hamburger) {
          hamburger.style.transform = 'rotate(0)';
        }
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }
}

function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// ===========================
// DARK MODE THEME TOGGLE
// ===========================
function initializeThemeToggle() {
  // Get saved theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the saved theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Find all theme toggle buttons
  const themeToggleButtons = document.querySelectorAll('.theme-toggle');
  
  themeToggleButtons.forEach(button => {
    button.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Animate toggle button
  const activeButton = document.querySelector('.theme-toggle');
  if (activeButton) {
    activeButton.classList.add('theme-toggle-animating');
    setTimeout(() => {
      activeButton.classList.remove('theme-toggle-animating');
    }, 400);
  }

  // Animate theme transition
  document.documentElement.style.transition = 'background-color 0.5s cubic-bezier(0.4,0.2,0.2,1), color 0.5s cubic-bezier(0.4,0.2,0.2,1)';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  setTimeout(() => {
    document.documentElement.style.transition = '';
  }, 500);
}

// ===========================
// LOGIN FORM FUNCTIONALITY
// ===========================
function initializeLoginForm() {
  const loginForm = document.getElementById('loginForm');
  
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Clear previous error messages
    clearFormErrors();
    
    // Get form data
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Validate form
    const validationErrors = validateLoginForm(username, password);
    
    if (validationErrors.length > 0) {
      displayFormErrors(validationErrors);
      return;
    }
    
    // Attempt authentication
    const user = authenticateUser(username, password);
    
    if (user) {
      handleSuccessfulLogin(user);
    } else {
      displayFormErrors([{ field: 'general', message: 'Invalid username or password. Please try again.' }]);
    }
  });
  
  // Real-time validation
  const inputs = loginForm.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(input);
    });
    
    input.addEventListener('input', function() {
      // Clear error state on input
      const errorElement = document.getElementById(`${input.name}Error`);
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
      input.classList.remove('error');
    });
  });
}

function validateLoginForm(username, password) {
  const errors = [];
  
  // Username validation
  if (!username || username.trim().length === 0) {
    errors.push({ field: 'username', message: 'Username is required.' });
  } else if (username.length < 3) {
    errors.push({ field: 'username', message: 'Username must be at least 3 characters long.' });
  }
  
  // Password validation
  if (!password || password.trim().length === 0) {
    errors.push({ field: 'password', message: 'Password is required.' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
  }
  
  return errors;
}

function validateField(input) {
  const value = input.value.trim();
  const fieldName = input.name;
  let errorMessage = '';
  
  switch (fieldName) {
    case 'username':
      if (!value) {
        errorMessage = 'Username is required.';
      } else if (value.length < 3) {
        errorMessage = 'Username must be at least 3 characters long.';
      }
      break;
      
    case 'password':
      if (!value) {
        errorMessage = 'Password is required.';
      } else if (value.length < 6) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else {
        // Enhanced password strength validation
        const strength = checkPasswordStrength(value);
        if (strength.score < 2) {
          errorMessage = `Weak password. ${strength.feedback}`;
        }
      }
      break;
  }
  
  const errorElement = document.getElementById(`${fieldName}Error`);
  if (errorElement) {
    if (errorMessage) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
      input.classList.add('error');
    } else {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
      input.classList.remove('error');
    }
  }
  
  return !errorMessage;
}

// ===========================
// PASSWORD STRENGTH CHECKER
// ===========================
function checkPasswordStrength(password) {
  let score = 0;
  let feedback = [];
  
  // Check length
  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');
  
  // Check for lowercase letters
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');
  
  // Check for uppercase letters
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');
  
  // Check for numbers
  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');
  
  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Include special characters');
  
  return {
    score: score,
    feedback: feedback.length > 0 ? feedback.join(', ') : 'Strong password!'
  };
}

function authenticateUser(username, password) {
  return validCredentials.find(credential => 
    credential.username === username && credential.password === password
  );
}

function handleSuccessfulLogin(user) {
  currentUser = user;
  
  // Store user data in sessionStorage
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  
  // Display success message
  const successMessage = document.getElementById('loginSuccess');
  if (successMessage) {
    successMessage.innerHTML = `
      <h3>Welcome, ${user.name}!</h3>
      <p>You have successfully logged in as a ${user.role}.</p>
      <button type="button" class="btn btn-primary" onclick="redirectToPortal()">
        Go to Student Portal
      </button>
      <button type="button" class="btn btn-secondary" onclick="logout()">
        Logout
      </button>
    `;
    successMessage.style.display = 'block';
  }
  
  // Hide login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.style.display = 'none';
  }
  
  // Update navigation if user is logged in
  updateNavigationForUser(user);
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
  
  // Show login form again
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.style.display = 'block';
    loginForm.reset();
  }
  
  // Hide success message
  const successMessage = document.getElementById('loginSuccess');
  if (successMessage) {
    successMessage.style.display = 'none';
  }
  
  // Clear form errors
  clearFormErrors();
  
  // Update navigation
  updateNavigationForUser(null);
}

function redirectToPortal() {
  window.location.href = 'student-portal.html';
}

function displayFormErrors(errors) {
  errors.forEach(error => {
    if (error.field === 'general') {
      // Display general error
      let generalError = document.getElementById('generalError');
      if (!generalError) {
        generalError = document.createElement('div');
        generalError.id = 'generalError';
        generalError.className = 'form-error';
        const form = document.getElementById('loginForm');
        if (form) {
          form.insertBefore(generalError, form.firstChild);
        }
      }
      generalError.textContent = error.message;
      generalError.style.display = 'block';
    } else {
      // Display field-specific error
      const errorElement = document.getElementById(`${error.field}Error`);
      const inputElement = document.querySelector(`[name="${error.field}"]`);
      
      if (errorElement) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
      }
      
      if (inputElement) {
        inputElement.classList.add('error');
      }
    }
  });
}

function clearFormErrors() {
  const errorElements = document.querySelectorAll('.form-error');
  errorElements.forEach(element => {
    element.textContent = '';
    element.style.display = 'none';
  });
  
  const inputElements = document.querySelectorAll('input.error');
  inputElements.forEach(element => {
    element.classList.remove('error');
  });
}

function checkAuthentication() {
  const storedUser = sessionStorage.getItem('currentUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    updateNavigationForUser(currentUser);
    
    // If on login page and already authenticated, show success state
    if (window.location.pathname.includes('login.html')) {
      handleSuccessfulLogin(currentUser);
    }
  }
}

function updateNavigationForUser(user) {
  // This function can be extended to show/hide navigation items based on user role
  const loginLink = document.querySelector('[href="login.html"]');
  if (loginLink && user) {
    loginLink.innerHTML = `${user.name} (${user.role})`;
    loginLink.href = 'student-portal.html';
  } else if (loginLink && !user) {
    loginLink.innerHTML = 'Login';
    loginLink.href = 'login.html';
  }
}

// ===========================
// CONTACT FORM FUNCTIONALITY
// ===========================
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', handleContactForm);
}

function handleContactForm(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(event.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };
  
  // Basic validation
  if (!data.name || !data.email || !data.message) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }
  
  // Simulate form submission
  showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
  event.target.reset();
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// ===========================
// MODAL FUNCTIONALITY
// ===========================
function initializeModals() {
  // Initialize all modals
  const modals = document.querySelectorAll('.modal');
  
  modals.forEach(modal => {
    const closeButton = modal.querySelector('.modal-close');
    
    // Close modal on close button click
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        closeModal(modal.id);
      });
    }
    
    // Close modal on backdrop click
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeModal(modal.id);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus on the modal content for accessibility
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.focus();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to trigger element if available
    const triggerElement = document.querySelector(`[data-modal="${modalId}"]`);
    if (triggerElement) {
      triggerElement.focus();
    }
  }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===========================
// ACCESSIBILITY HELPERS
// ===========================
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the announcement after a brief delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

// ===========================
// GALLERY FUNCTIONALITY
// ===========================
let currentImageIndex = 0;
let galleryImages = [];

function initializeGallery() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Collect all gallery images for lightbox navigation
  galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
  
  if (filterButtons.length === 0) return; // Not on gallery page
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter gallery items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.classList.remove('hidden');
          }, 10);
        } else {
          item.classList.add('hidden');
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

function openLightbox(button) {
  const item = button.closest('.gallery-item');
  const img = item.querySelector('img');
  const title = item.querySelector('h3').textContent;
  const description = item.querySelector('p').textContent;
  
  // Find the index of the current image
  currentImageIndex = galleryImages.indexOf(img);
  
  // Update lightbox content
  document.getElementById('lightboxImage').src = img.src;
  document.getElementById('lightboxImage').alt = img.alt;
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxDescription').textContent = description;
  
  // Show lightbox
  const modal = document.getElementById('lightboxModal');
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
  
  // Restore body scroll
  document.body.style.overflow = '';
}

function nextImage() {
  if (currentImageIndex < galleryImages.length - 1) {
    currentImageIndex++;
    updateLightboxImage();
  }
}

function prevImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    updateLightboxImage();
  }
}

function updateLightboxImage() {
  const img = galleryImages[currentImageIndex];
  const item = img.closest('.gallery-item');
  const title = item.querySelector('h3').textContent;
  const description = item.querySelector('p').textContent;
  
  document.getElementById('lightboxImage').src = img.src;
  document.getElementById('lightboxImage').alt = img.alt;
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxDescription').textContent = description;
}

// ===========================
// SCROLL ANIMATIONS
// ===========================
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate on scroll
  const animateElements = document.querySelectorAll('.card, .feature-card, .gallery-item, .stat-item');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ===========================
// STATISTICS COUNTER
// ===========================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 20);
        
        counterObserver.unobserve(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// ===========================
// HERO STATISTICS ANIMATION
// ===========================
function animateHeroStats() {
  const heroCounters = document.querySelectorAll('.stat-hero-number');
  
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
  };
  
  const heroObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const statItem = counter.closest('.stat-hero-item');
        const target = parseInt(counter.getAttribute('data-target'));
        
        // Add counting animation class
        if (statItem) {
          statItem.classList.add('counting');
        }
        
        // Animate the number
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
            
            // Remove counting animation class
            if (statItem) {
              statItem.classList.remove('counting');
            }
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 16);
        
        heroObserver.unobserve(counter);
      }
    });
  }, observerOptions);
  
  heroCounters.forEach(counter => {
    heroObserver.observe(counter);
  });
}

// Call animate counters on page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(animateCounters, 1000);
  setTimeout(animateHeroStats, 500);
});

// ===========================
// GLOBAL FUNCTIONS
// ===========================
// Make some functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.nextImage = nextImage;
window.prevImage = prevImage;
window.logout = logout;
window.redirectToPortal = redirectToPortal;
window.announceToScreenReader = announceToScreenReader;

// ===========================
// PWA SERVICE WORKER REGISTRATION
// ===========================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, prompt user to refresh
                if (confirm('New version available! Refresh to update?')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch(function(error) {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

// ===========================
// ANALYTICS INTEGRATION
// ===========================
function initializeAnalytics() {
  // Google Analytics placeholder - replace with actual GA4 tracking ID
  const GA_TRACKING_ID = 'GA_MEASUREMENT_ID'; // Replace with actual ID
  
  // Load Google Analytics
  if (typeof gtag === 'undefined') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href
    });
    
    // Make gtag globally available
    window.gtag = gtag;
  }
  
  // Track page views for SPA-like navigation
  trackPageView();
}

function trackPageView(page = window.location.pathname) {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: page,
      page_title: document.title
    });
  }
}

function trackEvent(action, category = 'engagement', label = '', value = null) {
  if (typeof gtag !== 'undefined') {
    const eventParams = {
      event_category: category,
      event_label: label
    };
    
    if (value !== null) {
      eventParams.value = value;
    }
    
    gtag('event', action, eventParams);
  }
  
  console.log('Analytics Event:', { action, category, label, value });
}

// ===========================
// SKELETON LOADING STATES
// ===========================
function initializeSkeletonLoaders() {
  // Simulate loading delay for demonstration
  setTimeout(() => {
    showNewsContent();
  }, 2000); // 2 second delay to show skeleton loading
}

function showNewsContent() {
  const skeletonContent = document.querySelector('.skeleton-content');
  const newsContent = document.querySelector('.news-content');
  
  if (skeletonContent && newsContent) {
    skeletonContent.style.display = 'none';
    newsContent.style.display = 'grid';
    
    // Announce to screen readers
    announceToScreenReader('News content loaded');
    
    // Track loading completion
    trackEvent('content_loaded', 'performance', 'news_section');
  }
}