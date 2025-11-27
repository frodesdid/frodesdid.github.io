class QuantumCollider {
    constructor() {
        this.entropyPool = [];
        this.generatedCount = 0;
        this.lastResult = null;
        this.particles = [];
        this.collisions = 0;
        
        // НАСТРОЙКИ РУЧЕК
        this.settings = {
            scanDepth: 7,        // Глубина сканирования (1-10)
            quantumNoise: 45,    // Уровень квантового шума (0-100)
            particleSpeed: 50,   // Скорость частиц (0-100)
            collisionRate: 60    // Частота столкновений (0-100)
        };
        
        this.initEntropy();
        this.initCollider();
        this.initControls(); // Инициализируем ручки!
        console.log('⚛️ Квантовый коллайдер активирован!');
    }

    initControls() {
        // Находим слайдеры и вешаем обработчики
        const scanDepthSlider = document.getElementById('scanDepth');
        const quantumNoiseSlider = document.getElementById('quantumNoise');
        
        if (scanDepthSlider) {
            scanDepthSlider.value = this.settings.scanDepth;
            scanDepthSlider.addEventListener('input', (e) => {
                this.settings.scanDepth = parseInt(e.target.value);
                this.updateScanDepthEffects();
                this.updateChaosDisplay();
            });
        }
        
        if (quantumNoiseSlider) {
            quantumNoiseSlider.value = this.settings.quantumNoise;
            quantumNoiseSlider.addEventListener('input', (e) => {
                this.settings.quantumNoise = parseInt(e.target.value);
                this.updateQuantumNoiseEffects();
                this.updateChaosDisplay();
            });
        }
        
        // Обновляем дисплей хаоса
        this.updateChaosDisplay();
    }

    updateScanDepthEffects() {
        // Визуальные эффекты от глубины сканирования
        const depth = this.settings.scanDepth;
        
        // Меняем количество частиц
        const targetParticles = 8 + Math.floor(depth / 2);
        if (this.particles.length !== targetParticles) {
            this.createParticles();
        }
        
        // Меняем скорость частиц на основе глубины и скорости
        const baseSpeed = 0.02 + (this.settings.particleSpeed / 100) * 0.04;
        this.particles.forEach(particle => {
            particle.speed = baseSpeed * (0.8 + (depth / 10) * 0.4);
        });
        
        console.log(`🔍 Глубина сканирования: ${depth}`);
    }

    updateQuantumNoiseEffects() {
        // Эффекты от квантового шума
        const noiseLevel = this.settings.quantumNoise;
        
        // Меняем "дрожание" частиц
        this.particles.forEach(particle => {
            particle.jitter = (noiseLevel / 100) * 0.1;
        });
        
        // Меняем частоту случайных столкновений
        this.collisionFrequency = (noiseLevel / 100) * 0.03;
        
        console.log(`🌪️ Квантовый шум: ${noiseLevel}%`);
    }

    updateChaosDisplay() {
        // Рассчитываем общий уровень хаоса на основе настроек
        const chaos = (
            this.settings.scanDepth * 8 + 
            this.settings.quantumNoise * 0.7 +
            Math.random() * 10
        );
        
        const chaosElement = document.querySelector('.dial-value');
        if (chaosElement) {
            chaosElement.textContent = Math.min(100, Math.round(chaos)) + '%';
        }
    }

    // ОБНОВЛЯЕМ методы для учета настроек:

    updateParticles(centerX, centerY) {
        const noiseLevel = this.settings.quantumNoise / 100;
        
        this.particles.forEach(particle => {
            // Добавляем "дрожание" от квантового шума
            let angleNoise = 0;
            if (noiseLevel > 0) {
                angleNoise = (Math.random() - 0.5) * noiseLevel * 0.1;
            }
            
            particle.angle += particle.speed + angleNoise;
            
            // Рассчитываем позицию с учетом шума
            const baseX = centerX + Math.cos(particle.angle) * particle.radius;
            const baseY = centerY + Math.sin(particle.angle) * particle.radius;
            
            const x = baseX + (Math.random() - 0.5) * noiseLevel * 5;
            const y = baseY + (Math.random() - 0.5) * noiseLevel * 5;
            
            // Остальной код отрисовки без изменений...
            particle.trail.push({x, y});
            if (particle.trail.length > 8) {
                particle.trail.shift();
            }
            
            // Рисуем трейл
            if (particle.trail.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                
                for (let i = 1; i < particle.trail.length; i++) {
                    this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                }
                
                // Прозрачность трейла зависит от шума
                const trailAlpha = Math.floor(20 + noiseLevel * 35).toString(16).padStart(2, '0');
                this.ctx.strokeStyle = particle.color + trailAlpha;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
            
            // Рисуем частицу
            this.ctx.beginPath();
            this.ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            
            const gradient = this.ctx.createRadialGradient(
                x, y, 0,
                x, y, particle.size * 2
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, particle.color + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Яркое ядро
            this.ctx.beginPath();
            this.ctx.arc(x, y, particle.size * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fill();
            
            // Проверяем столкновения с учетом настроек
            this.checkCollisions(particle, x, y);
        });
    }

    checkCollisions(particle, x, y) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const collisionRate = this.settings.quantumNoise / 100;
        
        // Случайные "столкновения" в центре (зависит от шума)
        if (Math.random() < 0.02 * collisionRate) {
            this.createCollisionEffect(centerX, centerY);
            this.collisions++;
        }
        
        // Столкновения между частицами (тоже зависит от шума)
        if (Math.random() < 0.01 * collisionRate) {
            const otherParticle = this.particles[Math.floor(Math.random() * this.particles.length)];
            if (otherParticle !== particle) {
                this.createEnergySpark(x, y);
            }
        }
    }

    getUltraRandom() {
        const depthBonus = this.settings.scanDepth / 10; // Бонус от глубины сканирования
        const noiseBonus = this.settings.quantumNoise / 200; // Бонус от шума
        
        const sources = [
            Math.random(),
            performance.now() % 1,
            Date.now() % 1,
            this.entropyPool[Math.floor(Math.random() * this.entropyPool.length)],
            Math.sin(performance.now() * Math.PI) % 1,
            this.collisions % 1,
            depthBonus,
            noiseBonus
        ];

        let result = 0;
        sources.forEach(source => {
            result = (result + source) % 1;
        });

        return Math.abs(result);
    }

    generate(min, max) {
        this.generatedCount++;
        
        // Запускаем визуальное шоу с учетом глубины сканирования
        const numCollisions = 3 + Math.floor(this.settings.scanDepth / 3);
        for (let i = 0; i < numCollisions; i++) {
            setTimeout(() => {
                this.createCollisionEffect(this.canvas.width / 2, this.canvas.height / 2);
            }, i * (300 - this.settings.scanDepth * 20));
        }
        
        const range = max - min + 1;
        let result = min + Math.floor(this.getUltraRandom() * range);

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
        const collisionElement = document.getElementById('collisionCount');
        
        if (resultElement) {
            resultElement.textContent = result;
            resultElement.style.transform = 'scale(1.3)';
            setTimeout(() => resultElement.style.transform = 'scale(1)', 300);
        }
        
        if (countElement) countElement.textContent = this.generatedCount;
        if (entropyElement) entropyElement.textContent = Math.round(this.entropyPool.length / 20) + '%';
        if (collisionElement) collisionElement.textContent = this.collisions;
    }
}

// Запускаем коллайдер!
const quantumCollider = new QuantumCollider();

function generateNumber() {
    const minInput = document.getElementById('minRange');
    const maxInput = document.getElementById('maxRange');
    
    if (!minInput || !maxInput) return;
    
    const min = parseInt(minInput.value) || 1;
    const max = parseInt(maxInput.value) || 100;
    
    if (min >= max) {
        alert('Максимальное число должно быть больше минимального!');
        return;
    }
    
    const button = document.getElementById('generateBtn');
    const buttonText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.quantum-spinner');
    
    button.disabled = true;
    buttonText.style.display = 'none';
    spinner.style.display = 'block';
    
    setTimeout(() => {
        quantumCollider.generate(min, max);
        
        button.disabled = false;
        buttonText.style.display = 'block';
        spinner.style.display = 'none';
    }, 800); // Увеличили задержку для шоу столкновений
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('⚛️ Квантовый коллайдер загружен!');
    
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateNumber);
    }
    
    // Добавляем счетчик столкновений в интерфейс
    const statsContainer = document.querySelector('.reality-stats');
    if (statsContainer) {
        statsContainer.innerHTML += `
            <div class="stat">
                <span class="stat-label">СТОЛКНОВЕНИЯ:</span>
                <span id="collisionCount" class="stat-value">0</span>
            </div>
        `;
    }
});
