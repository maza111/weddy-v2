document.addEventListener('DOMContentLoaded', function() {
    // =====================================================
    // АНИМАЦИЯ ПРИ СКРОЛЛЕ
    // =====================================================
    
    const animatedElements = document.querySelectorAll(
        '.pain-card, .step-item, .feature, .pricing-card, .stats-preview, .form-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
        el.classList.add('hidden');
    });

    // =====================================================
    // URL Google Apps Script (ДЛЯ ЗАЯВОК С ЛЕНДИНГА)
    // =====================================================
    
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmz35nDF8AJY_MNTMYqoS5xSNUnx88r7Vwqy5vzSNnpkV6c0WdrFKGLdbboyjGX6zg/exec';

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
            console.log('✅ Заявка отправлена в Google Таблицу');
            return { success: true };
        })
        .catch(error => {
            console.error('❌ Ошибка отправки:', error);
            return { success: false, error: error };
        });
    }

    // =====================================================
    // ФОРМА НА ЛЕНДИНГЕ
    // =====================================================
    
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            if (!name || !email) {
                alert('Пожалуйста, укажите имя и email');
                return;
            }
            
            const data = {
                name: name,
                email: email,
                phone: phone || '—',
                timestamp: new Date().toISOString()
            };
            
            sendDataToSheet(data).then(result => {
                if (result.success) {
                    alert(`Спасибо, ${name}! Мы свяжемся с вами в ближайшее время. 💌`);
                    leadForm.reset();
                } else {
                    alert('❌ Произошла ошибка. Попробуйте ещё раз или свяжитесь с нами по телефону.');
                }
            });
        });
    }

    // =====================================================
    // КНОПКИ ТАРИФОВ
    // =====================================================
    
    const singleDemo = document.querySelector('.demo-single');
    const subDemo = document.querySelector('.demo-subscription');
    
    if (singleDemo) {
        singleDemo.addEventListener('click', function() {
            alert('Спасибо за интерес к тарифу Стандарт! Оставьте контакты в форме ниже.');
            document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (subDemo) {
        subDemo.addEventListener('click', function() {
            alert('Спасибо за интерес к тарифу Премиум! Оставьте контакты в форме ниже.');
            document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // =====================================================
    // ПЛАВНЫЙ СКРОЛЛ
    // =====================================================
    
    document.querySelectorAll('.nav-links a, .btn-small').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // =====================================================
    // ПАРАЛЛАКС ДЛЯ BLOBS
    // =====================================================
    
    const blobs = document.querySelectorAll('.blob');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        blobs.forEach((blob, index) => {
            const speed = 0.02 + (index * 0.01);
            const yOffset = scrollY * speed;
            blob.style.transform = `translateY(${yOffset}px)`;
        });
    });
});