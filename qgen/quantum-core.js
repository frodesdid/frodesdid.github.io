// QUANTUM_COLLIDER - Генератор с ускорителем частиц
class QuantumCollider {
    constructor() {
        this.entropyPool = [];
        this.generatedCount = 0;
        this.lastResult = null;
        this.particles = [];
        this.collisions = 0;
        this.initEntropy();
        this.initCollider();
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
        if (!canvas) return;
        
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        
        // Создаем начальные частицы
        this.createParticles();
        
        // Запускаем анимацию
        this.animate();
    }

    createParticles() {
        this.particles = [];
        const numParticles = 12;
        
        for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 2;
            this.particles.push({
                angle: angle,
                speed: 0.02 + Math.random() * 0.03,
                radius: 80,
                size: 3 + Math.random() * 4,
                color: i % 2 === 0 ? '#00ffea' : '#ff00ff',
                trail: [],
                energy: 0.5 + Math.random() * 0.5
            });
        }
    }

    animate() {
        if (!this.ctx) return;
        
        // Очистка с прозрачностью для следов
        this.ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Рисуем кольцо коллайдера
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 255, 234, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Внутреннее кольцо
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Обновляем и рисуем частицы
        this.updateParticles(centerX, centerY);
        
        requestAnimationFrame(() => this.animate());
    }

    updateParticles(centerX, centerY) {
        this.particles.forEach(particle => {
            // Обновляем угол
            particle.angle += particle.speed;
            
            // Рассчитываем позицию
            const x = centerX + Math.cos(particle.angle) * particle.radius;
            const y = centerY + Math.sin(particle.angle) * particle.radius;
            
            // Добавляем в трейл
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
                
                this.ctx.strokeStyle = particle.color + '33';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
            
            // Рисуем частицу
            this.ctx.beginPath();
            this.ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            
            // Градиент для свечения
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
            
            // Проверяем столкновения
            this.checkCollisions(particle, x, y);
        });
    }

    checkCollisions(particle, x, y) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Случайные "столкновения" в центре
        if (Math.random() < 0.02) {
            this.createCollisionEffect(centerX, centerY);
            this.collisions++;
        }
        
        // Столкновения между частицами (упрощенно)
        if (Math.random() < 0.01) {
            const otherParticle = this.particles[Math.floor(Math.random() * this.particles.length)];
            if (otherParticle !== particle) {
                this.createEnergySpark(x, y);
            }
        }
    }

    createCollisionEffect(x, y) {
        // Эффект столкновения в центре
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            
            setTimeout(() => {
                this.createEnergySpark(
                    x + Math.cos(angle) * 10,
                    y + Math.sin(angle) * 10,
                    angle,
                    speed
                );
            }, i * 50);
        }
        
        // Вспышка в центре
        this.ctx.beginPath();
        this.ctx.arc(x, y, 30, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 30);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#ff00ff');
        gradient.addColorStop(1, '#00ffea00');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    createEnergySpark(x, y, angle = null, speed = null) {
        const spark = {
            x: x,
            y: y,
            vx: angle ? Math.cos(angle) * speed : (Math.random() - 0.5) * 4,
            vy: angle ? Math.sin(angle) * speed : (Math.random() - 0.5) * 4,
            life: 1,
            decay: 0.02 + Math.random() * 0.03,
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
            
            requestAnimationFrame(animateSpark);
        };
        
        animateSpark();
    }

    startCollisionSequence() {
        // Запускаем серию столкновений для генерации
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createCollisionEffect(this.canvas.width / 2, this.canvas.height / 2);
            }, i * 200);
        }
    }

    getUltraRandom() {
        const sources = [
            Math.random(),
            performance.now() % 1,
            Date.now() % 1,
            this.entropyPool[Math.floor(Math.random() * this.entropyPool.length)],
            Math.sin(performance.now() * Math.PI) % 1,
            this.collisions % 1
        ];

        let result = 0;
        sources.forEach(source => {
            result = (result + source) % 1;
        });

        return Math.abs(result);
    }

    generate(min, max) {
        this.generatedCount++;
        
        // Запускаем визуальное шоу столкновений
        this.startCollisionSequence();
        
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
