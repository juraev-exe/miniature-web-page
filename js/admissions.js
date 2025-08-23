// ===========================
// ADMISSIONS PAGE SPECIFIC JAVASCRIPT
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize admissions page specific functionality
    initApplicationProcess();
    initRequirementsChecklists();
    initScholarshipCards();
    initTuitionCalculator();
    initApplicationForm();
    initDeadlineCountdown();
});

// Application process step animation
function initApplicationProcess() {
    const processSteps = document.querySelectorAll('.process-step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(50px) scale(0.9)';
        step.style.transition = 'all 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)';
        observer.observe(step);
    });
}

// Requirements checklists
function initRequirementsChecklists() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    
    checklistItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    item.classList.add('completed');
                    // Add checkmark animation
                    const checkmark = item.querySelector('.checkmark');
                    if (checkmark) {
                        checkmark.style.animation = 'checkmarkSlide 0.3s ease-in-out';
                    }
                } else {
                    item.classList.remove('completed');
                }
                updateProgressBar();
            });
        }
    });
}

function updateProgressBar() {
    const progressBar = document.querySelector('.requirements-progress');
    if (!progressBar) return;
    
    const total = document.querySelectorAll('.checklist-item').length;
    const completed = document.querySelectorAll('.checklist-item.completed').length;
    const percentage = (completed / total) * 100;
    
    progressBar.style.width = percentage + '%';
    
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${completed}/${total} requirements completed`;
    }
}

// Scholarship cards hover effects
function initScholarshipCards() {
    const scholarshipCards = document.querySelectorAll('.scholarship-card');
    
    scholarshipCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add glow effect
            const glowEffect = document.createElement('div');
            glowEffect.className = 'card-glow';
            this.appendChild(glowEffect);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            // Remove glow effect
            const glowEffect = this.querySelector('.card-glow');
            if (glowEffect) {
                glowEffect.remove();
            }
        });
        
        // Scholarship application button
        const applyBtn = card.querySelector('.apply-scholarship-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showScholarshipModal(card);
            });
        }
    });
}

// Tuition calculator
function initTuitionCalculator() {
    const calculator = document.querySelector('.tuition-calculator');
    if (!calculator) return;
    
    const programSelect = calculator.querySelector('#program-select');
    const residencySelect = calculator.querySelector('#residency-select');
    const creditsInput = calculator.querySelector('#credits-input');
    const calculateBtn = calculator.querySelector('.calculate-btn');
    const resultDiv = calculator.querySelector('.calculation-result');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const program = programSelect ? programSelect.value : '';
            const residency = residencySelect ? residencySelect.value : '';
            const credits = creditsInput ? parseInt(creditsInput.value) || 0 : 0;
            
            const tuition = calculateTuition(program, residency, credits);
            
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="tuition-breakdown">
                        <h4>Estimated Tuition Cost</h4>
                        <div class="cost-item">
                            <span>Base Tuition (${credits} credits):</span>
                            <span>$${tuition.base.toLocaleString()}</span>
                        </div>
                        <div class="cost-item">
                            <span>Fees:</span>
                            <span>$${tuition.fees.toLocaleString()}</span>
                        </div>
                        <div class="cost-total">
                            <span>Total:</span>
                            <span>$${tuition.total.toLocaleString()}</span>
                        </div>
                    </div>
                `;
                resultDiv.style.display = 'block';
                resultDiv.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

function calculateTuition(program, residency, credits) {
    // Sample tuition calculation logic
    const rates = {
        undergraduate: { instate: 300, outstate: 800 },
        graduate: { instate: 500, outstate: 1200 },
        doctoral: { instate: 600, outstate: 1400 }
    };
    
    const rate = rates[program] ? rates[program][residency] || rates[program].outstate : 500;
    const base = rate * credits;
    const fees = Math.floor(base * 0.1); // 10% fees
    
    return {
        base: base,
        fees: fees,
        total: base + fees
    };
}

// Application form validation and submission
function initApplicationForm() {
    const applicationForm = document.querySelector('.application-form');
    if (!applicationForm) return;
    
    const formInputs = applicationForm.querySelectorAll('input, select, textarea');
    const submitBtn = applicationForm.querySelector('.submit-application-btn');
    
    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Form submission
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            submitApplication(applicationForm);
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show/hide error
    showFieldError(field, isValid, errorMessage);
    return isValid;
}

function showFieldError(field, isValid, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.toggle('error', !isValid);
    formGroup.classList.toggle('success', isValid && field.value.trim());
    
    let errorDiv = formGroup.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = isValid ? 'none' : 'block';
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('error');
    }
}

function submitApplication(form) {
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please correct the errors before submitting', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-application-btn');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Application submitted successfully! You will receive a confirmation email shortly.', 'success');
        form.reset();
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 2000);
}

// Deadline countdown
function initDeadlineCountdown() {
    const countdownElements = document.querySelectorAll('.deadline-countdown');
    
    countdownElements.forEach(element => {
        const deadline = element.getAttribute('data-deadline');
        if (deadline) {
            updateCountdown(element, new Date(deadline));
            
            // Update every second
            setInterval(() => {
                updateCountdown(element, new Date(deadline));
            }, 1000);
        }
    });
}

function updateCountdown(element, deadline) {
    const now = new Date().getTime();
    const timeLeft = deadline.getTime() - now;
    
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        element.innerHTML = `
            <div class="countdown-item">
                <span class="countdown-number">${days}</span>
                <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${hours}</span>
                <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${minutes}</span>
                <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${seconds}</span>
                <span class="countdown-label">Seconds</span>
            </div>
        `;
    } else {
        element.innerHTML = '<span class="deadline-expired">Deadline has passed</span>';
        element.classList.add('expired');
    }
}

// Scholarship modal
function showScholarshipModal(card) {
    const modal = document.createElement('div');
    modal.className = 'scholarship-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Apply for Scholarship</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>You are applying for: <strong>${card.querySelector('h3').textContent}</strong></p>
                <form class="scholarship-form">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" required>
                    </div>
                    <div class="form-group">
                        <label>GPA *</label>
                        <input type="number" step="0.1" min="0" max="4" required>
                    </div>
                    <div class="form-group">
                        <label>Personal Statement *</label>
                        <textarea rows="4" required placeholder="Why do you deserve this scholarship?"></textarea>
                    </div>
                    <button type="submit" class="submit-scholarship-btn">Submit Application</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Form submission
    const form = modal.querySelector('.scholarship-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Scholarship application submitted successfully!', 'success');
        document.body.removeChild(modal);
    });
}

// Program comparison tool
function initProgramComparison() {
    const compareButtons = document.querySelectorAll('.compare-program-btn');
    const comparisonPanel = document.querySelector('.program-comparison');
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const programCard = this.closest('.program-card');
            const programName = programCard.querySelector('h3').textContent;
            
            addToComparison(programName, programCard);
        });
    });
}

function addToComparison(programName, programCard) {
    // Implementation for program comparison feature
    console.log('Adding program to comparison:', programName);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initProgramComparison();
});
