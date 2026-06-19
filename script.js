// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

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
        
        if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            // Trigger animation
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
            }, 10);
        } else {
            card.classList.add('hidden');
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

            // Close mobile menu if open (for future mobile menu implementation)
            closeMenu();
        }
    });
});

// Menu toggle function (for future expansion)
const closeMenu = () => {
    // Placeholder for mobile menu close functionality
};

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
            document.querySelectorAll('.nav-link').forEach(link => {
                link.style.color = '';
            });
            if (navLink) {
                navLink.style.color = 'var(--accent-color)';
            }
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}, observerOptions);

// Observe skill cards
document.querySelectorAll('.skill-card').forEach(card => {
    observer.observe(card);
});

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

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
        // Close any open modals or menus (extensible)
    }
});

// Console welcome message
console.log('%cWelcome to My Portfolio! 🎉', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('Feel free to explore my projects and get in touch. Happy coding! 💻');
