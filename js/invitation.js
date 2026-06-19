// =====================================================
// ИНИЦИАЛИЗАЦИЯ AOS
// =====================================================

AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// =====================================================
// ТАЙМЕР
// =====================================================

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

// =====================================================
// КАРТА
// =====================================================

const openMapBtn = document.getElementById('openMapBtn');
if (openMapBtn) {
    openMapBtn.addEventListener('click', () => {
        window.open('https://maps.google.com/?q=55.733998,37.394605', '_blank');
    });
}

// =====================================================
// URL GOOGLE APPS SCRIPT (RSVP)
// =====================================================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQkcz3X4LrCLH_7xeVveUegZzjovW0jLkxYoWPLIvr3SyWf-_IA6dLfONweY7g3HgL/exec';

// =====================================================
// ПОПАПЫ
// =====================================================

function showPopup(id) {
    const popup = document.getElementById(id);
    if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePopup(id) {
    const popup = document.getElementById(id);
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Закрытие по клику на фон
document.querySelectorAll('.popup-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.popup-overlay.active').forEach(function(popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// =====================================================
// ОТПРАВКА ДАННЫХ В GOOGLE ТАБЛИЦУ
// =====================================================

function sendDataToSheet(data) {
    return fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('✅ Данные отправлены в Google Таблицу');
        return { success: true };
    })
    .catch(error => {
        console.error('❌ Ошибка отправки:', error);
        return { success: false, error: error };
    });
}

// =====================================================
// ПОКАЗ ПОПАПА
// =====================================================

function showResult(message, type) {
    if (type === 'success') {
        document.getElementById('popupMessage').textContent = message || 'Мы очень рады, что вы будете с нами в этот особенный день!';
        showPopup('popupSuccess');
    } else if (type === 'decline') {
        showPopup('popupDecline');
    } else {
        showPopup('popupError');
    }
}

// =====================================================
// ПОЛУЧЕНИЕ ВЫБРАННОГО АЛКОГОЛЯ
// =====================================================

function getSelectedAlcohol() {
    const checkboxes = document.querySelectorAll('input[name="alcohol"]:checked');
    if (checkboxes.length === 0) return 'Не выбрано';
    return Array.from(checkboxes).map(cb => cb.value).join(', ');
}

// =====================================================
// ОБРАБОТКА ФОРМЫ
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpNoBtn = document.getElementById('rsvpNo');

    // =====================================================
    // ОТПРАВКА "БУДУ С РАДОСТЬЮ"
    // =====================================================

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('guestName').value.trim();
            if (!name) {
                showResult('Пожалуйста, представьтесь ❤️', 'error');
                return;
            }

            const guests = parseInt(document.getElementById('guestsCount').value) || 1;
            const children = parseInt(document.getElementById('childrenCount').value) || 0;
            const alcohol = getSelectedAlcohol();
            const allergies = document.getElementById('allergies').value.trim() || 'Нет';
            const comment = document.getElementById('comment').value.trim() || '—';

            const data = {
                name: name,
                guests: guests,
                children: children,
                alcohol: alcohol,
                allergies: allergies,
                comment: comment,
                status: 'coming',
                timestamp: new Date().toISOString()
            };

            // Отправляем в Google Таблицу
            sendDataToSheet(data).then(result => {
                if (result.success) {
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

                    showResult(message, 'success');

                    // Очищаем форму
                    setTimeout(() => {
                        document.getElementById('guestName').value = '';
                        document.getElementById('guestsCount').value = '1';
                        document.getElementById('childrenCount').value = '0';
                        document.querySelectorAll('input[name="alcohol"]:checked').forEach(cb => cb.checked = false);
                        document.getElementById('allergies').value = '';
                        document.getElementById('comment').value = '';
                    }, 3000);
                } else {
                    showResult('', 'error');
                }
            });
        });
    }

    // =====================================================
    // ОТПРАВКА "НЕ СМОГУ ПРИЙТИ"
    // =====================================================

    if (rsvpNoBtn) {
        rsvpNoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const name = document.getElementById('guestName').value.trim();
            if (!name) {
                showResult('Пожалуйста, представьтесь 💔', 'error');
                return;
            }

            const data = {
                name: name,
                guests: 0,
                children: 0,
                alcohol: '—',
                allergies: '—',
                comment: '—',
                status: 'not',
                timestamp: new Date().toISOString()
            };

            sendDataToSheet(data).then(result => {
                if (result.success) {
                    showResult('', 'decline');
                    document.getElementById('guestName').value = '';
                } else {
                    showResult('', 'error');
                }
            });
        });
    }

    // =====================================================
    // ПЛАВНАЯ ПРОКРУТКА
    // =====================================================

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

    // =====================================================
    // ГАЛЕРЕЯ — ОТКРЫТИЕ ФОТО
    // =====================================================

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                window.open(img.src, '_blank');
            }
        });
    });
});