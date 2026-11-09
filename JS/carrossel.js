/* carrossel.js
   Carrossel de cartões das páginas Início, Dietas, Calculadoras e Treinos.
   Marcação esperada: [data-carousel] > [data-carousel-prev], [data-carousel-track], [data-carousel-next].
   Estilos: CSS/style-cards.css */
(() => {
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
        const track = carousel.querySelector('[data-carousel-track]');
        const previous = carousel.querySelector('[data-carousel-prev]');
        const next = carousel.querySelector('[data-carousel-next]');
        const scrollByCard = (direction) => {
            const card = track.querySelector('.card-link');
            if (!card) return;
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
        };
        previous.addEventListener('click', () => scrollByCard(-1));
        next.addEventListener('click', () => scrollByCard(1));
        const updateControls = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            previous.disabled = track.scrollLeft <= 2;
            next.disabled = track.scrollLeft >= maxScroll - 2;
        };
        track.addEventListener('scroll', updateControls, { passive: true });
        window.addEventListener('resize', updateControls);
        updateControls();
    });
})();
