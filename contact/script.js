// === СИСТЕМА УПРАВЛЕНИЯ ЧАСТОТАМИ FRODES ===

class FrequencySystem {
    constructor() {
        this.frequencies = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        console.log('🎛️ FRODES Frequency System Initializing...');
        
        this.setupEventListeners();
        this.animateSystemBoot();
        this.setupFrequencyMonitoring();
        
        this.isInitialized = true;
        console.log('✅ Frequency System Ready');
    }

    setupEventListeners() {
        // Взаимодействие с частотами
        const frequencyElements = document.querySelectorAll('.frequency');
        
        frequencyElements.forEach(freq => {
            freq.addEventListener('mouseenter', (e) => {
                this.onFrequencyHover(e.target);
            });
            
            freq.addEventListener('click', (e) => {
                this.onFrequencySelect(e.target);
            });
        });

        // Анимация при загрузке
        window.addEventListener('load', () => {
            this.animatePageLoad();
        });

        // Эффекты при скролле
        window.addEventListener('scroll', () => {
            this.handleScrollEffects();
        });
    }

    onFrequencyHover(frequencyElement) {
        if (!frequencyElement.classList.contains('frequency')) return;
        
        const freq = frequencyElement.getAttribute('data-freq');
        this.updateStatus(`НАСТРОЙКА НА ЧАСТОТУ ${freq} FM...`);
        
        // Анимация силы сигнала
        const signalStrength = frequencyElement.querySelector('.signal-strength');
        if (signalStrength) {
            signalStrength.style.animation = 'signal-scan 1s infinite';
        }
    }

    onFrequencySelect(frequencyElement) {
        const platform = frequencyElement.querySelector('.freq-name').textContent;
        const freq = frequencyElement.getAttribute('data-freq');
        
        this.updateStatus(`ПЕРЕХОД НА ${platform} :: ${freq} FM`);
        this.addTerminalLog(`> ИНИЦИИРОВАН ПЕРЕХОД: ${platform}`);
        
        // Эффект загрузки перед переходом
        frequencyElement.style.background = 'rgba(0, 255, 65, 0.2)';
        
        setTimeout(() => {
            frequencyElement.style.background = '';
        }, 500);
    }

    animateSystemBoot() {
        const statusBar = document.querySelector('.status-bar');
        const terminalOutput = document.querySelector('.terminal-output');
        
        // Последовательная анимация загрузки
        setTimeout(() => {
            this.updateStatus('ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ...');
        }, 500);
        
        setTimeout(() => {
            this.updateStatus('СКАНИРОВАНИЕ ДИАПАЗОНА...');
        }, 1500);
        
        setTimeout(() => {
            this.updateStatus('СИСТЕМА ГОТОВА К РАБОТЕ');
            if (statusBar) {
                statusBar.style.background = 'var(--main-color)';
            }
        }, 3000);
    }

    animatePageLoad() {
        // Эффект появления элементов
        const elements = document.querySelectorAll('.frequency, .connection-status');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    }

    updateStatus(message) {
        const statusElement = document.querySelector('.status-text');
        if (statusElement) {
            statusElement.textContent = message;
            
            // Эффект мигания при обновлении
            statusElement.style.animation = 'none';
            setTimeout(() => {
                statusElement.style.animation = 'pulse 0.5s ease';
            }, 10);
        }
    }

    addTerminalLog(message) {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            const logLine = document.createElement('div');
            logLine.className = 'log-line';
            logLine.textContent = message;
            logLine.style.animation = 'typewriter 0.5s ease-in-out';
            
            terminalOutput.appendChild(logLine);
            
            // Автоскролл к новым сообщениям
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            
            // Ограничение количества строк
            const lines = terminalOutput.querySelectorAll('.log-line');
            if (lines.length > 8) {
                lines[0].remove();
            }
        }
    }

    setupFrequencyMonitoring() {
        // Случайные обновления статуса для живого эффекта
        const statusMessages = [
            'МОНИТОРИНГ ЭФИРА...',
            'ПРОВЕРКА ЦЕЛОСТНОСТИ СИГНАЛА...',
            'ОПТИМИЗАЦИЯ КАЧЕСТВА СВЯЗИ...',
            'СИСТЕМА СТАБИЛЬНА'
        ];
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                const randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];
                this.updateStatus(randomMessage);
            }
        }, 8000);
    }

    handleScrollEffects() {
        // Параллакс эффекты при скролле
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.frequency');
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.1 * (index % 2 === 0 ? 1 : -1);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}

// === ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ ===
document.addEventListener('DOMContentLoaded', () => {
    const frodesSystem = new FrequencySystem();
    
    // Глобальные методы для отладки
    window.frodesSystem = frodesSystem;
    
    console.log('🚀 FRODES Contact System Activated');
    console.log('📍 Accessible at: frodes.ru/contact');
});

// === ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ ===
// Случайные глитчи в тексте
function triggerRandomGlitch() {
    const titles = document.querySelectorAll('.glitch-text');
    
    titles.forEach(title => {
        if (Math.random() > 0.8) {
            title.style.animation = 'none';
            setTimeout(() => {
                title.style.animation = 'glitch-anim 0.3s ease';
            }, 10);
        }
    });
}

setInterval(triggerRandomGlitch, 3000);

// Эффект мерцания для атмосферы
function createFlicker() {
    const container = document.querySelector('.container');
    if (container && Math.random() > 0.9) {
        container.style.opacity = '0.95';
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
    }
}

setInterval(createFlicker, 2000);
