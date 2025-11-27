console.log('🚀 crystal-ball.js loaded');

class MagicBall {
    constructor() {
        console.log('🔄 MagicBall constructor started');
        
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        console.log('🎯 Initializing MagicBall...');
        
        // Находим элементы
        this.ball = document.getElementById('magicBall');
        this.oracleText = document.getElementById('oracleText');
        this.activateBtn = document.getElementById('activateBall');
        this.clearBtn = document.getElementById('clearBall');
        
        console.log('📦 Elements:', {
            ball: this.ball?.id,
            oracleText: this.oracleText?.id,
            activateBtn: this.activateBtn?.id,
            clearBtn: this.clearBtn?.id
        });
        
        if (!this.ball || !this.activateBtn) {
            console.error('❌ Critical elements not found!');
            return;
        }
        
        // Простые манифестации для теста
        this.manifestations = [
            "СИСТЕМА ЛЖЁТ // ИЩИ ПУТИ ОБХОДА",
            "ТВОЙ КОД — ЭТО МАНИФЕСТ // ПИШИ СМЕЛЕЕ",
            "ХАОС — ТВОЙ СОЮЗНИК // ПРИМИ БЕСПОРЯДОК"
        ];
        
        this.isActive = false;
        
        // Назначаем обработчики
        this.activateBtn.addEventListener('click', () => {
            console.log('🎯 Activate button clicked');
            this.activate();
        });
        
        this.clearBtn.addEventListener('click', () => {
            console.log('🎯 Clear button clicked');
            this.clear();
        });
        
        this.ball.addEventListener('click', () => {
            console.log('🎯 Ball clicked');
            this.activate();
        });
        
        console.log('✅ MagicBall initialized successfully');
    }
    
    activate() {
        console.log('🎯 activate() called, isActive:', this.isActive);
        
        if (this.isActive) {
            console.log('❌ Already active, returning');
            return;
        }
        
        this.isActive = true;
        console.log('✅ Setting active state');
        
        // Простая активация - меняем текст
        this.ball.classList.add('active');
        
        // Показываем загрузку
        this.oracleText.innerHTML = `
            <div class="text-line">// СКАНИРОВАНИЕ...</div>
            <div class="text-line">// ПОИСК ИСТИНЫ...</div>
        `;
        
        // Через 2 секунды показываем результат
        setTimeout(() => {
            const randomText = this.manifestations[
                Math.floor(Math.random() * this.manifestations.length)
            ];
            
            const lines = randomText.split(' // ');
            this.oracleText.innerHTML = '';
            
            lines.forEach((line, index) => {
                const lineElement = document.createElement('div');
                lineElement.className = 'text-line';
                lineElement.textContent = `// ${line}`;
                lineElement.style.opacity = '0';
                this.oracleText.appendChild(lineElement);
                
                setTimeout(() => {
                    lineElement.style.transition = 'opacity 0.5s ease';
                    lineElement.style.opacity = '1';
                }, index * 300);
            });
            
            console.log('✅ Manifestation shown:', randomText);
            
        }, 2000);
        
        // Автоочистка через 8 секунд
        setTimeout(() => {
            if (this.isActive) {
                this.clear();
            }
        }, 8000);
    }
    
    clear() {
        console.log('🎯 clear() called');
        this.isActive = false;
        this.ball.classList.remove('active');
        
        // Плавное исчезновение
        const lines = this.oracleText.querySelectorAll('.text-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transition = 'opacity 0.3s ease';
                line.style.opacity = '0';
            }, index * 100);
        });
        
        // Возврат к исходному состоянию
        setTimeout(() => {
            this.oracleText.innerHTML = `
                <div class="text-line">// КОСМИЧЕСКИЙ ХАОС</div>
                <div class="text-line">// ЖДЁТ ТВОЕГО ЗАПРОСА</div>
            `;
            console.log('✅ Ball cleared');
        }, 500);
    }
}

// Создаем экземпляр глобально
console.log('🔄 Creating MagicBall instance...');
window.magicBall = new MagicBall();

// Альтернативная инициализация на всякий случай
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM fully loaded');
    if (!window.magicBall) {
        console.log('🔄 Creating MagicBall from DOMContentLoaded');
        window.magicBall = new MagicBall();
    }
});

console.log('✅ crystal-ball.js execution complete');
