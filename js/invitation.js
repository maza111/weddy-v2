AOS.init({ duration: 800, once: true, offset: 100 });

function updateTimer() {
    const weddingDate = new Date(2026, 7, 15, 17, 0, 0);
    const now = new Date();
    const diff = weddingDate - now;
    if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();

const openMapBtn = document.getElementById('openMapBtn');
if (openMapBtn) {
    openMapBtn.addEventListener('click', () => {
        window.open('https://maps.google.com/?q=55.733998,37.394605', '_blank');
    });
}

const rsvpYesBtn = document.getElementById('rsvpYes');
const rsvpNoBtn = document.getElementById('rsvpNo');
const resultDiv = document.getElementById('rsvpResult');

function showResult(message) {
    resultDiv.textContent = message;
    resultDiv.classList.add('show');
    setTimeout(() => resultDiv.classList.remove('show'), 5000);
}

if (rsvpYesBtn) {
    rsvpYesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('guestName').value.trim();
        if (!name) { showResult('Пожалуйста, представьтесь'); return; }
        const guests = document.getElementById('guestsCount').value;
        const dietary = document.getElementById('dietary').value;
        const comment = document.getElementById('comment').value;
        let msg = `${name}, спасибо! Ждём вас${guests > 1 ? ` с компанией (${guests} чел.)` : ''}. `;
        if (dietary) msg += `Пожелания по питанию учтены. `;
        if (comment) msg += `Комментарий: "${comment}"`;
        showResult(msg + ' До встречи 15 августа! ✨');
        document.getElementById('guestName').value = '';
        document.getElementById('comment').value = '';
    });
}

if (rsvpNoBtn) {
    rsvpNoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('guestName').value.trim();
        if (!name) { showResult('Пожалуйста, представьтесь'); return; }
        showResult(`${name}, очень жаль, что вы не сможете быть с нами. Будем рады видеть вас в другой раз! 💔`);
        document.getElementById('guestName').value = '';
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) window.open(img.src, '_blank');
    });
});