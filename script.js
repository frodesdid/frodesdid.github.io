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
    console.log('✅ Этап 1 и 2 загружены');
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
        const increment = target / 60;
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

// Функции для интерактивного элемента
let particles = [];
let particleMode = 'chaos';
let animationId = null;

function initInteractiveParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    createParticles(20);
    animateParticles();
    
    // Интерактивность
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        particles.forEach(particle => {
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
                particle.vx += (dx / distance) * 1.5;
                particle.vy += (dy / distance) * 1.5;
            }
        });
    });
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        createExplosion(mouseX, mouseY, 8);
    });
    
    // Анимация визуализатора
    animateVisualizer();
}

function createParticles(count) {
    const canvas = document.getElementById('particleCanvas');
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            life: 1
        });
    }
}

function animateParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
        // Обновляем позицию
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Границы
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Затухание
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Рисуем
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    animationId = requestAnimationFrame(animateParticles);
}

function createExplosion(x, y, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 60 + 300}, 100%, 60%)`,
            life: 1
        });
    }
}

function animateVisualizer() {
    const bars = document.querySelectorAll('.viz-bar');
    
    function updateBars() {
        bars.forEach((bar, index) => {
            const randomHeight = Math.random() * 100;
            bar.style.height = `${randomHeight}%`;
            bar.style.background = `linear-gradient(to top, 
                hsl(${Math.random() * 60 + 300}, 100%, 50%), 
                hsl(${Math.random() * 60 + 200}, 100%, 50%)
            )`;
        });
        setTimeout(updateBars, 150);
    }
    updateBars();
}

// Публичные функции для кнопок
function activateParticles() {
    const canvas = document.getElementById('particleCanvas');
    createExplosion(canvas.width / 2, canvas.height / 2, 15);
}

function changeMode() {
    const modes = ['chaos', 'order', 'pulse'];
    particleMode = modes[(modes.indexOf(particleMode) + 1) % modes.length];
    createExplosion(
        document.getElementById('particleCanvas').width / 2,
        document.getElementById('particleCanvas').height / 2,
        10
    );
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // ... предыдущий код ...
    
    initInteractiveParticles();
    console.log('✅ Этап 3 загружен: Арсенал с медиа');
});

// Анимации для секции привала
function initCampfireAnimations() {
    // Анимация появления элементов при скролле
    const frequencyItems = document.querySelectorAll('.frequency-item');
    
    const campfireObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    frequencyItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`;
        campfireObserver.observe(item);
    });
    
    // Случайные искры от костра
    setInterval(() => {
        createSpark();
    }, 2000);
    
    function createSpark() {
        const campfire = document.querySelector('.fire-animation');
        if (!campfire) return;
        
        const spark = document.createElement('div');
        spark.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: #ff9933;
            border-radius: 50%;
            bottom: 50%;
            left: ${50 + (Math.random() - 0.5) * 40}%;
            opacity: 0;
            animation: sparkFloat ${2 + Math.random() * 2}s ease-out forwards;
            z-index: 2;
        `;
        
        campfire.appendChild(spark);
        
        setTimeout(() => {
            spark.remove();
        }, 3000);
    }
    
    // Добавляем стили для искр
    const sparkStyles = document.createElement('style');
    sparkStyles.textContent = `
        @keyframes sparkFloat {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-${100 + Math.random() * 100}px) translateX(${(Math.random() - 0.5) * 50}px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(sparkStyles);
}

// Функции для музыкального плеера
function togglePlay(button) {
    const musicItem = button.closest('.music-item');
    const audio = musicItem.querySelector('.audio-element');
    const playPulse = musicItem.querySelector('.play-pulse');
    
    if (audio.paused) {
        audio.play();
        audio.setAttribute('data-playing', 'true');
        button.innerHTML = '❚❚'; // Меняем на паузу
        // Находим все кнопки play в этом элементе и обновляем их
        musicItem.querySelectorAll('.control-btn, .play-overlay-btn .play-icon').forEach(btn => {
            if (btn.classList.contains('control-btn')) {
                btn.textContent = '❚❚';
            } else if (btn.classList.contains('play-icon')) {
                btn.textContent = '❚❚';
            }
        });
    } else {
        audio.pause();
        audio.setAttribute('data-playing', 'false');
        button.innerHTML = '▶'; // Меняем на play
        // Находим все кнопки play в этом элементе и обновляем их
        musicItem.querySelectorAll('.control-btn, .play-overlay-btn .play-icon').forEach(btn => {
            if (btn.classList.contains('control-btn')) {
                btn.textContent = '▶';
            } else if (btn.classList.contains('play-icon')) {
                btn.textContent = '▶';
            }
        });
    }
}

function setVolume(slider) {
    const musicItem = slider.closest('.music-item');
    const audio = musicItem.querySelector('.audio-element');
    audio.volume = slider.value;
}

// Обновляем время воспроизведения
document.addEventListener('DOMContentLoaded', function() {
    const audioElements = document.querySelectorAll('.audio-element');
    
    audioElements.forEach(audio => {
        audio.addEventListener('timeupdate', function() {
            const currentTime = formatTime(this.currentTime);
            const timeDisplay = this.closest('.track-details').querySelector('.current-time');
            if (timeDisplay) {
                timeDisplay.textContent = currentTime;
            }
        });
        
        audio.addEventListener('ended', function() {
            this.setAttribute('data-playing', 'false');
            const musicItem = this.closest('.music-item');
            musicItem.querySelectorAll('.control-btn, .play-overlay-btn .play-icon').forEach(btn => {
                if (btn.classList.contains('control-btn')) {
                    btn.textContent = '▶';
                } else if (btn.classList.contains('play-icon')) {
                    btn.textContent = '▶';
                }
            });
        });
    });
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
});

// Обновляем инициализацию
document.addEventListener('DOMContentLoaded', function() {
    // ... предыдущий код ...
    
    initCampfireAnimations();
    console.log('✅ Все этапы загружены: Привал готов');
});

function playVKVideo(btn) {
    const iframe = btn.closest('.video-item').querySelector('iframe');
    // Добавляем autoplay к ссылке
    iframe.src = iframe.src.replace('&loop=1', '&autoplay=1&loop=1');
    btn.closest('.video-play-overlay').style.display = 'none';
}
