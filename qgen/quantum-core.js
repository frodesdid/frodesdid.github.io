// SIMPLE_QUANTUM_GENERATOR - Мощно и просто
class SimpleQuantumGenerator {
    constructor() {
        this.entropyPool = [];
        this.generatedCount = 0;
        this.lastResult = null;
        this.initEntropy();
        console.log('🎲 Quantum Generator готов!');
    }

    initEntropy() {
        // Быстрая инициализация энтропии
        for (let i = 0; i < 1000; i++) {
            this.entropyPool.push(Math.random());
        }
        
        // Постоянное обновление энтропии
        setInterval(() => {
            this.entropyPool.push(Math.random());
            if (this.entropyPool.length > 2000) {
                this.entropyPool = this.entropyPool.slice(-1000);
            }
        }, 50);
    }

    getUltraRandom() {
        // Супер-случайность из множества источников
        const sources = [
            Math.random(),
            performance.now() % 1,
            Date.now() % 1,
            this.entropyPool[Math.floor(Math.random() * this.entropyPool.length)],
            Math.sin(performance.now() * Math.PI) % 1
        ];

        // Смешиваем всё вместе
        let result = 0;
        sources.forEach(source => {
            result = (result + source) % 1;
        });

        return Math.abs(result);
    }

    generate(min, max) {
        this.generatedCount++;
        
        const range = max - min + 1;
        let result = min + Math.floor(this.getUltraRandom() * range);

        // Умная защита от повторений для маленьких диапазонов
        if (range < 50 && result === this.lastResult) {
            result = min + ((result - min + 1) % range);
        }

        this.lastResult = result;
        this.updateDisplay(result);
        
        return result;
    }

    updateDisplay(result) {
        const resultElement = document.getElementById('quantumResult');
        const countElement = document.getElementById('scanCount');
        const entropyElement = document.getElementById('entropyLevel');
        
        if (resultElement) {
            resultElement.textContent = result;
            // Простая анимация
            resultElement.style.transform = 'scale(1.2)';
            setTimeout(() => resultElement.style.transform = 'scale(1)', 200);
        }
        
        if (countElement) countElement.textContent = this.generatedCount;
        if (entropyElement) entropyElement.textContent = Math.round(this.entropyPool.length / 20) + '%';
    }
}

// Запускаем генератор
const quantumGen = new SimpleQuantumGenerator();

// Функция для кнопки
function generateNumber() {
    const minInput = document.getElementById('minRange');
    const maxInput = document.getElementById('maxRange');
    
    if (!minInput || !maxInput) {
        console.log('Поля ввода не найдены!');
        return;
    }
    
    const min = parseInt(minInput.value) || 1;
    const max = parseInt(maxInput.value) || 100;
    
    if (min >= max) {
        alert('Максимальное число должно быть больше минимального!');
        return;
    }
    
    // Анимация кнопки
    const button = document.getElementById('generateBtn');
    const buttonText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.quantum-spinner');
    
    button.disabled = true;
    buttonText.style.display = 'none';
    spinner.style.display = 'block';
    
    // Генерация с небольшой задержкой для драматизма
    setTimeout(() => {
        quantumGen.generate(min, max);
        
        // Возвращаем кнопку
        button.disabled = false;
        buttonText.style.display = 'block';
        spinner.style.display = 'none';
    }, 300);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Генератор загружен!');
    
    // Вешаем обработчик на кнопку
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateNumber);
    }
    
    // Можно генерировать по Enter в полях ввода
    const minInput = document.getElementById('minRange');
    const maxInput = document.getElementById('maxRange');
    
    if (minInput && maxInput) {
        const handleEnter = (e) => {
            if (e.key === 'Enter') generateNumber();
        };
        
        minInput.addEventListener('keypress', handleEnter);
        maxInput.addEventListener('keypress', handleEnter);
    }
    
    // Обновляем уровень хаоса
    setInterval(() => {
        const chaosElement = document.querySelector('.dial-value');
        if (chaosElement) {
            chaosElement.textContent = Math.floor(Math.random() * 30 + 70) + '%';
        }
    }, 2000);
});

// Простая визуализация для canvas (если он есть)
function initSimpleCanvas() {
    const canvas = document.getElementById('realityCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Простые частицы
        if (particles.length < 20 && Math.random() < 0.3) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 2 + 1,
                color: Math.random() < 0.5 ? '#00ffea' : '#ff00ff'
            });
        }
        
        particles.forEach((particle, index) => {
            particle.y -= particle.speed;
            if (particle.y < 0) particles.splice(index, 1);
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Запускаем простую визуализацию
document.addEventListener('DOMContentLoaded', initSimpleCanvas);
