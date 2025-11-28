// ===== ГЛАВНЫЙ КЛАСС МАГИЧЕСКОГО ШАРА =====
class MagicBall {
    constructor() {
        this.oracle = new OracleEngine();
        this.effects = new RitualEffects();
        
        this.ball = null;
        this.revelationDisplay = null;
        this.activateBtn = null;
        this.clearBtn = null;
        this.archiveContainer = null;
        
        this.isActive = false;
        this.currentManifestation = null;
        this.autoClearTimeout = null;
        
        this.init();
    }

    // Инициализация
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeElements();
            this.initializeEvents();
            this.effects.initialize();
            this.oracle.loadHistory();
            this.updateArchive();
            
            console.log('🔮 Магический Шар инициализирован');
        });
    }

    // Инициализация элементов DOM
    initializeElements() {
        this.ball = document.getElementById('magicBall');
        this.revelationDisplay = document.querySelector('.revelation-display');
        this.activateBtn = document.getElementById('activateBall');
        this.clearBtn = document.getElementById('clearBall');
        this.archiveContainer = document.querySelector('.archive-entries');

        if (!this.ball) {
            console.error('❌ Магический шар не найден в DOM');
            return;
        }
    }

    // Инициализация событий
    initializeEvents() {
        // Активация по клику на шар
        this.ball.addEventListener('click', (e) => {
            e.stopPropagation();
            this.activateRitual();
        });

        // Активация по кнопке
        this.activateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.activateRitual();
        });

        // Очистка
        this.clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearRitual();
        });

        // Активация по пробелу
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isActive) {
                e.preventDefault();
                this.activateRitual();
            }
        });

        // Предотвращение выделения текста при двойном клике
        this.ball.addEventListener('mousedown', (e) => {
            if (e.detail > 1) e.preventDefault();
        });
    }

    // Активация ритуала
    async activateRitual() {
        if (this.isActive) {
            console.log('⚠️ Ритуал уже активен');
            return;
        }

        console.log('🎯 Запуск ритуала...');
        this.isActive = true;

        // Визуальные изменения
        this.ball.classList.add('active');
        this.showLoadingState();

        // Эффекты активации
        const ballRect = this.ball.getBoundingClientRect();
        const centerX = ballRect.left + ballRect.width / 2;
        const centerY = ballRect.top + ballRect.height / 2;
        
        this.effects.createActivationEffect(centerX, centerY);

        // Получение манифестации
        setTimeout(() => {
            this.revealManifestation(centerX, centerY);
        }, 2000);

        // Автоочистка через 15 секунд
        this.autoClearTimeout = setTimeout(() => {
            if (this.isActive) {
                this.clearRitual();
            }
        }, 15000);
    }

    // Показать состояние загрузки
    showLoadingState() {
        const loadingTexts = [
            "СКАНИРОВАНИЕ РЕАЛЬНОСТИ",
            "ДОСТУП К ПАТТЕРНАМ",
            "ДЕКОДИРОВАНИЕ ИСТИНЫ",
            "ПОДКЛЮЧЕНИЕ К ИСТОЧНИКУ"
        ];

        const randomText = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];

        this.revelationDisplay.innerHTML = `
            <div class="revelation-text">
                <div class="revelation-line">// ${randomText}</div>
                <div class="revelation-line">// ПОДОЖДИТЕ...</div>
            </div>
        `;

        // Анимация появления
        this.animateTextRevelation();
    }

    // Проявление манифестации
    revealManifestation(centerX, centerY) {
        const manifestation = this.oracle.getRandomManifestation();
        this.currentManifestation = manifestation;

        console.log('🔮 Проявляется:', manifestation.text);

        // Эффекты проявления
        this.effects.createRevelationEffect(centerX, centerY, manifestation.intensity);

        // Отображение текста
        const lines = manifestation.text.split(' | ');
        this.revelationDisplay.innerHTML = `
            <div class="revelation-text">
                ${lines.map(line => `<div class="revelation-line">// ${line}</div>`).join('')}
                <div class="revelation-source">— ОРАКУЛ THEFRODESDID</div>
            </div>
        `;

        // Анимация текста
        this.animateTextRevelation();

        // Обновление архива
        this.updateArchive();
    }

    // Анимация появления текста
    animateTextRevelation() {
        const lines = this.revelationDisplay.querySelectorAll('.revelation-line');
        
        lines.forEach((line, index) => {
            line.style.animation = `textRevelation 0.6s ease-out ${index * 0.2}s both`;
        });

        const source = this.revelationDisplay.querySelector('.revelation-source');
        if (source) {
            source.style.animation = `textRevelation 0.6s ease-out ${lines.length * 0.2}s both`;
        }
    }

    // Очистка ритуала
    clearRitual() {
        if (!this.isActive) return;

        console.log('🧹 Очистка ритуала...');
        this.isActive = false;

        // Очистка таймера
        if (this.autoClearTimeout) {
            clearTimeout(this.autoClearTimeout);
            this.autoClearTimeout = null;
        }

        // Визуальные изменения
        this.ball.classList.remove('active');
        this.effects.clearAllEffects();

        // Плавное исчезновение текста
        this.hideText();

        // Возврат к исходному состоянию
        setTimeout(() => {
            this.resetToIdleState();
            console.log('✅ Ритуал очищен');
        }, 1000);
    }

    // Скрытие текста
    hideText() {
        const lines = this.revelationDisplay.querySelectorAll('.revelation-line');
        const source = this.revelationDisplay.querySelector('.revelation-source');
        
        [...lines, source].forEach((element, index) => {
            if (element) {
                element.style.animation = `textRevelation 0.4s ease-in reverse both`;
            }
        });
    }

    // Сброс в состояние покоя
    resetToIdleState() {
        this.revelationDisplay.innerHTML = `
            <div class="revelation-text">
                <div class="revelation-line">// КОСМИЧЕСКИЙ ХАОС</div>
                <div class="revelation-line">// ЖДЁТ ТВОЕГО ЗАПРОСА</div>
                <div class="revelation-source">— МАГИЧЕСКИЙ ШАР</div>
            </div>
        `;

        this.animateTextRevelation();
        this.currentManifestation = null;
    }

    // Обновление архива
    updateArchive() {
        if (!this.archiveContainer) return;

        const history = this.oracle.getHistory();
        this.archiveContainer.innerHTML = '';

        history.forEach(entry => {
            const archiveEntry = document.createElement('div');
            archiveEntry.className = 'archive-entry';
            archiveEntry.innerHTML = `
                <div class="entry-timestamp">[${entry.formattedTime}]</div>
                <div class="entry-text">${entry.text.replace(/\|/g, ' | ')}</div>
            `;
            this.archiveContainer.appendChild(archiveEntry);
        });
    }

    // Получить текущую манифестацию
    getCurrentManifestation() {
        return this.currentManifestation;
    }

    // Получить уровень энергии
    getEnergyLevel() {
        return this.oracle.getEnergyLevel();
    }

    // Очистка истории
    clearHistory() {
        this.oracle.clearHistory();
        this.updateArchive();
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
document.addEventListener('DOMContentLoaded', function() {
    // Создаем глобальный экземпляр Магического Шара
    window.magicBall = new MagicBall();
    
    // Глобальные функции для отладки и расширения
    window.getOracle = () => window.magicBall?.oracle;
    window.getEffects = () => window.magicBall?.effects;
    
    console.log('🏰 Магический Шатер готов к работе');
});

// ===== SERVICE WORKER ДЛЯ ОФФЛАЙН-РАБОТЫ =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/doracle/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker зарегистрирован: ', registration.scope);
            })
            .catch(function(error) {
                console.log('Ошибка регистрации ServiceWorker: ', error);
            });
    });
}
