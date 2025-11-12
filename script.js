// Параллакс эффект
document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('[data-depth]');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    parallaxElements.forEach(element => {
        const depth = parseFloat(element.getAttribute('data-depth'));
        const moveX = mouseX * depth * 100;
        const moveY = mouseY * depth * 100;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Анимации для манифеста
function initManifestoAnimations() {
    // Анимация появления текста
    const manifestoLines = document.querySelectorAll('.manifesto-line');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    manifestoLines.forEach(line => {
        textObserver.observe(line);
    });
    
    // Анимация счетчиков статистики
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60; // 1 секунда анимации
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    // Случайные вспышки в cyber-portrait
    const cyberPortrait = document.querySelector('.cyber-portrait');
    if (cyberPortrait) {
        setInterval(() => {
            createPortraitFlash();
        }, 3000);
    }
    
    function createPortraitFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            width: ${Math.random() * 100 + 50}px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #ff003c, transparent);
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: 0;
            animation: flashAppear 1s ease-out;
            z-index: 3;
        `;
        
        cyberPortrait.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 1000);
    }
    
    // Добавляем стили для вспышек
    const flashStyles = document.createElement('style');
    flashStyles.textContent = `
        @keyframes flashAppear {
            0% { opacity: 0; transform: translateX(-100%); }
            50% { opacity: 1; transform: translateX(0); }
            100% { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(flashStyles);
}

// Инициализируем когда страница загружена
document.addEventListener('DOMContentLoaded', function() {

// Дополнительные эффекты для заголовка
document.addEventListener('DOMContentLoaded', function() {
    const titleContainer = document.querySelector('.title-container');
    const title = document.getElementById('mainTitle');
    
    // Создаем частицы при наведении
    titleContainer.addEventListener('mouseenter', function() {
        createParticles(10);
    });
    
    function createParticles(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${Math.random() > 0.5 ? '#ff003c' : '#0066ff'};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    top: ${title.getBoundingClientRect().top + title.offsetHeight/2}px;
                    left: ${title.getBoundingClientRect().left + Math.random() * title.offsetWidth}px;
                    animation: particleFloat 1s ease-out forwards;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }, i * 100);
        }
    }
    
    console.log('✅ Этап 1 загружен: Акцидентный заголовок');
});

// Добавляем CSS для частиц
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

    initManifestoAnimations();
    console.log('✅ Этап 2 загружен: Секция манифеста');
});
