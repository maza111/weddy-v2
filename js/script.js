document.addEventListener('DOMContentLoaded', () => {
    // Анимация при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.pain-card, .step-item, .feature, .pricing-card, .stats-preview');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight - 80) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            } else {
                if (!el.hasAttribute('data-animated')) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                }
            }
        });
    };

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
        if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
    };

    const demoHero = document.getElementById('demoHeroBtn');
    if (demoHero) {
        demoHero.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToForm();
        });
    }

    // Кнопки тарифов
    const singleDemo = document.querySelector('.demo-single');
    const subDemo = document.querySelector('.demo-subscription');
    if (singleDemo) {
        singleDemo.addEventListener('click', () => {
            alert('Спасибо за интерес! Оставьте контакты в форме ниже.');
            scrollToForm();
        });
    }
    if (subDemo) {
        subDemo.addEventListener('click', () => {
            alert('Премиум — оптимальное решение. Заполните форму для консультации.');
            scrollToForm();
        });
    }

    // Форма
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            if (!name || !email) {
                alert('Пожалуйста, укажите имя и email');
                return;
            }
            alert(`Спасибо, ${name}! Презентация отправлена на ${email}`);
            leadForm.reset();
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
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});