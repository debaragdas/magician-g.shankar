document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE PREMIUM ICONS
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. LOAD IMAGE GALLERIES (PERSONA & STAGE)
    fetch('gallery-data.json')
        .then(res => {
            if (!res.ok) throw new Error('Gallery data not found');
            return res.json();
        })
        .then(data => {
            const personaGrid = document.getElementById('persona-grid');
            const publicGrid = document.getElementById('public-grid');
            
            const createCard = (photo) => {
                const div = document.createElement('div');
                // Added "img-card" class for the premium styling defined in HTML
                div.className = "img-card cursor-pointer group relative aspect-[3/4] overflow-hidden bg-[#111]";
                div.innerHTML = `
                    <div class="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                        <i data-lucide="zoom-in" class="text-white w-8 h-8"></i>
                    </div>
                    <img src="${photo.filename}" 
                         loading="lazy" 
                         alt="${photo.caption || 'Gouri Shankar Das Performance'}"
                         class="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                         onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
                `;
                div.onclick = () => openModal(photo.filename);
                return div;
            };

            if (data.persona && personaGrid) {
                personaGrid.innerHTML = '';
                data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
            }
            
            if (data.public && publicGrid) {
                publicGrid.innerHTML = '';
                data.public.forEach(p => publicGrid.appendChild(createCard(p)));
            }
            
            // Re-run Lucide to render icons inside new cards
            if (window.lucide) lucide.createIcons();
        })
        .catch(err => console.error("Gallery Load Error:", err));

    // 3. LOAD INSTAGRAM REELS (PC & MOBILE OPTIMIZED)
    const videoGrid = document.getElementById('video-grid');
    
    fetch('video-data.json')
        .then(res => {
            if (!res.ok) throw new Error('video-data.json not found');
            return res.json();
        })
        .then(data => {
            if (!videoGrid) return;
            videoGrid.innerHTML = ''; 

            data.reels.forEach(reel => {
                const div = document.createElement('div');
                // Professional container to ensure Reels fit the grid perfectly
                div.className = "flex justify-center min-h-[500px] w-full bg-white/[0.02] rounded-3xl overflow-hidden border border-white/5 shadow-inner"; 
                div.innerHTML = `
                    <blockquote class="instagram-media" 
                                data-instgrm-permalink="${reel.url}" 
                                data-instgrm-version="14" 
                                style="width:100%; border:0; margin:0; padding:0; background:transparent;">
                    </blockquote>
                `;
                videoGrid.appendChild(div);
            });

            // Start the Instagram engine to process the injected blockquotes
            processInstagram();
        })
        .catch(err => {
            console.error("Video Load Error:", err);
            if (videoGrid) videoGrid.innerHTML = `<p class="text-gray-500 text-center col-span-full py-10">Syncing with Instagram...</p>`;
        });

    // 4. MODAL / LIGHTBOX LOGIC
    window.openModal = function(src) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        if (modal && modalImg) {
            modalImg.src = src;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            // Small timeout to trigger the scale animation
            setTimeout(() => {
                modalImg.classList.remove('scale-95');
                modalImg.classList.add('scale-100');
            }, 10);
        }
    };

    // Close modal on background click
    document.getElementById('image-modal')?.addEventListener('click', function() {
        const modalImg = document.getElementById('modal-img');
        modalImg.classList.add('scale-95');
        modalImg.classList.remove('scale-100');
        setTimeout(() => {
            this.classList.add('hidden');
            this.classList.remove('flex');
        }, 200);
    });
});

/**
 * Robust Instagram Embed Processor
 * Ensures the Instagram engine runs even if the script loads before the DOM elements.
 * Includes a safety retry loop for slow mobile connections.
 */
function processInstagram() {
    let attempts = 0;
    const interval = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(interval);
        }
        attempts++;
        if (attempts > 40) clearInterval(interval); // Timeout after 20 seconds
    }, 500);
}
