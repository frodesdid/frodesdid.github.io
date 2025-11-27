// REALITY_CANVAS v2.0 - Визуализация квантового сканирования реальности
class RealityCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.scanData = null;
        this.scanProgress = 0;
        this.isScanning = false;
        this.currentScanLayer = 0;
        
        this.particles = [];
        this.energyFields = [];
        this.quantumStrings = [];
        
        this.initCanvas();
        this.startBackgroundAnimation();
    }

    initCanvas() {
        // Создание градиентного фона
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width / 2
        );
        
        gradient.addColorStop(0, 'rgba(0, 255, 234, 0.1)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 10, 20, 0.8)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    startBackgroundAnimation() {
        // Фоновая анимация квантового поля
        this.animateQuantumField();
    }

    animateQuantumField() {
        if (!this.isScanning) {
            this.drawQuantumBackground();
        }
        requestAnimationFrame(() => this.animateQuantumField());
    }

    drawQuantumBackground() {
        // Очистка с прозрачностью для следов
        this.ctx.fillStyle = 'rgba(0, 10, 20, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Квантовые флуктуации
        this.drawQuantumFluctuations();
        
        // Энергетические частицы
        this.updateParticles();
        
        // Струны пространства-времени
        this.drawQuantumStrings();
    }

    drawQuantumFluctuations() {
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 15; i++) {
            const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * this.width;
            const y = (Math.cos(time * 0.3 + i) * 0.5 + 0.5) * this.height;
            const size = 1 + Math.sin(time + i) * 0.5;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 234, ${0.2 + Math.sin(time + i) * 0.1})`;
            this.ctx.fill();
        }
    }

    updateParticles() {
        const time = Date.now() * 0.001;
        
        // Добавление новых частиц
        if (this.particles.length < 50 && Math.random() < 0.3) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: 0.005 + Math.random() * 0.01,
                color: Math.random() < 0.5 ? '#00ffea' : '#ff00ff'
            });
        }
        
        // Обновление и отрисовка частиц
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `${particle.color}${Math.floor(particle.life * 255).toString(16).padStart(2, '0')}`;
            this.ctx.fill();
            
            return particle.life > 0;
        });
    }

    drawQuantumStrings() {
        const time = Date.now() * 0.001;
        
        if (this.quantumStrings.length === 0) {
            // Инициализация квантовых струн
            for (let i = 0; i < 8; i++) {
                this.quantumStrings.push({
                    points: [],
                    phase: Math.random() * Math.PI * 2,
                    frequency: 0.5 + Math.random() * 2,
                    color: i % 2 === 0 ? '#00ffea' : '#ff00ff'
                });
            }
        }
        
        this.quantumStrings.forEach(string => {
            // Обновление точек струны
            if (string.points.length > 20) {
                string.points.shift();
            }
            
            const x = (Math.sin(time * string.frequency + string.phase) * 0.5 + 0.5) * this.width;
            const y = (Math.cos(time * string.frequency * 0.7 + string.phase) * 0.5 + 0.5) * this.height;
            
            string.points.push({ x, y });
            
            // Отрисовка струны
            if (string.points.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(string.points[0].x, string.points[0].y);
                
                for (let i = 1; i < string.points.length; i++) {
                    this.ctx.lineTo(string.points[i].x, string.points[i].y);
                }
                
                this.ctx.strokeStyle = `${string.color}66`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }

    startRealityScan(depth = 7) {
        this.isScanning = true;
        this.scanProgress = 0;
        this.currentScanLayer = 0;
        this.scanData = this.generateScanData(depth);
        
        this.performScanAnimation(depth);
    }

    generateScanData(depth) {
        const data = {
            depth: depth,
            layers: [],
            timestamp: Date.now(),
            quantumSignature: this.generateQuantumSignature()
        };
        
        for (let i = 0; i < depth; i++) {
            data.layers.push({
                level: i + 1,
                entropy: Math.random(),
                complexity: 0.3 + Math.random() * 0.7,
                frequency: 100 + Math.random() * 900,
                pattern: this.generateLayerPattern(i)
            });
        }
        
        return data;
    }

    generateLayerPattern(layer) {
        const patterns = [
            'QUANTUM_FLUCTUATION',
            'ENERGY_RESONANCE', 
            'STRING_VIBRATION',
            'REALITY_FABRIC',
            'TIME_STREAM',
            'DIMENSIONAL_INTERFACE',
            'CONSCIOUSNESS_FIELD'
        ];
        
        return patterns[layer % patterns.length];
    }

    generateQuantumSignature() {
        return Array.from({length: 16}, () => 
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
    }

    async performScanAnimation(depth) {
        for (let layer = 0; layer < depth; layer++) {
            await this.scanLayer(layer, depth);
            this.currentScanLayer = layer + 1;
            this.scanProgress = ((layer + 1) / depth) * 100;
            
            // Обновление прогресса в UI
            if (window.quantumReality) {
                window.quantumReality.updateScanProgress(layer + 1, depth);
            }
        }
        
        this.completeScan();
    }

    async scanLayer(layerIndex, totalLayers) {
        return new Promise(resolve => {
            const layer = this.scanData.layers[layerIndex];
            const duration = 300 + layerIndex * 100;
            const startTime = Date.now();
            
            const animateLayer = () => {
                const currentTime = Date.now();
                const progress = (currentTime - startTime) / duration;
                
                this.drawScanLayer(layer, layerIndex, progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animateLayer);
                } else {
                    resolve();
                }
            };
            
            animateLayer();
        });
    }

    drawScanLayer(layer, layerIndex, progress) {
        // Очистка canvas
        this.ctx.fillStyle = 'rgba(0, 10, 20, 0.3)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Отрисовка已完成ных слоев
        for (let i = 0; i < layerIndex; i++) {
            this.drawCompletedLayer(this.scanData.layers[i], i);
        }
        
        // Отрисовка текущего слоя с прогрессом
        this.drawCurrentLayer(layer, layerIndex, progress);
        
        // Эффекты сканирования
        this.drawScanEffects(progress);
    }

    drawCompletedLayer(layer, index) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const maxRadius = Math.min(this.width, this.height) * 0.4;
        const radius = (index + 1) * (maxRadius / this.scanData.depth);
        
        // Концентрические круги сканирования
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(0, 255, 234, ${0.3 + layer.entropy * 0.3})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Точки данных
        const dataPoints = 8 + index * 2;
        for (let i = 0; i < dataPoints; i++) {
            const angle = (i / dataPoints) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = layer.entropy > 0.5 ? '#ff00ff' : '#00ffea';
            this.ctx.fill();
        }
    }

    drawCurrentLayer(layer, index, progress) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const maxRadius = Math.min(this.width, this.height) * 0.4;
        const radius = (index + 1) * (maxRadius / this.scanData.depth);
        
        // Анимированное сканирование
        const scanAngle = progress * Math.PI * 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, radius, 0, scanAngle);
        this.ctx.closePath();
        
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, `rgba(0, 255, 234, ${0.8 * progress})`);
        gradient.addColorStop(1, `rgba(255, 0, 255, ${0.4 * progress})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Луч сканирования
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(
            centerX + Math.cos(scanAngle) * radius * 1.1,
            centerY + Math.sin(scanAngle) * radius * 1.1
        );
        this.ctx.strokeStyle = '#00ffea';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawScanEffects(progress) {
        const time = Date.now() * 0.001;
        
        // Интерференционные кольца
        for (let i = 0; i < 3; i++) {
            const ringProgress = (progress + i * 0.3) % 1;
            const ringRadius = ringProgress * Math.min(this.width, this.height) * 0.5;
            
            this.ctx.beginPath();
            this.ctx.arc(this.width / 2, this.height / 2, ringRadius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 0, 255, ${1 - ringProgress})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        
        // Частицы сканирования
        if (progress > 0 && progress < 1) {
            for (let i = 0; i < 5; i++) {
                const angle = time + i;
                const distance = progress * Math.min(this.width, this.height) * 0.4;
                
                const x = this.width / 2 + Math.cos(angle) * distance;
                const y = this.height / 2 + Math.sin(angle) * distance;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 1, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 234, ${0.5 + Math.sin(time * 10) * 0.3})`;
                this.ctx.fill();
            }
        }
    }

    completeScan() {
        // Финальная визуализация после сканирования
        this.drawFinalRealityMap();
        
        setTimeout(() => {
            this.isScanning = false;
            this.startBackgroundAnimation();
        }, 2000);
    }

    drawFinalRealityMap() {
        // Создание финальной карты реальности
        this.ctx.fillStyle = 'rgba(0, 10, 20, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Многослойная визуализация
        this.scanData.layers.forEach((layer, index) => {
            const radius = (index + 1) * (Math.min(this.width, this.height) * 0.4 / this.scanData.depth);
            
            // Основной круг слоя
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0, 255, 234, ${0.2 + layer.entropy * 0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Внутренний узор сложности
            this.drawComplexityPattern(layer, centerX, centerY, radius);
        });
        
        // Центральное ядро
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fill();
    }

    drawComplexityPattern(layer, x, y, radius) {
        const points = 6 + Math.floor(layer.complexity * 12);
        
        this.ctx.beginPath();
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const pointRadius = radius * (0.7 + Math.sin(angle * layer.complexity * 2) * 0.3);
            const px = x + Math.cos(angle) * pointRadius;
            const py = y + Math.sin(angle) * pointRadius;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = `rgba(255, 0, 255, ${0.3 + layer.complexity * 0.2})`;
        this.ctx.stroke();
    }
}

// Инициализация canvas при загрузке
let realityCanvas = null;

function initRealityCanvas() {
    realityCanvas = new RealityCanvas('realityCanvas');
}

document.addEventListener('DOMContentLoaded', initRealityCanvas);
