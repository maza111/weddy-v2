// Инициализация AOS анимаций
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Таймер до свадьбы
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

// Открыть карту
const openMapBtn = document.getElementById('openMapBtn');
if (openMapBtn) {
    openMapBtn.addEventListener('click', () => {
        window.open('https://maps.google.com/?q=55.733998,37.394605', '_blank');
    });
}

// RSVP форма
const rsvpForm = document.getElementById('rsvpForm');
const rsvpYesBtn = document.getElementById('rsvpYes');
const rsvpNoBtn = document.getElementById('rsvpNo');
const resultDiv = document.getElementById('rsvpResult');

rsvpYesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitForm('yes');
});

rsvpNoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitForm('no');
});

function submitForm(answer) {
    const name = document.getElementById('guestName').value.trim();
    const guestsCount = document.getElementById('guestsCount').value;
    const dietary = document.getElementById('dietary').value;
    const comment = document.getElementById('comment').value;

    if (!name) {
        showResult('Пожалуйста, представьтесь ❤️');
        return;
    }

    let message = '';
    if (answer === 'yes') {
        message = `${name}, спасибо за подтверждение! ${guestsCount > 1 ? `Ждём вас с компанией (${guestsCount} чел.)` : 'Ждём вас'}. `;
        if (dietary) {
            message += `Ваши пожелания по питанию учтены. `;
        }
        if (comment) {
            message += `Ваш комментарий: "${comment}"`;
        }
        message += ` До встречи 15 августа! ✨`;
    } else {
        message = `${name}, очень жаль, что вы не сможете быть с нами. Будем рады видеть вас в другой раз! 💔`;
    }

    showResult(message);
    
    // Очистка формы
    setTimeout(() => {
        document.getElementById('guestName').value = '';
        document.getElementById('guestsCount').value = '1';
        document.getElementById('dietary').value = '';
        document.getElementById('comment').value = '';
    }, 3000);
    
    // Отправка данных на сервер (пример)
    console.log('RSVP submitted:', { name, guestsCount, dietary, comment, answer });
}

function showResult(message) {
    resultDiv.textContent = message;
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        resultDiv.classList.remove('show');
    }, 5000);
}

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация для галереи при клике
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            window.open(img.src, '_blank');
        }
    });
});