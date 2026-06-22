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
    openMapBtn.addEventListener('click', function() {
        window.open('https://maps.google.com/?q=55.733998,37.394605', '_blank');
    });
}

// =====================================================
// URL GOOGLE APPS SCRIPT (ПРЕМИУМ ТАБЛИЦА)
// =====================================================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfnFsgnechM1v6ZOh_cN9Mvcqw-xxQKI5u0HoLEi9eemBFJleXI-WRLLlDuWOnCPTsyg/exec';

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
        console.log('✅ Данные отправлены в Google Таблицу (Премиум)');
        return { success: true };
    })
    .catch(function(error) {
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
    var checkboxes = document.querySelectorAll('input[name="alcohol"]:checked');
    if (checkboxes.length === 0) return 'Не выбрано';
    var values = [];
    checkboxes.forEach(function(cb) {
        values.push(cb.value);
    });
    return values.join(', ');
}

// =====================================================
// ОБРАБОТКА ФОРМЫ (ПРЕМИУМ)
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    var rsvpForm = document.getElementById('rsvpFormPremium');
    var rsvpNoBtn = document.getElementById('rsvpNoPremium');

    // ОТПРАВКА "БУДУ С РАДОСТЬЮ"
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('guestName').value.trim();
            if (!name) {
                showResult('Пожалуйста, представьтесь ❤️', 'error');
                return;
            }

            var role = document.getElementById('guestRole').value;
            var guests = parseInt(document.getElementById('guestsCount').value) || 1;
            var children = parseInt(document.getElementById('childrenCount').value) || 0;
            var alcohol = getSelectedAlcohol();
            var allergies = document.getElementById('allergies').value.trim() || 'Нет';
            var music = document.getElementById('musicPreference').value;
            var wish = document.getElementById('wish').value.trim() || '—';

            var data = {
                name: name,
                role: role,
                guests: guests,
                children: children,
                alcohol: alcohol,
                allergies: allergies,
                music: music,
                wish: wish,
                status: 'Идёт',
                timestamp: new Date().toISOString()
            };

            sendDataToSheet(data).then(function(result) {
                if (result.success) {
                    var message = name + ', спасибо за подтверждение! ';
                    message += 'Вы пришли' + (guests > 1 ? ' с компанией (' + guests + ' чел.)' : '');
                    if (children > 0) {
                        message += ', детей: ' + children;
                    }
                    message += '. Алкоголь: ' + alcohol + '. ';
                    if (allergies !== 'Нет') {
                        message += 'Аллергии: ' + allergies + '. ';
                    }
                    if (wish !== '—') {
                        message += 'Пожелание: "' + wish + '"';
                    }
                    message += ' До встречи 15 августа! ✨';

                    showResult(message, 'success');

                    setTimeout(function() {
                        document.getElementById('guestName').value = '';
                        document.getElementById('guestRole').value = 'Гость';
                        document.getElementById('guestsCount').value = '1';
                        document.getElementById('childrenCount').value = '0';
                        document.querySelectorAll('input[name="alcohol"]:checked').forEach(function(cb) {
                            cb.checked = false;
                        });
                        document.getElementById('allergies').value = '';
                        document.getElementById('musicPreference').value = 'Любая';
                        document.getElementById('wish').value = '';
                    }, 3000);
                } else {
                    showResult('', 'error');
                }
            });
        });
    }

    // ОТПРАВКА "НЕ СМОГУ ПРИЙТИ"
    if (rsvpNoBtn) {
        rsvpNoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var name = document.getElementById('guestName').value.trim();
            if (!name) {
                showResult('Пожалуйста, представьтесь 💔', 'error');
                return;
            }

            var data = {
                name: name,
                role: '—',
                guests: 0,
                children: 0,
                alcohol: '—',
                allergies: '—',
                music: '—',
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

    // =====================================================
    // FAQ — РАСКРЫВАЮЩИЕСЯ ОТВЕТЫ
    // =====================================================

    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                item.classList.toggle('active');
            });
        }
    });

    // =====================================================
    // ПЛАВНАЯ ПРОКРУТКА
    // =====================================================

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

    // =====================================================
    // ГАЛЕРЕЯ — ОТКРЫТИЕ ФОТО
    // =====================================================

    document.querySelectorAll('.gallery-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var img = this.querySelector('img');
            if (img) {
                window.open(img.src, '_blank');
            }
        });
    });

    // =====================================================
    // АНИМАЦИЯ ЦИФР
    // =====================================================

    var factNumbers = document.querySelectorAll('.fact-number');

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'));
                var current = 0;
                var increment = target / 60;
                var timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current);
                    }
                }, 20);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    factNumbers.forEach(function(el) {
        observer.observe(el);
    });
});