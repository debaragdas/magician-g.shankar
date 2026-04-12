// Scroll Animation Logic
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Dynamic Gallery Loading
fetch('gallery-data.json')
    .then(res => res.json())
    .then(data => {
        const personaGrid = document.getElementById('persona-grid');
        const publicGrid = document.getElementById('public-grid');

        const createCard = (photo) => {
            const div = document.createElement('div');
            div.className = "group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/4] bg-gray-900 shadow-md";
            div.innerHTML = `
                <img src="${photo.filename}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p class="text-[9px] text-purple-400 tracking-widest uppercase font-bold">${photo.caption}</p>
                </div>
            `;
            div.onclick = () => openModal(photo.filename);
            return div;
        };

        if(data.persona) data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
        if(data.public) data.public.forEach(p => publicGrid.appendChild(createCard(p)));
    })
    .catch(err => console.error("Gallery initialization failed:", err));

// Image Modal Functions
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
