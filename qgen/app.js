class QuantumApp {
    constructor() {
        this.generator = window.QuantumChaos;
        this.init();
    }

    init() {
        this.generateBtn = document.getElementById('generateBtn');
        this.minInput = document.getElementById('minValue');
        this.maxInput = document.getElementById('maxValue');
        this.resultValue = document.getElementById('resultValue');
        this.entropyLevel = document.getElementById('entropyLevel');
        this.generatedCount = document.getElementById('generatedCount');
        this.quantumAnimation = document.getElementById('quantumAnimation');

        this.generateBtn.addEventListener('click', () => this.generateNumber());
        
        // Обновление статистики каждую секунду
        setInterval(() => this.updateStats(), 1000);
        
        // Валидация входных данных
        this.minInput.addEventListener('change', () => this.validateInputs());
        this.maxInput.addEventListener('change', () => this.validateInputs());
    }

    validateInputs() {
        const min = parseInt(this.minInput.value);
        const max = parseInt(this.maxInput.value);
        
        if (min >= max) {
            this.maxInput.value = min + 1;
        }
        
        // Ограничение значений
        this.minInput.value = Math.max(-999999, Math.min(999999, min));
        this.maxInput.value = Math.max(-999999, Math.min(999999, max));
    }

    async generateNumber() {
        const min = parseInt(this.minInput.value);
        const max = parseInt(this.maxInput.value);
        
        if (min >= max) {
            this.showError('Максимальное значение должно быть больше минимального');
            return;
        }

        this.startGeneration();
        
        // Имитация "квантовых вычислений" с задержкой
        await this.delay(800 + Math.random() * 700);
        
        const result = this.generator.randomInt(min, max);
        this.showResult(result);
    }

    startGeneration() {
        this.generateBtn.disabled = true;
        this.generateBtn.querySelector('.btn-text').style.display = 'none';
        this.generateBtn.querySelector('.quantum-loader').style.display = 'flex';
        
        this.resultValue.textContent = '...';
        this.resultValue.style.opacity = '0.5';
        
        this.showQuantumAnimation();
    }

    showQuantumAnimation() {
        const symbols = ['⚡', '🔮', '🌌', '🎲', '💫', '✨'];
        this.quantumAnimation.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        this.quantumAnimation.style.opacity = '1';
        this.quantumAnimation.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    async showResult(result) {
        // Скрываем анимацию
        this.quantumAnimation.style.opacity = '0';
        this.quantumAnimation.style.transform = 'translate(-50%, -50%) scale(0.5)';
        
        // Показываем результат с анимацией
        this.resultValue.textContent = result;
        this.resultValue.style.opacity = '1';
        this.resultValue.classList.add('quantum-glow');
        
        // Возвращаем кнопку в нормальное состояние
        this.generateBtn.disabled = false;
        this.generateBtn.querySelector('.btn-text').style.display = 'block';
        this.generateBtn.querySelector('.quantum-loader').style.display = 'none';
        
        // Обновляем статистику
        this.updateStats();
        
        // Убираем свечение через 2 секунды
        setTimeout(() => {
            this.resultValue.classList.remove('quantum-glow');
        }, 2000);
    }

    showError(message) {
        this.resultValue.textContent = 'Ошибка';
        this.resultValue.style.color = '#e74c3c';
        setTimeout(() => {
            this.resultValue.style.color = '#333';
            this.resultValue.textContent = '—';
        }, 2000);
    }

    updateStats() {
        this.entropyLevel.textContent = this.generator.getEntropyLevel();
        this.generatedCount.textContent = this.generator.getGeneratedCount();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.quantumApp = new QuantumApp();
});
