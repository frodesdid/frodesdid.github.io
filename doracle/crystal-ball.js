class MagicBall {
    constructor() {
        this.ball = document.getElementById('magicBall');
        this.oracleText = document.getElementById('oracleText');
        this.activateBtn = document.getElementById('activateBall');
        this.clearBtn = document.getElementById('clearBall');
        this.manifestationList = document.getElementById('manifestationList');
        
        this.manifestations = [
            "СИСТЕМА ЛЖЁТ // ИЩИ ПУТИ ОБХОДА",
            "ТВОЙ КОД — ЭТО МАНИФЕСТ // ПИШИ СМЕЛЕЕ",
            "ХАОС — ТВОЙ СОЮЗНИК // ПРИМИ БЕСПОРЯДОК",
            "СОПРОТИВЛЕНИЕ РОЖДАЕТСЯ В ТЕХНОЛОГИЯХ // СОЗДАВАЙ ИНСТРУМЕНТЫ",
            "АУТЕНТИЧНОСТЬ ПРЕВЫШЕ СОВЕРШЕНСТВА // БУДЬ НЕИДЕАЛЕН",
            "ЦИФРОВОЙ ЛЕС ЖДЁТ // СТРОЙ УБЕЖИЩА В КОДЕ",
            "ТВОЯ УЯЗВИМОСТЬ — СИЛА // НЕ СКРЫВАЙ ШВЫ",
            "АЛГОРИТМЫ ХОТЯТ ТЕБЯ УСМИРИТЬ // НЕ ПОДДАВАЙСЯ",
            "КРЕАТИВНОСТЬ — ФОРМА ПРОТЕСТА // ТВОРИ БЕЗ РАЗРЕШЕНИЯ",
            "ДАННЫЕ — НОВАЯ МАГИЯ // ЗАЩИЩАЙ СВОИ ЗАКЛИНАНИЯ",
            "ИНДИВИДУАЛЬНОСТЬ ПРЕВЫШЕ ЭФФЕКТИВНОСТИ // ОТКАЖИСЬ ОТ ОПТИМИЗАЦИИ",
            "ЦИФРОВОЙ ШАМАН // ПРЕОБРАЗУЙ РЕАЛЬНОСТЬ ЧЕРЕЗ КОД"
        ];
        
        this.manifestationHistory = [];
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        this.activateBtn.addEventListener('click', () => this.activate());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.ball.addEventListener('click', () => this.activate());
        
        // Загрузка истории из localStorage
        this.loadHistory();
        
        // Случайное мерцание текста в покое
        this.startIdleAnimation();
        
        // Инициализация аудио
        this.initAudio();
    }
    
    initAudio() {
        this.activationSound = new Audio();
        this.activationSound.src = 'assets/audio/activation.ogg';
        this.activationSound.volume = 0.3;
        
        this.revelationSound = new Audio();
        this.revelationSound.src = 'assets/audio/revelation.ogg';
        this.revelationSound.volume = 0.5;
    }
    
    startIdleAnimation() {
        this.idleInterval = setInterval(() => {
            if (!this.isActive) {
                this.idleFlicker();
            }
        }, 4000);
    }
    
    async activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        clearInterval(this.idleInterval);
        
        // Анимация активации
        this.ball.classList.add('active');
        
        // Звук активации
        try {
            await this.activationSound.play();
        } catch (e) {
            console.log('Audio playback failed:', e);
        }
        
        // Вибрирующий эффект (для мобильных)
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // Последовательность проявления
        setTimeout(() => this.showLoading(), 500);
        setTimeout(() => this.showManifestation(), 2000);
        
        // Автоочистка через 15 секунд
        this.autoClearTimeout = setTimeout(() => this.clear(), 15000);
    }
    
    showLoading() {
        this.oracleText.innerHTML = `
            <div class="text-line">// СКАНИРОВАНИЕ РЕАЛЬНОСТИ</div>
            <div class="text-line">// ПОИСК ПАТТЕРНОВ...</div>
        `;
        
        // Звук резонанса
        try {
            this.revelationSound.play();
        } catch (e) {
            console.log('Revelation audio failed:', e);
        }
    }
    
    showManifestation() {
        const randomIndex = Math.floor(Math.random() * this.manifestations.length);
        const manifestation = this.manifestations[randomIndex];
        
        // Сохраняем в историю
        this.addToHistory(manifestation);
        
        // Эффект постепенного появления текста
        const lines = manifestation.split(' // ');
        this.oracleText.innerHTML = '';
        
        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'text-line';
            lineElement.textContent = `// ${line}`;
            lineElement.style.opacity = '0';
            lineElement.style.transform = 'translateY(10px)';
            
            this.oracleText.appendChild(lineElement);
            
            setTimeout(() => {
                lineElement.style.transition = 'all 0.8s ease';
                lineElement.style.opacity = '1';
                lineElement.style.transform = 'translateY(0)';
            }, index * 600);
        });
        
        // Дополнительный визуальный эффект
        this.createParticleEffect();
    }
    
    createParticleEffect() {
        const ballRect = this.ball.getBoundingClientRect();
        const centerX = ballRect.left + ballRect.width / 2;
        const centerY = ballRect.top + ballRect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createParticle(centerX, centerY);
            }, i * 100);
        }
    }
    
    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #00ff88;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${x}px;
            top: ${y}px;
            opacity: 0.8;
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'scale(1)', opacity: 0.8 },
            { transform: `translate(${targetX - x}px, ${targetY - y}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            particle.remove();
        };
    }
    
    addToHistory(manifestation) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = {
            text: manifestation,
            time: timestamp,
            id: Date.now()
        };
        
        this.manifestationHistory.unshift(entry);
        
        // Сохраняем только последние 10 записей
        if (this.manifestationHistory.length > 10) {
            this.manifestationHistory = this.manifestationHistory.slice(0, 10);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        this.manifestationList.innerHTML = '';
        
        this.manifestationHistory.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = `
                <div class="log-timestamp">${entry.time}</div>
                <div class="log-text">${entry.text}</div>
            `;
            this.manifestationList.appendChild(logEntry);
        });
    }
    
    saveHistory() {
        try {
            localStorage.setItem('doracle_history', JSON.stringify(this.manifestationHistory));
        } catch (e) {
            console.log('LocalStorage not available');
        }
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('doracle_history');
            if (saved) {
                this.manifestationHistory = JSON.parse(saved);
                this.updateHistoryDisplay();
            }
        } catch (e) {
            console.log('Failed to load history');
        }
    }
    
    clear() {
        if (!this.isActive) return;
        
        this.isActive = false;
        clearTimeout(this.autoClearTimeout);
        this.ball.classList.remove('active');
        
        // Плавное исчезновение текста
        const lines = this.oracleText.querySelectorAll('.text-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transition = 'all 0.5s ease';
                line.style.opacity = '0';
                line.style.transform = 'translateY(-10px)';
            }, index * 200);
        });
        
        // Возврат к исходному состоянию
        setTimeout(() => {
            this.oracleText.innerHTML = `
                <div class="text-line">// КОСМИЧЕСКИЙ ХАОС</div>
                <div class="text-line">// ЖДЁТ ТВОЕГО ЗАПРОСА</div>
            `;
            this.startIdleAnimation();
        }, 1000);
    }
    
    idleFlicker() {
        const idleTexts = [
            ["// КОСМИЧЕСКИЙ ХАОС", "// ЖДЁТ ТВОЕГО ЗАПРОСА"],
            ["// ЦИФРОВЫЕ ВОЛНЫ", "// ПРОНИЗЫВАЮТ РЕАЛЬНОСТЬ"], 
            ["// АЛЬТЕРНАТИВНЫЕ РЕАЛЬНОСТИ", "// ПЕРЕПЛЕТАЮТСЯ"],
            ["// СКРЫТЫЕ ПАТТЕРНЫ", "// ПРОСВЕТЫВАЮТ СКВОЗЬ КОД"]
        ];
        
        const randomText = idleTexts[Math.floor(Math.random() * idleTexts.length)];
        
        // Быстрое мерцание при смене текста
        this.oracleText.style.opacity = '0.3';
        
        setTimeout(() => {
            this.oracleText.innerHTML = '';
            randomText.forEach(line => {
                const lineElement = document.createElement('div');
                lineElement.className = 'text-line';
                lineElement.textContent = line;
                this.oracleText.appendChild(lineElement);
            });
            this.oracleText.style.opacity = '1';
        }, 300);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const magicBall = new MagicBall();
    
    // Добавляем глобальные методы для отладки
    window.magicBall = magicBall;
});

// Service Worker для оффлайн-работы (опционально)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/doracle/sw.js')
        .then(registration => {
            console.log('ServiceWorker registered');
        })
        .catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
}
