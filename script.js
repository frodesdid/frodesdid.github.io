// Параллакс эффект для визуальных элементов
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

// Эффекты для кнопок
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.spike-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.backgroundPosition = '0% 0%';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundPosition = '100% 100%';
        });
    });
    
    // Эффекты для проектов в арсенале
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const effects = [
                { transform: 'rotate(1deg) scale(1.05)', borderColor: '#ff003c' },
                { transform: 'skew(-2deg) scale(1.03)', borderColor: '#0066ff' },
                { transform: 'rotate(-1deg) scale(1.04)', borderColor: '#00ff88' }
            ];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            
            Object.assign(item.style, randomEffect);
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'none';
            item.style.borderColor = '#222';
        });
    });
});

// Партикл система для интерактивной инсталляции
let particles = [];
let particleMode = 'chaos';
let animationId = null;

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Создаем начальные частицы
    createParticles(30);
    
    // Запускаем анимацию
    animateParticles();
    
    // Добавляем интерактивность
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Взаимодействие частиц с курсором
        particles.forEach(particle => {
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.vx += (dx / distance) * 2;
                particle.vy += (dy / distance) * 2;
            }
        });
    });
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Создаем взрыв при клике
        createExplosion(mouseX, mouseY, 10);
    });
    
    // Анимация частотных полос
    animateFrequencyBars();
}

function createParticles(count) {
    const canvas = document.getElementById('particleCanvas');
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            life: 1,
            decay: Math.random() * 0.002 + 0.001
        });
    }
}

function createExplosion(x, y, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 4 + 2,
            color: `hsl(${Math.random() * 60 + 300}, 100%, 60%)`,
            life: 1,
            decay: Math.random() * 0.01 + 0.005
        });
    }
}

function animateParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Обновляем и рисуем частицы
    particles.forEach((particle, index) => {
        // Физика в зависимости от режима
        switch(particleMode) {
            case 'chaos':
                particle.vx += (Math.random() - 0.5) * 0.2;
                particle.vy += (Math.random() - 0.5) * 0.2;
                break;
            case 'order':
                // Стремление к центру
                const dx = canvas.width/2 - particle.x;
                const dy = canvas.height/2 - particle.y;
                particle.vx += dx * 0.0001;
                particle.vy += dy * 0.0001;
                break;
            case 'pulse':
                particle.size = Math.abs(Math.sin(Date.now() * 0.005 + index)) * 3 + 1;
                break;
        }
        
        // Обновляем позицию
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Затухание скорости
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Границы
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Уменьшаем жизнь
        particle.life -= particle.decay;
        
        // Рисуем если жива
        if (particle.life > 0) {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Удаляем мертвые частицы
    particles = particles.filter(p => p.life > 0);
    
    // Добавляем случайные новые частицы
    if (Math.random() < 0.1) {
        createParticles(1);
    }
    
    animationId = requestAnimationFrame(animateParticles);
}

function animateFrequencyBars() {
    const bars = document.querySelectorAll('.frequency-bars .bar');
    
    function updateBars() {
        bars.forEach((bar, index) => {
            const randomHeight = Math.random() * 100;
            const delay = index * 100;
            
            setTimeout(() => {
                bar.style.height = `${randomHeight}%`;
                bar.style.background = `linear-gradient(to top, 
                    hsl(${Math.random() * 60 + 300}, 100%, 50%), 
                    hsl(${Math.random() * 60 + 200}, 100%, 50%)
                )`;
            }, delay);
        });
        
        setTimeout(updateBars, 200);
    }
    
    updateBars();
}

// Функции для кнопок
function activateParticles() {
    createExplosion(
        document.getElementById('particleCanvas').width / 2,
        document.getElementById('particleCanvas').height / 2,
        50
    );
}

function changeParticleMode() {
    const modes = ['chaos', 'order', 'pulse'];
    const modeText = document.getElementById('modeText');
    
    const currentIndex = modes.indexOf(particleMode);
    particleMode = modes[(currentIndex + 1) % modes.length];
    
    modeText.textContent = `MODE: ${particleMode.toUpperCase()}`;
    
    // Визуальный эффект при смене режима
    createExplosion(
        document.getElementById('particleCanvas').width / 2,
        document.getElementById('particleCanvas').height / 2,
        20
    );
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    // остальной твой код...
});

// Функции для кнопок
function activateParticles() {
    createExplosion(
        document.getElementById('particleCanvas').width / 2,
        document.getElementById('particleCanvas').height / 2,
        50
    );
}

function changeParticleMode() {
    const modes = ['chaos', 'order', 'pulse'];
    const modeText = document.getElementById('modeText');
    
    const currentIndex = modes.indexOf(particleMode);
    particleMode = modes[(currentIndex + 1) % modes.length];
    
    modeText.textContent = `MODE: ${particleMode.toUpperCase()}`;
    
    // Визуальный эффект при смене режима
    createExplosion(
        document.getElementById('particleCanvas').width / 2,
        document.getElementById('particleCanvas').height / 2,
        20
    );
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    
    // Add click effects to arsenal items
    const arsenalItems = document.querySelectorAll('.arsenal-item');
    
    arsenalItems.forEach(item => {
    item.addEventListener('click', function(e) {
        // Если кликнули на audio или внутри audio плеера - не прерываем
        if (e.target.closest('audio, .audio-player, .music-player')) {
            return;
        }
        
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});


// Просто добавляем класс при наведении для дополнительных эффектов
document.addEventListener('DOMContentLoaded', function() {
    const titleContainer = document.querySelector('.title-container');
    
    titleContainer.addEventListener('mouseenter', function() {
        this.classList.add('glitch-active');
    });
    
    titleContainer.addEventListener('mouseleave', function() {
        this.classList.remove('glitch-active');
    });
});
