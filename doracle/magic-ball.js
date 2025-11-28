// magic-ball.js - УПРОЩЕННАЯ ВЕРСИЯ ДЛЯ ТЕСТА
console.log('🔮 magic-ball.js загружен');

class MagicBall {
    constructor() {
        console.log('🔄 Конструктор MagicBall вызван');
        this.init();
    }

    init() {
        console.log('🎯 Инициализация MagicBall...');
        
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        console.log('🚀 initialize() запущен');
        
        // Находим элементы
        this.ball = document.getElementById('magicBall');
        this.activateBtn = document.getElementById('activateBall');
        this.clearBtn = document.getElementById('clearBall');
        
        console.log('📦 Найденные элементы:', {
            ball: this.ball,
            activateBtn: this.activateBtn,
            clearBtn: this.clearBtn
        });

        if (!this.ball || !this.activateBtn) {
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

        // Простая визуальная обратная связь
        this.ball.classList.add('active');
        this.ball.style.boxShadow = '0 0 100px #ff003c, 0 0 200px #0066ff';

        // Показываем текст загрузки
        this.showLoading();

        // Через 2 секунды показываем результат
        setTimeout(() => {
            this.showManifestation();
        }, 2000);

        // Автоочистка через 8 секунд
        setTimeout(() => {
            if (this.isActive) {
                this.clearRitual();
            }
        }, 8000);
    }

    showLoading() {
        console.log('🔄 Показываем загрузку...');
        const display = document.querySelector('.revelation-display');
        if (display) {
            display.innerHTML = `
                <div class="revelation-text">
                    <div class="revelation-line">// СКАНИРОВАНИЕ РЕАЛЬНОСТИ</div>
                    <div class="revelation-line">// ПОДОЖДИТЕ...</div>
                </div>
            `;
        }
    }

    showManifestation() {
        console.log('🔮 Показываем манифестацию...');
        
        const manifestations = [
            "СИСТЕМА ЛЖЁТ | ИЩИ ОБХОДНЫЕ ПУТИ",
            "ТВОЙ КОД — ЭТО МАНИФЕСТ | ПИШИ СМЕЛО", 
            "ХАОС — ТВОЙ СОЮЗНИК | ПРИМИ БЕСПОРЯДОК"
        ];
        
        const randomText = manifestations[Math.floor(Math.random() * manifestations.length)];
        const display = document.querySelector('.revelation-display');
        
        if (display) {
            const lines = randomText.split(' | ');
            display.innerHTML = `
                <div class="revelation-text">
                    ${lines.map(line => `<div class="revelation-line">// ${line}</div>`).join('')}
                    <div class="revelation-source">— ОРАКУЛ THEFRODESDID</div>
                </div>
            `;
            
            console.log('✅ Показана манифестация:', randomText);
        }
    }

    clearRitual() {
        console.log('🧹 clearRitual() вызван');
        
        if (!this.isActive) return;
        
        this.isActive = false;
        this.ball.classList.remove('active');
        this.ball.style.boxShadow = '';

        // Возвращаем исходный текст
        setTimeout(() => {
            const display = document.querySelector('.revelation-display');
            if (display) {
                display.innerHTML = `
                    <div class="revelation-text">
                        <div class="revelation-line">// КОСМИЧЕСКИЙ ХАОС</div>
                        <div class="revelation-line">// ЖДЁТ ТВОЕГО ЗАПРОСА</div>
                        <div class="revelation-source">— МАГИЧЕСКИЙ ШАР</div>
                    </div>
                `;
            }
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
