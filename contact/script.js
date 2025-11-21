// FRODES Channels System
class ChannelsSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎵 FRODES Channels System Initializing...');
        
        this.setupEventListeners();
        this.setupParallax();
        this.animateSystem();
        
        console.log('✅ Channels System Ready');
    }

    setupEventListeners() {
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

        // Анимации карточек
        const cards = document.querySelectorAll('.channel-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.animateCardHover(e.target);
            });
            
            card.addEventListener('click', (e) => {
                this.onChannelSelect(e.target.closest('.channel-card'));
            });
        });

        // Заголовок с частицами
        const title = document.querySelector('.main-title');
        if (title) {
            title.addEventListener('mouseenter', () => {
                this.createParticles();
            });
        }
    }

    setupParallax() {
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
    }

    animateCardHover(card) {
        const platform = card.getAttribute('data-platform');
        console.log(`🎯 Hovering over ${platform}`);
        
        // Анимация качества соединения
        this.animateQualityBars();
    }

    onChannelSelect(card) {
        const platform = card.querySelector('.channel-name').textContent;
        console.log(`🚀 Redirecting to ${platform}`);
        
        // Эффект перед переходом
        card.style.background = 'rgba(0, 102, 255, 0.1)';
        setTimeout(() => {
            card.style.background = '';
        }, 300);
    }

    animateSystem() {
        // Анимация статуса
        setInterval(() => {
            this.pulseStatus();
        }, 4000);
    }

    pulseStatus() {
        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            statusDot.style.animation = 'none';
            setTimeout(() => {
                statusDot.style.animation = 'statusPulse 2s infinite';
            }, 10);
        }
    }

    animateQualityBars() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('active');
                setTimeout(() => {
                    if (!bar.parentElement.matches(':hover')) {
                        bar.classList.remove('active');
                    }
                }, 1000);
            }, index * 100);
        });
    }

    createParticles() {
        const title = document.querySelector('.main-title');
        if (!title) return;
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const colors = ['#ff003c', '#0066ff', '#00ff88'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${randomColor};
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
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new ChannelsSystem();
});
