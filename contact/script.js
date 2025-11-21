// Пиратское радио FRODES
class PirateRadio {
    constructor() {
        this.currentFrequency = '104.7';
        this.isTransmitting = true;
        this.init();
    }

    init() {
        console.log('📻 FRODES Pirate Radio Initializing...');
        
        this.setupEventListeners();
        this.startTransmission();
        this.updateTime();
        
        setInterval(() => this.updateTime(), 1000);
        
        console.log('✅ Pirate Radio Active on frequency ' + this.currentFrequency + ' FM');
    }

    setupEventListeners() {
        // Параллакс как в основном сайте
        document.addEventListener('mousemove', (e) => {
            this.handleParallax(e);
        });

        // Взаимодействие со станциями
        const stations = document.querySelectorAll('.station-card');
        stations.forEach(station => {
            station.addEventListener('mouseenter', (e) => {
                this.onStationHover(e.target);
            });
            
            station.addEventListener('click', (e) => {
                this.onStationSelect(e.target);
            });
        });

        // Маркеры частот
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                this.changeFrequency(e.target.textContent);
            });
        });
    }

    handleParallax(e) {
        const parallaxElements = document.querySelectorAll('[data-depth]');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        parallaxElements.forEach(element => {
            const depth = parseFloat(element.getAttribute('data-depth'));
            const moveX = mouseX * depth * 100;
            const moveY = mouseY * depth * 100;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    onStationHover(station) {
        const freq = station.getAttribute('data-freq');
        this.highlightFrequency(freq);
        
        // Эффект наведения
        station.style.transform = 'translateY(-5px)';
        setTimeout(() => {
            if (!station.matches(':hover')) {
                station.style.transform = '';
            }
        }, 300);
    }

    onStationSelect(station) {
        const platform = station.querySelector('.station-name').textContent;
        const freq = station.getAttribute('data-freq');
        
        console.log(`🎧 Tuning to ${platform} on ${freq} FM`);
        
        // Эффект перехода
        this.pulseTransmission();
        
        // Можно добавить задержку для эффекта
        setTimeout(() => {
            // Переход по ссылке произойдет автоматически
        }, 500);
    }

    changeFrequency(newFreq) {
        this.currentFrequency = newFreq;
        
        // Обновляем дисплей
        const freqDisplay = document.querySelector('.freq');
        if (freqDisplay) {
            freqDisplay.textContent = newFreq;
        }
        
        // Обновляем активный маркер
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            marker.classList.remove('active');
            if (marker.textContent === newFreq) {
                marker.classList.add('active');
            }
        });
        
        this.pulseTransmission();
        console.log('🔁 Frequency changed to: ' + newFreq + ' FM');
    }

    highlightFrequency(freq) {
        const markers = document.querySelectorAll('.marker');
        markers.forEach(marker => {
            if (marker.textContent === freq) {
                marker.style.color = '#00ff88';
                marker.style.textShadow = '0 0 10px #00ff88';
            } else {
                marker.style.color = '';
                marker.style.textShadow = '';
            }
        });
    }

    pulseTransmission() {
        const statusDisplay = document.querySelector('.transmission-text');
        if (statusDisplay) {
            statusDisplay.style.animation = 'none';
            setTimeout(() => {
                statusDisplay.style.animation = 'signalPulse 0.5s ease';
            }, 10);
        }
    }

    startTransmission() {
        // Случайные эффекты передачи
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.randomStatic();
            }
        }, 5000);
    }

    randomStatic() {
        const spectrumBar = document.querySelector('.spectrum-bar');
        if (spectrumBar) {
            spectrumBar.style.animation = 'none';
            setTimeout(() => {
                spectrumBar.style.animation = 'spectrumScan 3s infinite linear';
            }, 100);
        }
    }

    updateTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeElement.textContent = timeString;
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const frodesRadio = new PirateRadio();
    window.frodesRadio = frodesRadio; // Для отладки
    
    // Частицы как в основном сайте
    const titleContainer = document.querySelector('.title-container');
    if (titleContainer) {
        titleContainer.addEventListener('mouseenter', function() {
            createRadioParticles();
        });
    }
});

// Эффект частиц для радио
function createRadioParticles() {
    const title = document.querySelector('.main-title');
    if (!title) return;
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const colors = ['#ff003c', '#0066ff', '#00ff88'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: ${randomColor};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                top: ${title.getBoundingClientRect().top + title.offsetHeight/2}px;
                left: ${title.getBoundingClientRect().left + Math.random() * title.offsetWidth}px;
                animation: radioParticleFloat 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }, i * 80);
    }
}

// Добавляем CSS для радио-частиц
const radioStyle = document.createElement('style');
radioStyle.textContent = `
    @keyframes radioParticleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-80px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(radioStyle);
