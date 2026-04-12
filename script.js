const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.05 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// 1. Fetch Images
fetch('gallery-data.json')
    .then(res => res.json())
    .then(data => {
        const personaGrid = document.getElementById('persona-grid');
        const publicGrid = document.getElementById('public-grid');
        
        const createCard = (photo) => {
            const div = document.createElement('div');
            div.className = "img-card cursor-pointer group";
            div.innerHTML = `<img src="${photo.filename}" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">`;
            div.onclick = () => {
                document.getElementById('modal-img').src = photo.filename;
                document.getElementById('image-modal').classList.remove('hidden');
                document.getElementById('image-modal').classList.add('active');
            };
            return div;
        };

        data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
        data.public.forEach(p => publicGrid.appendChild(createCard(p)));
    });

// 2. Fetch Reels with explicit Reload command
fetch('video-data.json')
    .then(res => res.json())
    .then(data => {
        const videoGrid = document.getElementById('video-grid');
        videoGrid.innerHTML = ''; // Clear loading message

        data.reels.forEach(reel => {
            const div = document.createElement('div');
            div.className = "flex justify-center min-h-[400px]"; 
            div.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${reel.url}" data-instgrm-version="14" style="width:95%; border-radius:12px; background:#000; margin:0 auto;"></blockquote>`;
            videoGrid.appendChild(div);
        });

        // THIS IS THE FIX: Tell Instagram to find the new blockquotes and turn them into videos
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    });

document.getElementById('close-modal').onclick = () => {
    document.getElementById('image-modal').classList.remove('active');
    setTimeout(() => document.getElementById('image-modal').classList.add('hidden'), 300);
};

lucide.createIcons();
