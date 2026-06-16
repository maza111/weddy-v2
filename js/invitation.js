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
document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpNoBtn = document.getElementById('rsvpNo');
    const resultDiv = document.getElementById('rsvpResult');

    function showResult(message, isSuccess = true) {
        resultDiv.textContent = message;
        resultDiv.className = 'rsvp-result-message show';
        resultDiv.style.background = isSuccess ? 'rgba(212,165,165,0.15)' : 'rgba(212,165,165,0.08)';
        resultDiv.style.color = '#1C2E4A';
        
        setTimeout(() => {
            resultDiv.classList.remove('show');
        }, 6000);
    }

    function getSelectedAlcohol() {
        const checkboxes = document.querySelectorAll('input[name="alcohol"]:checked');
        if (checkboxes.length === 0) return 'Не выбрано';
        return Array.from(checkboxes).map(cb => cb.value).join(', ');
    }

    // Обработка отправки формы (Буду с радостью)
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('guestName').value.trim();
            if (!name) {
                showResult('Пожалуйста, представьтесь ❤️', false);
                return;
            }

            const guests = document.getElementById('guestsCount').value;
            const children = document.getElementById('childrenCount').value;
            const alcohol = getSelectedAlcohol();
            const allergies = document.getElementById('allergies').value.trim() || 'Нет';
            const comment = document.getElementById('comment').value.trim() || '—';

            // Формируем сообщение
            let message = `${name}, спасибо за подтверждение! `;
            message += `Вы пришли${guests > 1 ? ` с компанией (${guests} чел.)` : ''}`;
            
            if (children > 0) {
                message += `, детей: ${children}`;
            }
            
            message += `. Алкоголь: ${alcohol}. `;
            
            if (allergies !== 'Нет') {
                message += `Аллергии: ${allergies}. `;
            }
            
            if (comment !== '—') {
                message += `Комментарий: "${comment}"`;
            }
            
            message += ' До встречи 15 августа! ✨';

            showResult(message);

            // Логируем данные (для разработки)
            console.log('RSVP Data (coming):', {
                name,
                guests,
                children,
                alcohol,
                allergies,
                comment,
                status: 'coming'
            });

            // Очищаем форму
            setTimeout(() => {
                document.getElementById('guestName').value = '';
                document.getElementById('guestsCount').value = '1';
                document.getElementById('childrenCount').value = '0';
                document.querySelectorAll('input[name="alcohol"]:checked').forEach(cb => cb.checked = false);
                document.getElementById('allergies').value = '';
                document.getElementById('comment').value = '';
            }, 3000);
        });
    }

    // Обработка кнопки "Не смогу прийти"
    if (rsvpNoBtn) {
        rsvpNoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const name = document.getElementById('guestName').value.trim();
            if (!name) {
                showResult('Пожалуйста, представьтесь 💔', false);
                return;
            }
            
            showResult(`${name}, очень жаль, что вы не сможете быть с нами. Будем рады видеть вас в другой раз! 💔`);
            
            console.log('RSVP Data (not coming):', {
                name,
                status: 'not coming'
            });
            
            document.getElementById('guestName').value = '';
            document.getElementById('guestsCount').value = '1';
            document.getElementById('childrenCount').value = '0';
            document.querySelectorAll('input[name="alcohol"]:checked').forEach(cb => cb.checked = false);
            document.getElementById('allergies').value = '';
            document.getElementById('comment').value = '';
        });
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

    // Клик по галерее — открыть фото в новом окне
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                window.open(img.src, '_blank');
            }
        });
    });
});