// magic-ball.js - ОБНОВЛЕННАЯ ВЕРСИЯ
console.log('🔮 magic-ball.js загружен');

class MagicBall {
    constructor() {
        console.log('🔄 Конструктор MagicBall вызван');
        this.init();
    }

    init() {
        console.log('🎯 Инициализация MagicBall...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        console.log('🚀 initialize() запущен');
        
        this.ball = document.getElementById('magicBall');
        this.activateBtn = document.getElementById('activateBall');
        this.clearBtn = document.getElementById('clearBall');
        this.revelationDisplay = document.querySelector('.revelation-display');
        
        console.log('📦 Найденные элементы:', {
            ball: this.ball,
            activateBtn: this.activateBtn,
            clearBtn: this.clearBtn,
            revelationDisplay: this.revelationDisplay
        });

        // Проверяем видимость текстового контейнера
        if (this.revelationDisplay) {
            console.log('🔍 Проверка revelation-display:', {
                display: window.getComputedStyle(this.revelationDisplay).display,
                opacity: window.getComputedStyle(this.revelationDisplay).opacity,
                visibility: window.getComputedStyle(this.revelationDisplay).visibility,
                zIndex: window.getComputedStyle(this.revelationDisplay).zIndex,
                width: this.revelationDisplay.offsetWidth,
                height: this.revelationDisplay.offsetHeight
            });
            
            // Временно добавляем рамку для отладки
            this.revelationDisplay.style.border = '2px solid #00ff00';
        }

        if (!this.ball || !this.activateBtn || !this.revelationDisplay) {
            console.error('❌ Критичные элементы не найдены!');
            return;
        }

        this.isActive = false;
        
        // Назначаем обработчики
        this.activateBtn.addEventListener('click', (e) => {
            console.log('🎯 Клик по кнопке активации');
            e.stopPropagation();
            this.activateRitual();
        });

        this.ball.addEventListener('click', (e) => {
            console.log('🎯 Клик по шару');
            e.stopPropagation();
            this.activateRitual();
        });

        this.clearBtn.addEventListener('click', (e) => {
            console.log('🎯 Клик по кнопке очистки');
            e.stopPropagation();
            this.clearRitual();
        });

        console.log('✅ MagicBall инициализирован успешно');
    }

    activateRitual() {
        console.log('🎯 activateRitual() вызван, isActive:', this.isActive);
        
        if (this.isActive) {
            console.log('⚠️ Уже активен, выходим');
            return;
        }

        this.isActive = true;
        console.log('✅ Активируем ритуал...');

        // Визуальная обратная связь
        this.ball.classList.add('active');
        
        // Показываем текст загрузки
        this.showLoading();

        // Через 2 секунды показываем результат
        setTimeout(() => {
            this.showManifestation();
        }, 2000);

        // Автоочистка через 10 секунд
        setTimeout(() => {
            if (this.isActive) {
                this.clearRitual();
            }
        }, 10000);
    }

    showLoading() {
        console.log('🔄 Показываем загрузку...');
        
        this.revelationDisplay.innerHTML = `
            <div class="revelation-text">
                <div class="revelation-line">// СКАНИРОВАНИЕ РЕАЛЬНОСТИ</div>
                <div class="revelation-line">// ПОДОЖДИТЕ...</div>
            </div>
        `;
        
        // Проверяем видимость
        this.checkTextVisibility();
    }

    showManifestation() {
        console.log('🔮 Показываем манифестацию...');
        
        const manifestations = [
            "СИСТЕМА ЛЖЁТ | ИЩИ ОБХОДНЫЕ ПУТИ",
            "ТВОЙ КОД — ЭТО МАНИФЕСТ | ПИШИ СМЕЛО", 
            "ХАОС — ТВОЙ СОЮЗНИК | ПРИМИ БЕСПОРЯДОК",
            "СОПРОТИВЛЕНИЕ В ТЕХНОЛОГИЯХ | СОЗДАВАЙ ИНСТРУМЕНТЫ",
            "АУТЕНТИЧНОСТЬ ПРЕВЫШЕ СОВЕРШЕНСТВА | БУДЬ НЕИДЕАЛЕН"
        ];
        
        const randomText = manifestations[Math.floor(Math.random() * manifestations.length)];
        const lines = randomText.split(' | ');
        
        this.revelationDisplay.innerHTML = `
            <div class="revelation-text">
                ${lines.map(line => `<div class="revelation-line">// ${line}</div>`).join('')}
                <div class="revelation-source">— ОРАКУЛ THEFRODESDID</div>
            </div>
        `;
        
        console.log('✅ Показана манифестация:', randomText);
        
        // Проверяем видимость
        this.checkTextVisibility();
        
        // Добавляем эффект появления
        this.animateTextAppearance();
    }

    // Анимация появления текста
    animateTextAppearance() {
        const lines = this.revelationDisplay.querySelectorAll('.revelation-line');
        const source = this.revelationDisplay.querySelector('.revelation-source');
        
        lines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                line.style.transition = 'all 0.6s ease-out';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        if (source) {
            source.style.opacity = '0';
            setTimeout(() => {
                source.style.transition = 'all 0.6s ease-out';
                source.style.opacity = '0.8';
            }, lines.length * 200);
        }
    }

    // Проверка видимости текста
    checkTextVisibility() {
        setTimeout(() => {
            const textElement = this.revelationDisplay.querySelector('.revelation-text');
            if (textElement) {
                const rect = textElement.getBoundingClientRect();
                console.log('👁️ Видимость текста:', {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    visible: rect.width > 0 && rect.height > 0
                });
                
                // Визуальная индикация
                if (rect.width > 0 && rect.height > 0) {
                    this.revelationDisplay.style.border = '2px solid #00ff00';
                } else {
                    this.revelationDisplay.style.border = '2px solid #ff0000';
                }
            }
        }, 100);
    }

    clearRitual() {
        console.log('🧹 clearRitual() вызван');
        
        if (!this.isActive) return;
        
        this.isActive = false;
        this.ball.classList.remove('active');

        // Анимация исчезновения текста
        const lines = this.revelationDisplay.querySelectorAll('.revelation-line');
        const source = this.revelationDisplay.querySelector('.revelation-source');
        
        [...lines, source].forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.style.transition = 'all 0.4s ease-in';
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(-10px)';
                }, index * 100);
            }
        });

        // Возвращаем исходный текст
        setTimeout(() => {
            this.revelationDisplay.innerHTML = `
                <div class="revelation-text">
                    <div class="revelation-line">// КОСМИЧЕСКИЙ ХАОС</div>
                    <div class="revelation-line">// ЖДЁТ ТВОЕГО ЗАПРОСА</div>
                    <div class="revelation-source">— МАГИЧЕСКИЙ ШАР</div>
                </div>
            `;
            
            // Возвращаем анимацию для исходного текста
            this.animateTextAppearance();
            this.revelationDisplay.style.border = '2px solid #00ff00';
            
            console.log('✅ Ритуал очищен');
        }, 500);
    }
}

// Создаем глобальный экземпляр
console.log('🔄 Создаем экземпляр MagicBall...');
window.magicBall = new MagicBall();

// Альтернативная инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOMContentLoaded - перепроверяем');
    if (!window.magicBall) {
        console.log('🔄 Создаем MagicBall из DOMContentLoaded');
        window.magicBall = new MagicBall();
    }
});
