// 1. SCROLL REVEAL ANIMATION
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// 2. LOAD IMAGE GALLERIES (Persona & Public)
fetch('gallery-data.json')
    .then(res => res.json())
    .then(data => {
        const personaGrid = document.getElementById('persona-grid');
        const publicGrid = document.getElementById('public-grid');
        
        const createCard = (photo) => {
            const div = document.createElement('div');
            div.className = "img-card cursor-pointer group";
            div.innerHTML = `
                <img src="${photo.filename}" 
                     loading="lazy" 
                     alt="Gouri Shankar Das Performance"
                     class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                     onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
            `;
            div.onclick = () => openModal(photo.filename);
            return div;
        };

        if (data.persona) data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
        if (data.public) data.public.forEach(p => publicGrid.appendChild(createCard(p)));
    })
    .catch(err => console.error("Gallery Load Error:", err));

// 3. LOAD INSTAGRAM REELS
fetch('video-data.json')
    .then(res => res.json())
    .then(data => {
        const videoGrid = document.getElementById('video-grid');
        videoGrid.innerHTML = ''; // Clear fallback text

        data.reels.forEach(reel => {
            const div = document.createElement('div');
            div.className = "flex justify-center min-h-[450px] w-full bg-black/20 rounded-xl"; 
            div.innerHTML = `
                <blockquote class="instagram-media" 
                            data-instgrm-permalink="${reel.url}" 
                            data-instgrm-version="14" 
                            style="width:100%; border-radius:12px; background:#000; border:0; margin:0;">
                </blockquote>
            `;
            videoGrid.appendChild(div);
        });

        // Force Instagram to process the new links
        processInstagram();
    })
    .catch(err => console.error("Video Load Error:", err));

// 4. INSTAGRAM EMBED PROTECTION
function processInstagram() {
    const checkInstgrm = setInterval(() => {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
            clearInterval(checkInstgrm);
        }
    }, 500);
    
    // Stop trying after 10 seconds to save battery
    setTimeout(() => clearInterval(checkInstgrm), 10000);
}

// 5. MODAL LOGIC
function openModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    modalImg.src = src;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
}

document.getElementById('close-modal').onclick = () => {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

// 6. INITIALIZE ICONS
lucide.createIcons();
