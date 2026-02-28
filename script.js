/* ========================================
   UNDANGAN PERNIKAHAN DIGITAL - Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ===== ELEMENTS =====
    const cover = document.getElementById('cover');
    const btnOpen = document.getElementById('btnOpen');
    const mainContent = document.getElementById('mainContent');
    const navbar = document.getElementById('navbar');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const wishesForm = document.getElementById('wishesForm');
    const wishesList = document.getElementById('wishesList');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let isPlaying = false;
    let currentLightboxIndex = 0;
    const galleryImages = [];

    // ===== CREATE FLOATING PETALS =====
    function createPetals(containerId, count = 15) {
        const container = document.getElementById(containerId);
        if (!container) return;
        for (let i = 0; i < count; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDuration = (8 + Math.random() * 12) + 's';
            petal.style.animationDelay = Math.random() * 10 + 's';
            petal.style.width = (8 + Math.random() * 12) + 'px';
            petal.style.height = petal.style.width;
            petal.style.opacity = 0.2 + Math.random() * 0.3;
            container.appendChild(petal);
        }
    }
    createPetals('coverPetals', 20);
    createPetals('heroPetals', 15);

    // ===== COVER OPEN =====
    btnOpen.addEventListener('click', () => {
        cover.classList.add('closing');
        // Try to play music
        if (bgMusic) {
            bgMusic.volume = 0.3;
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
            }).catch(() => {
                isPlaying = false;
            });
        }
        setTimeout(() => {
            cover.style.display = 'none';
            mainContent.classList.remove('hidden');
            document.body.style.overflow = 'auto';
        }, 1200);
    });
    // Lock scroll when cover is visible
    document.body.style.overflow = 'hidden';

    // ===== NAVBAR SCROLL EFFECT =====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('.nav-links a, .nav-logo').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== MUSIC TOGGLE =====
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.volume = 0.3;
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
            }).catch(() => { });
        }
    });

    // ===== COUNTDOWN TIMER =====
    const weddingDate = new Date('2026-06-15T08:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ===== GALLERY LIGHTBOX =====
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            galleryImages.push(img.src);
            item.addEventListener('click', () => {
                currentLightboxIndex = index;
                openLightbox(img.src);
            });
        }
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex];
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex];
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // ===== RSVP FORM =====
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rsvpName').value;
        const attendance = document.getElementById('rsvpAttendance').value;
        const guests = document.getElementById('rsvpGuests').value;

        // Save to localStorage
        const rsvpData = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
        rsvpData.push({
            name, attendance, guests,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpData));

        // Show success
        rsvpForm.classList.add('hidden');
        rsvpSuccess.classList.remove('hidden');
    });

    // ===== WISHES FORM =====
    function loadWishes() {
        // Clear old test data once
        if (!localStorage.getItem('wedding_wishes_cleaned')) {
            localStorage.removeItem('wedding_wishes');
            localStorage.setItem('wedding_wishes_cleaned', 'true');
        }
        const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        // Add some default wishes if empty
        if (wishes.length === 0) {
            wishes.push(
                { name: 'Hadi Pratama', message: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallah! 🤲', time: '2 jam yang lalu' },
                { name: 'Siti Nurhaliza', message: 'Selamat menempuh hidup baru! Semoga selalu diberkahi Allah SWT. Aamiin 💕', time: '5 jam yang lalu' },
                { name: 'Ahmad Rizky', message: 'Barakallahu lakuma wa baraka alaikuma wa jama a bainakuma fi khair 🤍', time: '1 hari yang lalu' }
            );
        }
        renderWishes(wishes);
    }

    function renderWishes(wishes) {
        wishesList.innerHTML = '';
        wishes.slice().reverse().forEach(wish => {
            const initials = wish.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const item = document.createElement('div');
            item.classList.add('wish-item');
            item.innerHTML = `
                <div class="wish-item-header">
                    <div class="wish-avatar">${initials}</div>
                    <span class="wish-name">${escapeHtml(wish.name)}</span>
                    <span class="wish-time">${wish.time || 'Baru saja'}</span>
                </div>
                <p class="wish-message">${escapeHtml(wish.message)}</p>
            `;
            wishesList.appendChild(item);
        });
    }

    wishesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('wishName').value.trim();
        const message = document.getElementById('wishMessage').value.trim();

        if (!name || !message) return;

        const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        wishes.push({ name, message, time: 'Baru saja' });
        localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

        renderWishes(wishes);

        // Reset form
        document.getElementById('wishName').value = '';
        document.getElementById('wishMessage').value = '';

        // Scroll to new wish
        wishesList.scrollTop = 0;
    });

    loadWishes();

    // ===== COPY ACCOUNT NUMBER =====
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '✅ Tersalin!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋 Salin';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                btn.textContent = '✅ Tersalin!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋 Salin';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // ===== HELPER: Escape HTML =====
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
