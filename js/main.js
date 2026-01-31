/**
 * She Seeks Sakeenah - Main JavaScript
 * Dynamic component loader and interactions
 */

// ==========================================
// COMPONENT LOADER
// ==========================================

/**
 * Load an HTML component into a placeholder element
 * @param {string} elementId - The ID of the placeholder element
 * @param {string} componentPath - Path to the component HTML file
 */
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    }
  } catch (error) {
    console.error('Error loading component:', error);
  }
}

/**
 * Initialize all dynamic components
 */
async function initComponents() {
  // Determine the base path for components
  const basePath = getBasePath();
  
  // Load header and footer
  await Promise.all([
    loadComponent('header-placeholder', `${basePath}components/header.html`),
    loadComponent('footer-placeholder', `${basePath}components/footer.html`)
  ]);
  
  // After components are loaded, initialize their functionality
  initHeader();
  initActiveNavLink();
  updateCopyrightYear();
}

/**
 * Get the base path for component loading
 * Handles both root and subdirectory page locations
 */
function getBasePath() {
  const path = window.location.pathname;
  // If we're in a subdirectory, adjust the path
  if (path.includes('/pages/')) {
    return '../';
  }
  return '';
}

// ==========================================
// HEADER FUNCTIONALITY
// ==========================================

function initHeader() {
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (!header) return;
  
  // Scroll effect for header
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add shadow on scroll
    if (currentScrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    lastScrollY = currentScrollY;
  });
  
  // Mobile menu toggle
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('header__nav--open');
      menuToggle.classList.toggle('active');
      
      // Toggle aria-expanded
      const isOpen = mainNav.classList.contains('header__nav--open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    // Close menu when clicking nav links
    const navLinks = mainNav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('header__nav--open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/**
 * Set active state on navigation links based on current page
 */
function initActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('.nav__link');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');
    if (linkPage === currentPage) {
      link.classList.add('nav__link--active');
    }
  });
}

/**
 * Get the current page name from the URL
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '') || 'index';
  
  // Map index to home
  if (filename === 'index' || filename === '') {
    return 'home';
  }
  
  return filename;
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stagger-item');
  
  if (!animatedElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

// ==========================================
// ACCORDION FUNCTIONALITY
// ==========================================

function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion__header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('accordion__item--open');
      
      // Close all other items (optional - remove for multi-open)
      const allItems = document.querySelectorAll('.accordion__item');
      allItems.forEach(i => i.classList.remove('accordion__item--open'));
      
      // Toggle current item
      if (!isOpen) {
        item.classList.add('accordion__item--open');
      }
    });
  });
}

// ==========================================
// FORM HANDLING
// ==========================================

function initForms() {
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission (replace with actual API call)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Show success message
  showNotification('Message sent successfully! We\'ll be in touch soon, in shā\' Allāh.', 'success');
  form.reset();
  
  // Reset button
  submitBtn.textContent = originalText;
  submitBtn.disabled = false;
}

async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Validate email
  if (!emailInput.value || !emailInput.validity.valid) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }
  
  // Show loading state
  submitBtn.textContent = 'Subscribing...';
  submitBtn.disabled = true;
  
  // Simulate subscription (replace with actual API call)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Show success message
  showNotification('Welcome to the sisterhood! Check your inbox for a confirmation.', 'success');
  form.reset();
  
  // Reset button
  submitBtn.textContent = originalText;
  submitBtn.disabled = false;
}

// ==========================================
// NOTIFICATIONS
// ==========================================

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification__close" aria-label="Close">&times;</button>
  `;
  
  // Add styles if not already in CSS
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? '#4A6B5D' : type === 'error' ? '#C94D4D' : '#2C4A4A'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Close button functionality
  notification.querySelector('.notification__close').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function updateCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Smooth scroll to element
 */
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Handle anchor links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    if (targetId !== '#') {
      scrollToElement(targetId);
    }
  }
});

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  // Load dynamic components first
  await initComponents();
  
  // Initialize all functionality
  initScrollAnimations();
  initAccordions();
  initForms();
  
  // Add animation keyframes if not in CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});
