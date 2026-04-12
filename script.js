// 1. SCROLL ANIMATION LOGIC
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// 2. LOAD IMAGE GALLERIES
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
                     alt="${photo.caption}"
                     class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                     onerror="this.src='https://via.placeholder.com/400x600?text=Image+Not+Found'">
            `;
            div.onclick = () => openModal(photo.filename);
            return div;
        };

        // Populate Persona Gallery (1-8)
        if (data.persona) {
            data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
        }
        
        // Populate Public Gallery (1-18)
        if (data.public) {
            data.public.forEach(p => publicGrid.appendChild(createCard(p)));
        }
    })
    .catch(err => console.error("Error loading gallery data:", err));

// 3. LOAD INSTAGRAM REELS
fetch('video-data.json')
    .then(res => res.json())
    .then(data => {
        const videoGrid = document.getElementById('video-grid');
        videoGrid.innerHTML = ''; 

        data.reels.forEach(reel => {
            const div = document.createElement('div');
            div.className = "flex justify-center min-h-[450px] w-full bg-white/5 rounded-xl overflow-hidden"; 
            div.innerHTML = `
                <blockquote class="instagram-media" 
                            data-instgrm-permalink="${reel.url}" 
                            data-instgrm-version="14" 
                            style="width:100%; border:0; margin:0;">
                </blockquote>
            `;
            videoGrid.appendChild(div);
        });

        // Trigger Instagram's script to process the new blocks
        refreshInstagram();
    })
    .catch(err => console.error("Error loading video data:", err));

// 4. INSTAGRAM PROCESSOR (Ensures reels load on all devices)
function refreshInstagram() {
    const checkInterval = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(checkInterval);
        }
    }, 500);
    
    // Stop trying after 10 seconds to save performance
    setTimeout(() => clearInterval(checkInterval), 10000);
}

// 5. IMAGE MODAL LOGIC
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
