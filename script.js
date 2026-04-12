document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // 1. LOAD GALLERY
    // =========================
    fetch('gallery-data.json')
    .then(res => res.json())
    .then(data => {

        const personaGrid = document.getElementById('persona-grid');
        const publicGrid = document.getElementById('public-grid');

        const createCard = (img) => {
            const div = document.createElement('div');
            div.className = 'img-card cursor-pointer';

            div.innerHTML = `
                <img src="${img.filename}" 
                     class="w-full h-full object-cover"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
            `;

            div.onclick = () => openModal(img.filename);
            return div;
        };

        if (personaGrid) {
            personaGrid.innerHTML = '';
            data.persona.forEach(i => personaGrid.appendChild(createCard(i)));
        }

        if (publicGrid) {
            publicGrid.innerHTML = '';
            data.public.forEach(i => publicGrid.appendChild(createCard(i)));
        }

    })
    .catch(() => console.error("Gallery failed"));


    // =========================
    // 2. LOAD INSTAGRAM REELS (FINAL FIX)
    // =========================
    const videoGrid = document.getElementById('video-grid');

    fetch('video-data.json')
    .then(res => res.json())
    .then(data => {

        if (!videoGrid) return;

        videoGrid.innerHTML = '';

        data.reels.forEach(reel => {
            const wrapper = document.createElement('div');
            wrapper.className = "w-full flex justify-center";

            wrapper.innerHTML = `
                <blockquote class="instagram-media"
                    data-instgrm-permalink="${reel.url}"
                    data-instgrm-version="14"
                    style="width:100%; max-width:540px; margin:0;">
                </blockquote>
            `;

            videoGrid.appendChild(wrapper);
        });

        // 🔥 IMPORTANT: process after slight delay
        setTimeout(runInstagram, 800);

    })
    .catch(() => {
        if (videoGrid) {
            videoGrid.innerHTML = `<p class="text-red-400 text-center">Failed to load reels</p>`;
        }
    });


    // =========================
    // 3. MODAL
    // =========================
    window.openModal = function(src) {
        const modal = document.getElementById('image-modal');
        const img = document.getElementById('modal-img');

        if (modal && img) {
            img.src = src;
            modal.classList.remove('hidden');
        }
    };

    document.getElementById('image-modal')?.addEventListener('click', () => {
        document.getElementById('image-modal').classList.add('hidden');
    });

});


// =========================
// 🔥 INSTAGRAM ENGINE (FINAL)
// =========================
function runInstagram() {

    let tries = 0;

    const interval = setInterval(() => {

        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(interval);
        }

        tries++;
        if (tries > 25) {
            clearInterval(interval);
            console.warn("Instagram embed failed after retries");
        }

    }, 500);
}


// =========================
// 🔥 EXTRA: AUTO REPROCESS IF DOM CHANGES
// =========================
const observer = new MutationObserver(() => {
    if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
