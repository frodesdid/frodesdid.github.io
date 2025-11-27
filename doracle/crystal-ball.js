console.log('🚀 crystal-ball.js loaded');

class MagicBall {
    constructor() {
        console.log('🔄 MagicBall constructor started');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        console.log('🎯 Initializing MagicBall...');
        
        this.ball = document.getElementById('magicBall');
        this.oracleText = document.getElementById('oracleText');
        this.activateBtn = document.getElementById('activateBall');
        this.clearBtn = document.getElementById('clearBall');
        this.manifestationList = document.getElementById('manifestationList');
        
        // ИСПРАВЛЕННЫЕ манифестации (правильный формат)
        this.manifestations = [
            "СИСТЕМА ЛЖЁТ|ИЩИ ПУТИ ОБХОДА",
            "ТВОЙ КОД — ЭТО МАНИФЕСТ|ПИШИ СМЕЛЕЕ",
            "ХАОС — ТВОЙ СОЮЗНИК|ПРИМИ БЕСПОРЯДОК",
            "СОПРОТИВЛЕНИЕ В ТЕХНОЛОГИЯХ|СОЗДАВАЙ ИНСТРУМЕНТЫ",
            "АУТЕНТИЧНОСТЬ ПРЕВЫШЕ СОВЕРШЕНСТВА|БУДЬ НЕИДЕАЛЕН",
            "ЦИФРОВОЙ ЛЕС ЖДЁТ|СТРОЙ УБЕЖИЩА В КОДЕ",
            "ТВОЯ УЯЗВИМОСТЬ — СИЛА|НЕ СКРЫВАЙ ШВЫ",
            "АЛГОРИТМЫ ХОТЯТ УСМИРИТЬ|НЕ ПОДДАВАЙСЯ",
            "КРЕАТИВНОСТЬ — ФОРМА ПРОТЕСТА|ТВОРИ БЕЗ РАЗРЕШЕНИЯ",
            "ДАННЫЕ — НОВАЯ МАГИЯ|ЗАЩИЩАЙ СВОИ ЗАКЛИНАНИЯ"
        ];
        
        this.manifestationHistory = [];
        this.isActive = false;
        
        // Назначаем обработчики
        this.activateBtn.addEventListener('click', () => this.activate());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.ball.addEventListener('click', () => this.activate());
        
        // Загрузка истории
        this.loadHistory();
        console.log('✅ MagicBall initialized successfully');
    }
    
    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        console.log('🎯 Активация шара...');
        
        // Визуальные эффекты активации
        this.ball.classList.add('active');
        this.createActivationEffect();
        
        // Этап 1: Загрузка
        this.showLoading();
        
        // Этап 2: Проявление (через 1.5 сек)
        setTimeout(() => {
            this.showManifestation();
        }, 1500);
        
        // Автоочистка через 10 секунд
        setTimeout(() => {
            if (this.isActive) this.clear();
        }, 10000);
    }
    
    createActivationEffect() {
        // Создаем частицы вокруг шара
        for (let i = 0; i < 12; i++) {
            setTimeout(() => this.createEnergyParticle(), i * 100);
        }
        
        // Эффект пульсации
        const aura = document.querySelector('.ball-aura');
        if (aura) {
            aura.style.animation = 'pulseAura 0.5s ease-in-out 3';
        }
    }
    
    createEnergyParticle() {
        const ballRect = this.ball.getBoundingClientRect();
        const centerX = ballRect.left + ballRect.width / 2;
        const centerY = ballRect.top + ballRect.height / 2;
        
        const particle = document.createElement('div');
        const size = 3 + Math.random() * 4;
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: #${Math.random() > 0.5 ? 'ff003c' : '00ff88'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
            opacity: 0.8;
            filter: blur(1px);
        `;
        
        document.body.appendChild(particle);
        
        // Анимация разлета частиц
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'scale(1)', opacity: 0.8 },
            { transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
    
    showLoading() {
        this.oracleText.innerHTML = `
            <div class="text-line">// СКАНИРОВАНИЕ РЕАЛЬНОСТИ</div>
            <div class="text-line">// ДОСТУП К ПАТТЕРНАМ...</div>
        `;
        
        // Эффект мерцания при загрузке
        this.oracleText.style.animation = 'textFlicker 0.3s ease-in-out 3';
    }
    
    showManifestation() {
        const randomIndex = Math.floor(Math.random() * this.manifestations.length);
        const manifestation = this.manifestations[randomIndex];
        
        console.log('🔮 Проявляется:', manifestation);
        
        // Сохраняем в историю
        this.addToHistory(manifestation);
        
        // Разделяем по | вместо //
        const lines = manifestation.split('|');
        this.oracleText.innerHTML = '';
        this.oracleText.style.animation = 'none';
        
        // Анимированное появление каждой строки
        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'text-line';
            lineElement.textContent = `// ${line.trim()}`;
            lineElement.style.cssText = `
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease ${index * 0.2}s;
            `;
            
            this.oracleText.appendChild(lineElement);
            
            // Запускаем анимацию
            setTimeout(() => {
                lineElement.style.opacity = '1';
                lineElement.style.transform = 'translateY(0)';
            }, 50);
        });
        
        // Финальный эффект
        this.createRevelationEffect();
    }
    
    createRevelationEffect() {
        // Вспышка внутри шара
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, #00ff8822, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 2;
        `;
        
        this.ball.appendChild(flash);
        
        flash.animate([
            { opacity: 0.8, transform: 'translate(-50%, -50%) scale(0.8)' },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => flash.remove();
    }
    
    addToHistory(manifestation) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = {
            text: manifestation.replace(/\|/g, ' // '),
            time: timestamp,
            id: Date.now()
        };
        
        this.manifestationHistory.unshift(entry);
        if (this.manifestationHistory.length > 8) {
            this.manifestationHistory = this.manifestationHistory.slice(0, 8);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        if (!this.manifestationList) return;
        
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
        
        console.log('🧹 Очистка шара...');
        this.isActive = false;
        this.ball.classList.remove('active');
        
        // Плавное исчезновение текста
        const lines = this.oracleText.querySelectorAll('.text-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transition = 'all 0.4s ease';
                line.style.opacity = '0';
                line.style.transform = 'translateY(-10px)';
            }, index * 150);
        });
        
        // Возврат к исходному состоянию
        setTimeout(() => {
            this.oracleText.innerHTML = `
                <div class="text-line">// КОСМИЧЕСКИЙ ХАОС</div>
                <div class="text-line">// ЖДЁТ ТВОЕГО ЗАПРОСА</div>
            `;
            this.oracleText.style.animation = 'none';
            console.log('✅ Шар очищен');
        }, 600);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM fully loaded');
    window.magicBall = new MagicBall();
});

// Добавляем глобальные функции для отладки
window.debugMagicBall = function() {
    console.log('🔍 MagicBall Debug:', window.magicBall);
    return window.magicBall;
};

console.log('✅ crystal-ball.js loaded successfully');
