// Интерактив на странице приглашения

document.addEventListener('DOMContentLoaded', () => {
    let selectedAnswer = null;
    
    const options = document.querySelectorAll('.rsvp-option');
    const guestsBlock = document.getElementById('guestsBlock');
    const commentBlock = document.getElementById('commentBlock');
    const submitBtn = document.getElementById('submitRsvp');
    const resultDiv = document.getElementById('rsvpResult');
    const guestNameInput = document.getElementById('guestName');
    const guestsCount = document.getElementById('guestsCount');
    const guestComment = document.getElementById('guestComment');
    
    // Обработка выбора варианта ответа
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedAnswer = option.getAttribute('data-answer');
            
            if (selectedAnswer === 'yes') {
                guestsBlock.style.display = 'block';
                commentBlock.style.display = 'block';
            } else {
                guestsBlock.style.display = 'none';
                commentBlock.style.display = 'none';
            }
        });
    });
    
    // Отправка ответа
    submitBtn.addEventListener('click', () => {
        const name = guestNameInput.value.trim();
        
        // Валидация
        if (!name) {
            showResult('Пожалуйста, представьтесь', 'error');
            return;
        }
        
        if (!selectedAnswer) {
            showResult('Пожалуйста, выберите вариант ответа', 'error');
            return;
        }
        
        // Формируем ответ
        let responseText = '';
        if (selectedAnswer === 'yes') {
            const guests = guestsCount ? guestsCount.value : '1';
            const comment = guestComment ? guestComment.value : '';
            responseText = `${name}, спасибо за подтверждение! Ждём вас${guests > 1 ? ' с компанией' : ''} на нашем празднике.`;
            if (comment) {
                responseText += ` Ваши пожелания учтены.`;
            }
        } else {
            responseText = `${name}, очень жаль, что вы не сможете быть с нами. Будем рады видеть вас в другой раз!`;
        }
        
        showResult(responseText, 'success');
        
        // Очистка формы (опционально)
        setTimeout(() => {
            guestNameInput.value = '';
            options.forEach(opt => opt.classList.remove('selected'));
            guestsBlock.style.display = 'none';
            commentBlock.style.display = 'none';
            if (guestsCount) guestsCount.value = '1';
            if (guestComment) guestComment.value = '';
            selectedAnswer = null;
        }, 3000);
        
        // Здесь можно добавить реальную отправку на сервер
        console.log('RSVP data:', {
            name: name,
            answer: selectedAnswer,
            guests: selectedAnswer === 'yes' ? (guestsCount ? guestsCount.value : '1') : null,
            comment: selectedAnswer === 'yes' ? (guestComment ? guestComment.value : '') : null
        });
    });
    
    function showResult(message, type) {
        resultDiv.innerHTML = message;
        resultDiv.className = 'rsvp-result success';
        
        setTimeout(() => {
            resultDiv.style.display = 'none';
            resultDiv.className = 'rsvp-result';
        }, 4000);
    }
});