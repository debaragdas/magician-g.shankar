document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Scroll Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Load Data
    async function init() {
        try {
            // Instagram Reels
            const vRes = await fetch('videos-data.json');
            const vData = await vRes.json();
            const vGrid = document.getElementById('video-grid');
            vGrid.innerHTML = vData.instagramReels.map(reel => `
                <div class="glass-card rounded-2xl overflow-hidden p-2">
                    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reels/${reel.shortcode}/" data-instgrm-version="14"></blockquote>
                </div>
            `).join('');
            if (window.instgrm) window.instgrm.Embeds.process();

            // Photo Gallery
            const gRes = await fetch('gallery-data.json');
            const gData = await gRes.json();
            const gGrid = document.getElementById('gallery-grid');
            gGrid.innerHTML = gData.images.map(img => `
                <div class="aspect-square overflow-hidden rounded-xl glass-card cursor-pointer" onclick="openImg('${img.filename}')">
                    <img src="${img.filename}" class="w-full h-full object-cover hover:scale-110 transition-all duration-500">
                </div>
            `).join('');
        } catch (e) { console.error("Error loading data", e); }
    }

    // Modal Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    
    window.openImg = (src) => {
        modalImg.src = src;
        modal.classList.remove('hidden');
        modal.classList.add('active');
    };

    document.getElementById('close-modal').onclick = () => {
        modal.classList.add('hidden');
        modal.classList.remove('active');
    };

    init();
});

function shareSite() {
    if (navigator.share) {
        navigator.share({ title: 'Gauri Shankar Das', url: window.location.href });
    }
}