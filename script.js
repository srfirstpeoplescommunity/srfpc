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

    // Mobile Dropdowns Toggle on click (when viewports are small)
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // === Photo Gallery & Lightbox Logic ===
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        // Active Filter States
        let activeFilters = {
            year: 'all',
            category: 'all'
        };

        // Filter Logic
        const filterGallery = () => {
            let visibleIndex = 0;
            galleryItems.forEach(item => {
                const itemYear = item.getAttribute('data-year');
                const itemCategory = item.getAttribute('data-category');
                
                const yearMatch = activeFilters.year === 'all' || itemYear === activeFilters.year;
                const categoryMatch = activeFilters.category === 'all' || itemCategory === activeFilters.category;
                
                if (yearMatch && categoryMatch) {
                    item.style.display = 'flex';
                    // Stagger animate delayed entries
                    item.style.animationDelay = `${visibleIndex * 0.08}s`;
                    item.classList.add('animate');
                    visibleIndex++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate');
                }
            });
        };

        // Click Handler for Filter Buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const group = btn.closest('.filter-group').getAttribute('data-filter-group');
                const value = btn.getAttribute('data-filter');
                
                // Toggle active class inside the group
                btn.closest('.filter-group').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update filters
                activeFilters[group] = value;
                filterGallery();
            });
        });

        // --- Lightbox Modal Logic ---
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDesc = document.getElementById('lightbox-desc');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        
        let currentFilteredItems = [];
        let currentIndex = 0;

        const updateLightboxContent = () => {
            if (currentFilteredItems.length === 0) return;
            const currentItem = currentFilteredItems[currentIndex];
            const imgSrc = currentItem.querySelector('img').src;
            const titleText = currentItem.querySelector('h3').textContent;
            const descText = currentItem.querySelector('p').textContent;
            const yearVal = currentItem.getAttribute('data-year');

            // Apply to lightbox DOM elements
            lightboxImg.src = imgSrc;
            lightboxTitle.innerHTML = `${titleText} <span class="gallery-badge year" style="font-size:0.72rem; vertical-align:middle; margin-left:8px; display:inline-block;">${yearVal}</span>`;
            lightboxDesc.textContent = descText;
        };

        // Open Lightbox
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Determine list of items currently visible under filters
                currentFilteredItems = Array.from(galleryItems).filter(i => i.style.display !== 'none');
                currentIndex = currentFilteredItems.indexOf(item);
                
                updateLightboxContent();
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden'; // Stop body scrolling
            });
        });

        // Close Lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                    closeLightbox();
                }
            });
        }

        // Prev/Next handlers
        const navigatePrev = (e) => {
            if (e) e.stopPropagation();
            if (currentFilteredItems.length === 0) return;
            currentIndex = (currentIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length;
            updateLightboxContent();
        };

        const navigateNext = (e) => {
            if (e) e.stopPropagation();
            if (currentFilteredItems.length === 0) return;
            currentIndex = (currentIndex + 1) % currentFilteredItems.length;
            updateLightboxContent();
        };

        if (lightboxPrev) lightboxPrev.addEventListener('click', navigatePrev);
        if (lightboxNext) lightboxNext.addEventListener('click', navigateNext);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigatePrev();
            if (e.key === 'ArrowRight') navigateNext();
        });
    }

    // === Page-Specific Ambient Audio Player (visit.html) ===
    const audioPlayer = document.getElementById('audio-player');
    const bgAudio = document.getElementById('bg-audio');
    const audioBtn = document.getElementById('audio-btn');
    const audioIcon = document.getElementById('audio-icon');
    const audioStatus = document.getElementById('audio-status');

    if (audioPlayer && bgAudio && audioBtn) {
        audioBtn.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.play()
                    .then(() => {
                        audioPlayer.classList.remove('paused');
                        audioIcon.className = 'fas fa-volume-up';
                        audioStatus.textContent = 'Mute Music';
                    })
                    .catch(err => {
                        console.error("Audio playback blocked or failed:", err);
                    });
            } else {
                bgAudio.pause();
                audioPlayer.classList.add('paused');
                audioIcon.className = 'fas fa-volume-mute';
                audioStatus.textContent = 'Play Music';
            }
        });
    }
});
