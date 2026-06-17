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
    // ОТПРАВКА ФОРМЫ (только iframe, без fetch)
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
            
            // Ваш URL Google Apps Script
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbyQkcz3X4LrCLH_7xeVveUegZzjovW0jLkxYoWPLIvr3SyWf-_IA6dLfONweY7g3HgL/exec';
            
            // Создаём форму
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = scriptUrl;
            form.target = 'hiddenFrame';
            form.style.display = 'none';
            
            // Поля
            const fields = {
                name: name,
                email: email,
                phone: phone || '—'
            };
            
            for (const key in fields) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields[key];
                form.appendChild(input);
            }
            
            // Создаём iframe
            let iframe = document.getElementById('hiddenFrame');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'hiddenFrame';
                iframe.name = 'hiddenFrame';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            
            // Отправляем
            document.body.appendChild(form);
            form.submit();
            
            // Удаляем форму
            setTimeout(function() {
                if (document.body.contains(form)) {
                    document.body.removeChild(form);
                }
            }, 1000);
            
            // Сообщение об успехе
            alert('Спасибо, ' + name + '! Мы свяжемся с вами в ближайшее время. 💌');
            leadForm.reset();
        });
    }

    // =====================================================
    // КНОПКИ ТАРИФОВ
    // =====================================================
    
    document.querySelectorAll('.demo-single, .demo-subscription').forEach(function(btn) {
        btn.addEventListener('click', function() {
            alert('Спасибо за интерес! Оставьте контакты в форме ниже.');
            document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
        });
    });

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
        blobs.forEach(function(blob, index) {
            const speed = 0.02 + (index * 0.01);
            blob.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
    });
});