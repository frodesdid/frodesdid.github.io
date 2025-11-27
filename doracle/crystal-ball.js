class MagicBall {
    constructor() {
        this.ball = document.getElementById('magicBall');
        this.oracleText = document.getElementById('oracleText');
        this.activateBtn = document.getElementById('activateBall');
        this.clearBtn = document.getElementById('clearBall');
        
        this.manifestations = [
            "СИСТЕМА ЛЖЁТ // ИЩИ ПУТИ ОБХОДА",
            "ТВОЙ КОД — ЭТО МАНИФЕСТ // ПИШИ СМЕЛЕЕ",
            "ХАОС — ТВОЙ СОЮЗНИК // ПРИМИ БЕСПОРЯДОК",
            "СОПРОТИВЛЕНИЕ РОЖДАЕТСЯ В ТЕХНОЛОГИЯХ // СОЗДАВАЙ ИНСТРУМЕНТЫ",
            "АУТЕНТИЧНОСТЬ ПРЕВЫШЕ СОВЕРШЕНСТВА // БУДЬ НЕИДЕАЛЕН",
            "ЦИФРОВОЙ ЛЕС ЖДЁТ // СТРОЙ УБЕЖИЩА В КОДЕ",
            "ТВОЯ УЯЗВИМОСТЬ — СИЛА // НЕ СКРЫВАЙ ШВЫ",
            "АЛГОРИТМЫ ХОТЯТ ТЕБЯ УСМИРИТЬ // НЕ ПОДДАВАЙСЯ"
        ];
        
        this.init();
    }
    
    init() {
        this.activateBtn.addEventListener('click', () => this.activate());
        this.clearBtn.addEventListener('click', () => this.clear());
        this.ball.addEventListener('click', () => this.activate());
        
        // Случайное мерцание текста в покое
        this.idleInterval = setInterval(() => {
            if (!this.ball.classList.contains('active')) {
                this.idleFlicker();
            }
        }, 3000);
    }
    
    activate() {
        // Анимация активации
        this.ball.classList.add('active');
        
        // Звук активации (если есть)
        const audio = document.getElementById('activationAudio');
        if (audio) audio.play().catch(() => {});
        
        // Последовательность проявления
        setTimeout(() => this.showManifestation(), 1000);
        
        // Автоочистка через 10 секунд
        setTimeout(() => this.clear(), 10000);
    }
    
    showManifestation() {
        const randomManifestation = this.manifestations[
            Math.floor(Math.random() * this.manifestations.length)
        ];
        
        // Эффект постепенного появления текста
        const lines = randomManifestation.split(' // ');
        this.oracleText.innerHTML = '';
        
        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'text-line';
            lineElement.textContent = `// ${line}`;
            lineElement.style.opacity = '0';
            
            this.oracleText.appendChild(lineElement);
            
            setTimeout(() => {
                lineElement.style.transition = 'opacity 1s ease';
                lineElement.style.opacity = '1';
            }, index * 500);
        });
    }
    
    clear() {
        this.ball.classList.remove('active');
        
        // Плавное исчезновение текста
        const lines = this.oracleText.querySelectorAll('.text-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '0';
            }, index * 200);
        });
        
        // Возврат к исходному состоянию
        setTimeout(() => {
            this.oracleText.innerHTML = `
                <div class="text-line">// КОСМИЧЕСКИЙ ХАОС</div>
                <div class="text-line">// ЖДЁТ ТВОЕГО ЗАПРОСА</div>
            `;
        }, 1000);
    }
    
    idleFlicker() {
        const texts = [
            "// КОСМИЧЕСКИЙ ХАОС",
            "// ЦИФРОВЫЕ ВОЛНЫ", 
            "// АЛЬТЕРНАТИВНЫЕ РЕАЛЬНОСТИ",
            "// СКРЫТЫЕ ПАТТЕРНЫ"
        ];
        
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        this.oracleText.firstChild.textContent = randomText;
        
        // Кратковременное мерцание
        this.oracleText.style.opacity = '0.5';
        setTimeout(() => {
            this.oracleText.style.opacity = '1';
        }, 200);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    new MagicBall();
});
