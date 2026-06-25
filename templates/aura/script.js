// =====================================================
// AURA — ИНИЦИАЛИЗАЦИЯ AOS
// =====================================================

AOS.init({
    duration: 800,
    once: false,
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
        document.getElementById('heroDays').textContent = '00';
        document.getElementById('heroHours').textContent = '00';
        document.getElementById('heroMinutes').textContent = '00';
        document.getElementById('heroSeconds').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('heroDays').textContent = days.toString().padStart(2, '0');
    document.getElementById('heroHours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('heroMinutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('heroSeconds').textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();

// =====================================================
// КАРТА
// =====================================================

const openMapBtn = document.getElementById('openMapBtn');
if (openMapBtn) {
    openMapBtn.addEventListener('click', function() {
        window.open('https://maps.google.com/?q=55.733998,37.394605', '_blank');
    });
}

// =====================================================
// ПАРЯЩИЕ СЕРДЕЧКИ
// =====================================================

(function createHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;

    const heartSymbols = ['♥'];
    const colors = ['#B3474A', '#D48C8E', '#F0E0DC', '#FDF8F6'];

    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('span');
        heart.textContent = heartSymbols[0];
        heart.style.cssText = `
            position: absolute;
            font-size: ${12 + Math.random() * 24}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            opacity: ${0.2 + Math.random() * 0.4};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatHeart ${6 + Math.random() * 8}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
            pointer-events: none;
            z-index: 1;
            user-select: none;
        `;
        container.appendChild(heart);
    }
})();

// =====================================================
// БУРГЕР-МЕНЮ
// =====================================================

const burgerToggle = document.getElementById('burgerToggle');
const burgerMenu = document.getElementById('burgerMenu');
const burgerClose = document.getElementById('burgerClose');

if (burgerToggle && burgerMenu) {
    burgerToggle.addEventListener('click', function() {
        burgerMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    burgerClose.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    burgerMenu.addEventListener('click', function(e) {
        if (e.target === burgerMenu) {
            burgerMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.querySelectorAll('.burger-link').forEach(function(link) {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

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

document.querySelectorAll('.popup-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.popup-overlay.active').forEach(function(popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// =====================================================
// ОТПРАВКА В GOOGLE ТАБЛИЦУ
// =====================================================

const SCRIPT_URL = '33';

function sendDataToSheet(data) {
    return fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(function() {
        console.log('Данные отправлены в Google Таблицу');
        return { success: true };
    })
    .catch(function(error) {
        console.error('Ошибка отправки:', error);
        return { success: false, error: error };
    });
}

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

function getSelectedAlcohol() {
    var checkboxes = document.querySelectorAll('input[name="alcohol"]:checked');
    if (checkboxes.length === 0) return 'Не выбрано';
    var values = [];
    checkboxes.forEach(function(cb) {
        values.push(cb.value);
    });
    return values.join(', ');
}

// =====================================================
// ОБРАБОТКА ФОРМЫ
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    var rsvpForm = document.getElementById('rsvpFormAura');
    var rsvpNoBtn = document.getElementById('rsvpNoAura');
    var rsvpYesBtn = document.getElementById('rsvpYesAura');

    if (rsvpYesBtn) {
        rsvpYesBtn.addEventListener('click', function(e) {
            e.preventDefault();

            var name = document.getElementById('guestName').value.trim();
            if (!name) {
                showResult('Пожалуйста, представьтесь', 'error');
                return;
            }

            var ceremony = document.querySelector('input[name="ceremony"]:checked');
            var transfer = document.querySelector('input[name="transfer"]:checked');
            var alcohol = getSelectedAlcohol();
            var wish = document.getElementById('wish').value.trim() || '—';

            var data = {
                name: name,
                ceremony: ceremony ? ceremony.value : 'Не указано',
                transfer: transfer ? transfer.value : 'Не указано',
                alcohol: alcohol,
                wish: wish,
                status: 'Идёт',
                timestamp: new Date().toISOString()
            };

            sendDataToSheet(data).then(function(result) {
                if (result.success) {
                    var message = name + ', спасибо за подтверждение! ';
                    message += 'Вы пришли. ';
                    if (ceremony) message += 'На росписи: ' + ceremony.value + '. ';
                    if (transfer) message += 'Трансфер: ' + transfer.value + '. ';
                    message += 'Алкоголь: ' + alcohol + '. ';
                    if (wish !== '—') message += 'Пожелание: "' + wish + '"';
                    message += ' До встречи 15 августа!';

                    showResult(message, 'success');

                    setTimeout(function() {
                        document.getElementById('guestName').value = '';
                        document.querySelectorAll('input[name="ceremony"]:checked').forEach(function(cb) {
                            cb.checked = false;
                        });
                        document.querySelectorAll('input[name="transfer"]:checked').forEach(function(cb) {
                            cb.checked = false;
                        });
                        document.querySelectorAll('input[name="alcohol"]:checked').forEach(function(cb) {
                            cb.checked = false;
                        });
                        document.getElementById('wish').value = '';
                    }, 3000);
                } else {
                    showResult('', 'error');
                }
            });
        });
    }

    if (rsvpNoBtn) {
        rsvpNoBtn.addEventListener('click', function(e) {
            e.preventDefault();

            var name = document.getElementById('guestName').value.trim();
            if (!name) {
                showResult('Пожалуйста, представьтесь', 'error');
                return;
            }

            var data = {
                name: name,
                ceremony: '—',
                transfer: '—',
                alcohol: '—',
                wish: '—',
                status: 'Не идёт',
                timestamp: new Date().toISOString()
            };

            sendDataToSheet(data).then(function(result) {
                if (result.success) {
                    showResult('', 'decline');
                    document.getElementById('guestName').value = '';
                } else {
                    showResult('', 'error');
                }
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});