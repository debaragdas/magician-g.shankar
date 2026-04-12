// Intersection Observer for Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Load Images from gallery-data.json
fetch('gallery-data.json')
    .then(res => res.json())
    .then(data => {
        const personaGrid = document.getElementById('persona-grid');
        const publicGrid = document.getElementById('public-grid');
        const createCard = (photo) => {
            const div = document.createElement('div');
            div.className = "group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/4] bg-gray-900";
            div.innerHTML = `<img src="${photo.filename}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">`;
            div.onclick = () => openModal(photo.filename);
            return div;
        };
        data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
        data.public.forEach(p => publicGrid.appendChild(createCard(p)));
    });

// Load Videos from video-data.json
fetch('video-data.json')
    .then(res => res.json())
    .then(data => {
        const videoGrid = document.getElementById('video-grid');
        data.reels.forEach(reel => {
            const div = document.createElement('div');
            div.className = "flex justify-center";
            div.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${reel.url}" data-instgrm-version="14" style="width:100%; border-radius:12px; background:#000;"></blockquote>`;
            videoGrid.appendChild(div);
        });
        // Refresh Instagram embeds after adding them
        if (window.instgrm) window.instgrm.Embeds.process();
    });

function openModal(src) {
    const m = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    m.classList.remove('hidden');
    setTimeout(() => m.classList.add('active'), 10);
}

document.getElementById('close-modal').onclick = () => {
    const m = document.getElementById('image-modal');
    m.classList.remove('active');
    setTimeout(() => m.classList.add('hidden'), 300);
};
