// QUANTUM_COLLIDER - РАБОЧАЯ ВЕРСИЯ
class QuantumCollider {
    constructor() {
        this.entropyPool = [];
        this.generatedCount = 0;
        this.lastResult = null;
        this.particles = [];
        this.collisions = 0;
        this.animationId = null;
        
        // Настройки
        this.settings = {
            scanDepth: 7,
            quantumNoise: 45
        };
        
        this.initEntropy();
        this.initCollider();
        this.initControls();
        console.log('⚛️ Квантовый коллайдер активирован!');
    }

    initEntropy() {
        for (let i = 0; i < 1000; i++) {
            this.entropyPool.push(Math.random());
        }
        
        setInterval(() => {
            this.entropyPool.push(Math.random());
            if (this.entropyPool.length > 2000) {
                this.entropyPool = this.entropyPool.slice(-1000);
            }
        }, 50);
    }

    initCollider() {
        const canvas = document.getElementById('realityCanvas');
        if (!canvas) {
            console.error('Canvas не найден!');
            return;
        }
        
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        
        // Убедимся что canvas правильного размера
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        this.createParticles();
        this.animate();
        
        console.log('🎨 Коллайдер инициализирован');
    }

    createParticles() {
        this.particles = [];
        const numParticles = 12;
        
        for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 2;
            this.particles.push({
                angle: angle,
                speed: 0.02 + Math.random() * 0.03,
                radius: 120,
                size: 3 + Math.random() * 4,
                color: i % 2 === 0 ? '#00ffea' : '#ff00ff',
                trail: [],
                energy: 0.5 + Math.random() * 0.5
            });
        }
    }

    animate() {
        if (!this.ctx || !this.canvas) return;
        
        // Очищаем canvas
        this.ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Рисуем кольцо коллайдера
        this.drawColliderRing(centerX, centerY);
        
        // Обновляем и рисуем частицы
        this.updateParticles(centerX, centerY);
        
        // Продолжаем анимацию
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawColliderRing(centerX, centerY) {
        // Внешнее кольцо
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 255, 234, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Внутреннее кольцо
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Центральная точка
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fill();
    }

    updateParticles(centerX, centerY) {
        const noiseLevel = this.settings.quantumNoise / 100;
        
        this.particles.forEach(particle => {
            // Обновляем угол с учетом шума
            let angleNoise = 0;
            if (noiseLevel > 0) {
                angleNoise = (Math.random() - 0.5) * noiseLevel * 0.1;
            }
            
            particle.angle += particle.speed + angleNoise;
            
            // Позиция частицы
            const baseX = centerX + Math.cos(particle.angle) * particle.radius;
            const baseY = centerY + Math.sin(particle.angle) * particle.radius;
            
            const x = baseX + (Math.random() - 0.5) * noiseLevel * 8;
            const y = baseY + (Math.random() - 0.5) * noiseLevel * 8;
            
            // Трейл частицы
            particle.trail.push({x, y});
            if (particle.trail.length > 6) {
                particle.trail.shift();
            }
            
            // Рисуем трейл
            this.drawParticleTrail(particle);
            
            // Рисуем саму частицу
            this.drawParticle(particle, x, y);
            
            // Проверяем столкновения
            this.checkCollisions(particle, x, y, centerX, centerY);
        });
    }

    drawParticleTrail(particle) {
        if (particle.trail.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
            
            for (let i = 1; i < particle.trail.length; i++) {
                this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
            }
            
            const trailAlpha = Math.floor(20 + (this.settings.quantumNoise / 100) * 35).toString(16).padStart(2, '0');
            this.ctx.strokeStyle = particle.color + trailAlpha;
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
        }
    }

    drawParticle(particle, x, y) {
        // Свечение вокруг частицы
        this.ctx.beginPath();
        this.ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
        
        const gradient = this.ctx.createRadialGradient(
            x, y, 0,
            x, y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.7, particle.color + '80');
        gradient.addColorStop(1, particle.color + '00');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Ядро частицы
        this.ctx.beginPath();
        this.ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
    }

    checkCollisions(particle, x, y, centerX, centerY) {
        const collisionRate = 0.02 + (this.settings.quantumNoise / 100) * 0.03;
        
        // Случайные столкновения в центре
        if (Math.random() < collisionRate) {
            this.createCollisionEffect(centerX, centerY);
            this.collisions++;
            this.updateCollisionDisplay();
        }
        
        // Столкновения между частицами
        if (Math.random() < collisionRate * 0.5) {
            this.createEnergySpark(x, y);
        }
    }

    createCollisionEffect(x, y) {
        // Вспышка в центре
        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 25);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#ff00ff');
        gradient.addColorStop(1, '#00ffea00');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Искры от столкновения
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.createEnergySpark(x, y);
            }, i * 40);
        }
    }

    createEnergySpark(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const spark = {
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.03,
            size: 2 + Math.random() * 3,
            color: Math.random() < 0.5 ? '#00ffea' : '#ff00ff'
        };
        
        const animateSpark = () => {
            if (spark.life <= 0) return;
            
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.life -= spark.decay;
            
            this.ctx.beginPath();
            this.ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
            this.ctx.fillStyle = spark.color + Math.floor(spark.life * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
            
            if (spark.life > 0) {
                requestAnimationFrame(animateSpark);
            }
        };
        
        animateSpark();
    }

    initControls() {
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
        
        this.updateChaosDisplay();
    }

    updateScanDepthEffects() {
        const depth = this.settings.scanDepth;
        const targetParticles = 8 + Math.floor(depth / 2);
        
        if (this.particles.length !== targetParticles) {
            this.particles = [];
            this.createParticles();
        }
        
        this.particles.forEach(particle => {
            particle.speed = 0.02 + (depth / 10) * 0.04;
        });
    }

    updateQuantumNoiseEffects() {
        // Шум уже учитывается в updateParticles
    }

    updateChaosDisplay() {
        const chaos = Math.min(100, 
            this.settings.scanDepth * 8 + 
            this.settings.quantumNoise * 0.7 +
            Math.random() * 10
        );
        
        const chaosElement = document.querySelector('.dial-value');
        if (chaosElement) {
            chaosElement.textContent = Math.round(chaos) + '%';
        }
        
        const scanDepthValue = document.getElementById('scanDepthValue');
        const quantumNoiseValue = document.getElementById('quantumNoiseValue');
        
        if (scanDepthValue) scanDepthValue.textContent = this.settings.scanDepth;
        if (quantumNoiseValue) quantumNoiseValue.textContent = this.settings.quantumNoise + '%';
    }

    updateCollisionDisplay() {
        const collisionElement = document.getElementById('collisionCount');
        if (collisionElement) {
            collisionElement.textContent = this.collisions;
        }
    }

    getUltraRandom() {
        const sources = [
            Math.random(),
            performance.now() % 1,
            Date.now() % 1,
            this.entropyPool[Math.floor(Math.random() * this.entropyPool.length)],
            this.collisions % 1,
            this.settings.scanDepth / 20,
            this.settings.quantumNoise / 200
        ];

        let result = 0;
        sources.forEach(source => {
            result = (result + source) % 1;
        });

        return Math.abs(result);
    }

    generate(min, max) {
        this.generatedCount++;
        
        // Запускаем столкновения для шоу
        this.startCollisionSequence();
        
        const range = max - min + 1;
        let result = min + Math.floor(this.getUltraRandom() * range);

        // Защита от повторов
        if (range < 50 && result === this.lastResult) {
            result = min + ((result - min + 1) % range);
        }

        this.lastResult = result;
        this.updateDisplay(result);
        
        return result;
    }

    startCollisionSequence() {
        const numCollisions = 3 + Math.floor(this.settings.scanDepth / 3);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < numCollisions; i++) {
            setTimeout(() => {
                this.createCollisionEffect(centerX, centerY);
                this.collisions++;
                this.updateCollisionDisplay();
            }, i * 150);
        }
    }

    updateDisplay(result) {
        const resultElement = document.getElementById('quantumResult');
        const countElement = document.getElementById('scanCount');
        const entropyElement = document.getElementById('entropyLevel');
        
        if (resultElement) {
            resultElement.textContent = result;
            resultElement.style.transform = 'scale(1.3)';
            setTimeout(() => resultElement.style.transform = 'scale(1)', 300);
        }
        
        if (countElement) countElement.textContent = this.generatedCount;
        if (entropyElement) entropyElement.textContent = Math.round(this.entropyPool.length / 20) + '%';
    }
}

// ЗАПУСКАЕМ!
let quantumCollider = null;

function initQuantumReality() {
    if (!quantumCollider) {
        quantumCollider = new QuantumCollider();
        document.getElementById('systemStatus').textContent = 'КОЛЛАЙДЕР_АКТИВИРОВАН';
    }
}

function generateNumber() {
    if (!quantumCollider) initQuantumReality();
    
    const minInput = document.getElementById('minRange');
    const maxInput = document.getElementById('maxRange');
    
    if (!minInput || !maxInput) {
        console.error('Поля ввода не найдены!');
        return;
    }
    
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
    }, 800);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загружаем квантовый коллайдер...');
    initQuantumReality();
    
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateNumber);
    }
    
    // Добавляем счетчик столкновений если его нет
    const statsContainer = document.querySelector('.reality-stats');
    if (statsContainer && !document.getElementById('collisionCount')) {
        statsContainer.innerHTML += `
            <div class="stat">
                <span class="stat-label">СТОЛКНОВЕНИЯ:</span>
                <span id="collisionCount" class="stat-value">0</span>
            </div>
        `;
    }
});
