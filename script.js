// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectImages = document.querySelectorAll('.project-image img');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const scrollProgress = document.createElement('div');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

const updateScrollProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

    scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
    navbar?.classList.toggle('scrolled', window.scrollY > 24);
};

const closeMenu = () => {
    if (!navToggle || !navMenu) return;

    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
};

const toggleMenu = () => {
    if (!navToggle || !navMenu) return;

    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
};

if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
}

projectImages.forEach(image => {
    image.addEventListener('error', () => {
        const imageWrap = image.closest('.project-image');
        const projectTitle = image.closest('.project-card')?.querySelector('h3')?.textContent || 'Project Preview';

        if (imageWrap) {
            imageWrap.classList.add('image-error');
            imageWrap.dataset.fallback = projectTitle;
        }
    });
});

// Project Filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        e.target.classList.add('active');

        // Filter projects
        const filterValue = e.target.getAttribute('data-filter');
        filterProjects(filterValue);
    });
});

const filterProjects = (filter) => {
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        clearTimeout(card.filterTimer);
        card.classList.remove('is-touch-active');

        if (filter === 'all' || category === filter) {
            card.classList.remove('is-hiding');
            card.classList.remove('hidden');
            // Trigger animation
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
            }, 10);
        } else {
            card.classList.add('is-hiding');
            card.filterTimer = setTimeout(() => {
                card.classList.add('hidden');
                card.classList.remove('is-hiding');
            }, prefersReducedMotion ? 0 : 220);
        }
    });
};


// Notification System
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Add keyframe animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }
`;
document.head.appendChild(style);

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            closeMenu();
        }
    });
});

// Navbar Active Link on Scroll
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateScrollProgress();
});

updateActiveNavLink();
updateScrollProgress();

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateStat = (stat) => {
    if (stat.dataset.animated === 'true') return;

    const numberElement = stat.querySelector('.stat-number');
    if (!numberElement) return;

    const originalText = numberElement.textContent.trim();
    const match = originalText.match(/^(\d+)(.*)$/);
    if (!match) {
        stat.dataset.animated = 'true';
        return;
    }

    const target = Number(match[1]);
    const suffix = match[2] || '';
    const duration = 900;
    const start = performance.now();

    stat.dataset.animated = 'true';

    const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        numberElement.textContent = `${Math.round(target * eased)}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            numberElement.textContent = originalText;
        }
    };

    requestAnimationFrame(update);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            if (!prefersReducedMotion && entry.target.classList.contains('stat')) {
                animateStat(entry.target);
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const revealTargets = document.querySelectorAll(
    '.section-title, .about-text, .stat, .about-actions, .skill-card, .filter-buttons, .project-card, .contact-info, .contact-method, .footer'
);

revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    if (element.classList.contains('section-title') || element.classList.contains('filter-buttons')) {
        element.classList.add('zoom-in');
    } else if (index % 3 === 1) {
        element.classList.add('from-left');
    } else if (index % 3 === 2) {
        element.classList.add('from-right');
    }
    element.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    observer.observe(element);
});

const addButtonRipples = () => {
    document.querySelectorAll('.btn, .filter-btn, .project-link').forEach(button => {
        button.addEventListener('click', (event) => {
            if (prefersReducedMotion) return;

            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');

            ripple.className = 'btn-ripple';
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;

            button.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        });
    });
};

const addPointerTilt = () => {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.skill-card, .project-card, .contact-method').forEach(card => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 7;
            const rotateX = ((0.5 - (y / rect.height)) * 7);

            card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
            card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
        });

        card.addEventListener('pointerleave', () => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        });
    });
};

const addProjectTouchOverlays = () => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;

    projectCards.forEach(card => {
        const imageWrap = card.querySelector('.project-image');
        if (!imageWrap) return;

        imageWrap.addEventListener('click', (event) => {
            if (event.target.closest('.project-link')) return;

            event.stopPropagation();
            const isActive = card.classList.contains('is-touch-active');

            projectCards.forEach(project => project.classList.remove('is-touch-active'));
            card.classList.toggle('is-touch-active', !isActive);
        });
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('.project-card')) return;
        projectCards.forEach(card => card.classList.remove('is-touch-active'));
    });
};

addButtonRipples();
addPointerTilt();
addProjectTouchOverlays();

// Add smooth scroll behavior for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollShim = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    let currentPosition = window.scrollY;
                    const targetPosition = target.offsetTop;
                    const distance = targetPosition - currentPosition;
                    const steps = Math.ceil(Math.abs(distance) / 10);
                    let step = 0;
                    
                    const scroll = () => {
                        step++;
                        window.scrollBy(0, distance / steps);
                        
                        if (step < steps) {
                            requestAnimationFrame(scroll);
                        }
                    };
                    
                    scroll();
                }
            });
        });
    };
    
    smoothScrollShim();
}

// Performance: Lazy load images (when real images are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

document.addEventListener('click', (e) => {
    if (!navMenu || !navToggle || !navMenu.classList.contains('active')) return;

    const clickedInsideMenu = navMenu.contains(e.target);
    const clickedToggle = navToggle.contains(e.target);

    if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
    }
});

// Console welcome message
console.log('%cWelcome to My Portfolio!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('Feel free to explore my projects and get in touch. Happy coding!');
