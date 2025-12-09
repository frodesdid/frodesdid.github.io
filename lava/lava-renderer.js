// lava-renderer.js - Визуализатор лава-лампы

console.log('🎨 lava-renderer.js загружен');

class LavaLampRenderer {
    constructor(engine, canvasId = 'lavaCanvas') {
        this.engine = engine;
        this.canvas = document.getElementById(canvasId);
        
        if (!this.canvas) {
            console.error('❌ Canvas не найден');
            this.canvas = this.createEmergencyCanvas();
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.pixelRatio = window.devicePixelRatio || 1;
        
        // Эффекты и настройки рендеринга
        this.effects = {
            glow: true,
            trails: true,
            reflections: true,
            shadows: true,
            quality: 'high' // 'low', 'medium', 'high'
        };
        
        this.resize();
        this.init();
    }
    
    createEmergencyCanvas() {
        console.log('⚠️ Создаю аварийный canvas');
        const canvas = document.createElement('canvas');
        canvas.id = 'lavaCanvas';
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 2px solid #ff003c;
            border-radius: 10px;
        `;
        document.body.appendChild(canvas);
        return canvas;
    }
    
    init() {
        console.log('🖌️ Инициализация рендерера');
        
        // Ресайз при изменении окна
        window.addEventListener('resize', () => this.resize());
        
        // Анимация
        this.lastTime = 0;
        this.animationId = null;
        
        // Градиенты для кэширования
        this.gradientsCache = new Map();
        
        // Начинаем анимацию
        this.start();
    }
    
    resize() {
        const container = this.canvas.parentElement || document.body;
        const width = container.clientWidth * 0.9;
        const height = container.clientHeight * 0.8;
        
        this.canvas.width = width * this.pixelRatio;
        this.canvas.height = height * this.pixelRatio;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        
        console.log(`📐 Canvas размер: ${width}x${height}`);
    }
    
    start() {
        if (this.animationId) return;
        
        console.log('▶️ Запуск рендеринга');
        this.engine.isRunning = true;
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            this.engine.isRunning = false;
            console.log('⏹️ Остановка рендеринга');
        }
    }
    
    animate(currentTime) {
        const deltaTime = this.lastTime ? (currentTime - this.lastTime) / 1000 : 0.016;
        this.lastTime = currentTime;
        
        // Обновляем физику
        this.engine.update(deltaTime);
        
        // Очищаем canvas
        this.clear();
        
        // Рисуем колбу
        this.drawContainer();
        
        // Рисуем капли
        this.engine.blobs.forEach(blob => {
            this.drawBlob(blob);
            if (this.effects.trails) {
                this.drawTrail(blob);
            }
        });
        
        // Рисуем источник тепла
        this.drawHeatSource();
        
        // Эффекты поверх
        if (this.effects.glow) {
            this.applyGlowEffect();
        }
        
        // Продолжаем анимацию
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    clear() {
        // Создаем эффект медленного затухания для следов
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawContainer() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const margin = width * 0.05;
        
        // Фон колбы с градиентом
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.3, '#111111');
        gradient.addColorStop(0.7, '#1a1a1a');
        gradient.addColorStop(1, '#0a0a0a');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(margin, margin, width - 2 * margin, height - 2 * margin);
        
        // Стеклянный эффект
        this.ctx.strokeStyle = '#0066ff';
        this.ctx.lineWidth = 3 * this.pixelRatio;
        this.ctx.strokeRect(margin, margin, width - 2 * margin, height - 2 * margin);
        
        // Отражения на стекле
        if (this.effects.reflections) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.1;
            this.ctx.fillStyle = '#ffffff';
            
            // Верхнее отражение
            this.ctx.beginPath();
            this.ctx.ellipse(
                width / 2, 
                margin + 20, 
                width * 0.4, 
                30, 
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
            
            // Боковые отражения
            this.ctx.beginPath();
            this.ctx.moveTo(margin + 10, margin + 50);
            this.ctx.lineTo(margin + 30, margin + 100);
            this.ctx.lineTo(margin + 10, height - margin - 100);
            this.ctx.lineTo(margin + 30, height - margin - 50);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    drawBlob(blob) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const margin = width * 0.05;
        
        // Конвертируем координаты (0-1) в пиксели
        const x = margin + blob.x * (width - 2 * margin);
        const y = margin + blob.y * (height - 2 * margin);
        const radius = blob.radius * Math.min(width, height);
        
        // Создаем уникальный ключ для кэша градиента
        const gradientKey = `${blob.color}_${blob.glow.toFixed(2)}`;
        
        let gradient;
        if (this.gradientsCache.has(gradientKey)) {
            gradient = this.gradientsCache.get(gradientKey);
        } else {
            gradient = this.createBlobGradient(x, y, radius, blob);
            this.gradientsCache.set(gradientKey, gradient);
        }
        
        // Основная форма капли
        this.ctx.save();
        
        // Эффект колебания
        if (blob.wobbleSpeed > 0) {
            const wobbleX = Math.sin(blob.wobble) * radius * 0.1;
            const wobbleY = Math.cos(blob.wobble * 1.3) * radius * 0.1;
            this.ctx.translate(wobbleX, wobbleY);
        }
        
        // Тень
        if (this.effects.shadows) {
            this.ctx.shadowColor = blob.color;
            this.ctx.shadowBlur = radius * blob.glow * 2;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        }
        
        // Рисуем каплю
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Внутреннее свечение
        this.ctx.beginPath();
        this.ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = this.ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, 0,
            x, y, radius * 0.5
        );
        this.ctx.fillStyle.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        this.ctx.fillStyle.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fill();
        
        this.ctx.restore();
        
        // Эффект нагрева (рябь)
        if (blob.isHeated && blob.temperature > 0.7) {
            this.drawHeatRipple(x, y, radius, blob.temperature);
        }
    }
    
    createBlobGradient(x, y, radius, blob) {
        const gradient = this.ctx.createRadialGradient(
            x - radius * 0.3, 
            y - radius * 0.3, 
            0,
            x, 
            y, 
            radius
        );
        
        // Яркое ядро
        gradient.addColorStop(0, this.lightenColor(blob.color, 0.5));
        
        // Основной цвет
        gradient.addColorStop(0.3, blob.color);
        
        // Прозрачные края
        gradient.addColorStop(1, blob.color + '00');
        
        return gradient;
    }
    
    lightenColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.min(255, ((num >> 16) + Math.floor(255 * amount)));
        const g = Math.min(255, ((num >> 8 & 0x00FF) + Math.floor(255 * amount)));
        const b = Math.min(255, ((num & 0x0000FF) + Math.floor(255 * amount)));
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }
    
    drawTrail(blob) {
        if (blob.trail.length < 2) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        const margin = width * 0.05;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        blob.trail.forEach((point, index) => {
            const alpha = (blob.trail.length - index) / blob.trail.length * 0.3;
            const trailX = margin + point.x * (width - 2 * margin);
            const trailY = margin + point.y * (height - 2 * margin);
            const trailRadius = blob.radius * Math.min(width, height) * 0.5;
            
            this.ctx.beginPath();
            this.ctx.arc(trailX, trailY, trailRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = blob.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            this.ctx.fill();
        });
        
        this.ctx.restore();
    }
    
    drawHeatRipple(x, y, radius, temperature) {
        const rippleCount = Math.floor(temperature * 3);
        
        for (let i = 0; i < rippleCount; i++) {
            const rippleRadius = radius * (1 + i * 0.2);
            const alpha = 0.1 * (1 - i / rippleCount);
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.beginPath();
            this.ctx.arc(x, y, rippleRadius, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ff5500';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
    
    drawHeatSource() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const margin = width * 0.05;
        
        const heat = this.engine.heatSource;
        const x = margin + heat.x * (width - 2 * margin);
        const y = margin + heat.y * (height - 2 * margin);
        const radius = 20 * heat.power;
        
        // Свечение источника
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, '#ff5500');
        gradient.addColorStop(0.5, '#ff2200');
        gradient.addColorStop(1, 'rgba(255, 34, 0, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    applyGlowEffect() {
        // Простой эффект свечения через размытие
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.filter = 'blur(10px)';
        this.ctx.globalAlpha = 0.3;
        this.ctx.drawImage(this.canvas, 0, 0);
        this.ctx.restore();
    }
    
    // Методы управления
    setEffect(effect, value) {
        if (this.effects.hasOwnProperty(effect)) {
            this.effects[effect] = value;
        }
    }
    
    setQuality(quality) {
        this.effects.quality = quality;
        this.pixelRatio = quality === 'high' ? window.devicePixelRatio : 1;
        this.resize();
    }
    
    takeScreenshot() {
        const link = document.createElement('a');
        link.download = `lava-lamp-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

// Экспорт
window.LavaLampRenderer = LavaLampRenderer;
console.log('✅ Рендерер лава-лампы готов');
