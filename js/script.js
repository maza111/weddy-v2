// Анимация при скролле
document.addEventListener('DOMContentLoaded', () => {
    // Анимация элементов
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.pain-card, .step-item, .feature, .pricing-card, .stats-preview');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight - 80) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            } else {
                if (!el.hasAttribute('data-animated') && el.style.opacity !== '0') {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                }
            }
        });
    };

    // Устанавливаем начальные стили
    document.querySelectorAll('.pain-card, .step-item, .feature, .pricing-card, .stats-preview').forEach(el => {
        if (!el.style.opacity) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Скролл к форме
    const scrollToForm = () => {
        const formSection = document.getElementById('demo');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Кнопки демо
    const demoHero = document.getElementById('demoHeroBtn');
    if (demoHero) {
        demoHero.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToForm();
        });
    }

    const presentationBtn = document.getElementById('presentationBtn');
    if (presentationBtn) {
        presentationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Смотрите пример в новом окне (демо-режим). А чтобы создать своё приглашение — заполните форму ниже!');
            scrollToForm();
        });
    }

    // Кнопки тарифов
    const singleDemo = document.querySelector('.demo-single');
    const subDemo = document.querySelector('.demo-subscription');
    if (singleDemo) {
        singleDemo.addEventListener('click', () => {
            alert('✨ Отличный выбор! Оставьте контакты в форме, и мы пришлём инструкцию по созданию приглашения.');
            scrollToForm();
        });
    }
    if (subDemo) {
        subDemo.addEventListener('click', () => {
            alert('💎 Премиум — идеально для особенного дня. Заполните форму, мы поможем с индивидуальным дизайном!');
            scrollToForm();
        });
    }

    // Обработка формы
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            if (!name || !email) {
                alert('Пожалуйста, укажите имя и email, чтобы получить пример приглашения 💕');
                return;
            }
            alert(`Спасибо, ${name}! Мы отправили пример приглашения на ${email}. А также чек-лист невесты в подарок! 🎁`);
            leadForm.reset();
            console.log('Lead data ready for backend:', { 
                name, 
                email, 
                phone: document.getElementById('phone').value,
                source: 'Weddy landing'
            });
        });
    }

    // Плавный скролл для навигации
    document.querySelectorAll('.nav-links a, .btn-small').forEach(anchor => {
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
});