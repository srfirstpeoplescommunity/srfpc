document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle with dynamic character switch & class trigger
    const mobileBtn = document.getElementById('mobile-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('show');
            if (navLinks.classList.contains('show')) {
                mobileBtn.innerHTML = '✕';
                mobileBtn.style.transform = 'rotate(90deg)';
            } else {
                mobileBtn.innerHTML = '☰';
                mobileBtn.style.transform = 'rotate(0deg)';
            }
        });

        // Close menu if clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('show') && !navLinks.contains(e.target) && e.target !== mobileBtn) {
                navLinks.classList.remove('show');
                mobileBtn.innerHTML = '☰';
                mobileBtn.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Dynamic Navbar Frosting & Padding Reduction on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                navbar.style.padding = '0.75rem 2rem';
                navbar.style.background = 'rgba(250, 247, 242, 0.9)';
                navbar.style.boxShadow = '0 10px 30px rgba(75, 35, 13, 0.08)';
            } else {
                navbar.style.padding = '1.25rem 4rem';
                navbar.style.background = 'rgba(250, 247, 242, 0.75)';
                navbar.style.boxShadow = 'none';
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        // Trigger once initially to set correct state
        handleScroll();
    }

    // High Performance Intersection Observer for Entry Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class to target elements
                entry.target.classList.add('animate');
                
                // If it's a scroll container, search and animate child elements
                if (entry.target.classList.contains('scroll-anim')) {
                    const img = entry.target.querySelector('.col-img');
                    const text = entry.target.querySelector('.col-text');
                    if (img) img.classList.add('animate');
                    if (text) text.classList.add('animate');
                }
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Register observers for structural columns and grid cards
    document.querySelectorAll('.scroll-anim').forEach(el => observer.observe(el));
    document.querySelectorAll('.card').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
        observer.observe(el);
    });
});
