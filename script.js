document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    if (window.lucide) lucide.createIcons();

    // 2. Load Gallery
    fetch('gallery-data.json')
        .then(res => res.json())
        .then(data => {
            const personaGrid = document.getElementById('persona-grid');
            const publicGrid = document.getElementById('public-grid');
            
            const createCard = (photo) => {
                const div = document.createElement('div');
                div.className = "img-card cursor-pointer group relative";
                div.innerHTML = `
                    <div class="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                        <i data-lucide="zoom-in" class="text-white w-8 h-8"></i>
                    </div>
                    <img src="${photo.filename}" loading="lazy" 
                         class="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                         onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
                `;
                div.onclick = () => openModal(photo.filename);
                return div;
            };

            if (data.persona && personaGrid) {
                data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
            }
            if (data.public && publicGrid) {
                data.public.forEach(p => publicGrid.appendChild(createCard(p)));
            }
            if (window.lucide) lucide.createIcons(); // Refresh icons for new cards
        });

    // 3. Load Reels
    const videoGrid = document.getElementById('video-grid');
    fetch('video-data.json')
        .then(res => res.json())
        .then(data => {
            if (!videoGrid) return;
            videoGrid.innerHTML = ''; 
            data.reels.forEach(reel => {
                const div = document.createElement('div');
                div.className = "flex justify-center min-h-[500px] w-full bg-white/[0.02] rounded-3xl overflow-hidden border border-white/5 shadow-inner"; 
                div.innerHTML = `
                    <blockquote class="instagram-media" data-instgrm-permalink="${reel.url}" data-instgrm-version="14" 
                                style="width:100%; border:0; margin:0; padding:0; background:transparent;">
                    </blockquote>
                `;
                videoGrid.appendChild(div);
            });
            processInstagram();
        });

    // 4. Modal Logic
    window.openModal = function(src) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        if (modal && modalImg) {
            modalImg.src = src;
            modal.classList.remove('hidden');
            setTimeout(() => modalImg.classList.remove('scale-95'), 10);
        }
    };
});

function processInstagram() {
    let attempts = 0;
    const interval = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(interval);
        }
        if (++attempts > 40) clearInterval(interval);
    }, 500);
}
