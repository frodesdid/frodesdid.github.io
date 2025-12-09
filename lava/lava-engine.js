// lava-engine.js - Ядро физики цифровой лава-лампы 

console.log('🔥 lava-engine.js загружен');

class LavaLampEngine {
    constructor(config = {}) {
        this.config = {
            // Основные параметры
            blobCount: config.blobCount || 12,
            temperature: config.temperature || 0.5, // 0-1
            viscosity: config.viscosity || 0.3,    // 0-1
            chaos: config.chaos || 0.2,           // Уровень хаоса
            
            // Физические константы
            gravity: 0.15,
            buoyancy: 0.12,
            friction: 0.95,
            repulsionForce: 2.5,
            
            // Визуальные
            colorSchemes: {
                rebellion: ['#ff003c', '#ff5500', '#ff8800'],
                cyberpunk: ['#0066ff', '#00ff88', '#8800ff'],
                inferno: ['#ff003c', '#ff2200', '#ff8800'],
                plasma: ['#00ff88', '#0066ff', '#8800ff']
            },
            
            ...config
        };
        
        this.blobs = [];
        this.isRunning = false;
        this.time = 0;
        this.heatSource = { x: 0.5, y: 0.9, power: 1.0 };
        
        this.init();
    }
    
    init() {
        console.log('⚙️ Инициализация ядра лава-лампы');
        this.generateBlobs();
        this.setupEventListeners();
    }
    
    generateBlobs() {
        this.blobs = [];
        const colorScheme = this.config.colorSchemes.rebellion;
        
        for (let i = 0; i < this.config.blobCount; i++) {
            const blob = {
                id: `blob_${Date.now()}_${i}`,
                
                // Позиция и размер
                x: 0.3 + Math.random() * 0.4,
                y: 0.1 + Math.random() * 0.8,
                radius: 0.03 + Math.random() * 0.04,
                
                // Физика
                vx: (Math.random() - 0.5) * 0.02,
                vy: (Math.random() - 0.5) * 0.02,
                mass: 0,
                temperature: 0.3 + Math.random() * 0.4,
                
                // Визуальные
                color: colorScheme[Math.floor(Math.random() * colorScheme.length)],
                glow: 0.5 + Math.random() * 0.5,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.05 + Math.random() * 0.1,
                
                // Состояние
                isHeated: false,
                mergeTimer: 0,
                trail: []
            };
            
            blob.mass = Math.PI * blob.radius * blob.radius;
            this.blobs.push(blob);
        }
        
        console.log(`✅ Сгенерировано ${this.blobs.length} капель`);
    }
    
    setupEventListeners() {
        // Вибрирование при столкновении (мобильные)
        if (navigator.vibrate) {
            this.vibrateOnCollision = true;
        }
        
        // Изменение параметров в реальном времени
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.config.temperature = Math.min(1, this.config.temperature + 0.1);
                    break;
                case 'ArrowDown':
                    this.config.temperature = Math.max(0, this.config.temperature - 0.1);
                    break;
                case 'ArrowRight':
                    this.config.chaos = Math.min(1, this.config.chaos + 0.1);
                    break;
                case 'ArrowLeft':
                    this.config.chaos = Math.max(0, this.config.chaos - 0.1);
                    break;
                case ' ':
                    this.isRunning = !this.isRunning;
                    break;
            }
        });
    }
    
    update(deltaTime) {
        if (!this.isRunning) return;
        
        this.time += deltaTime;
        
        // Обновляем позицию источника тепла (движется)
        this.heatSource.x = 0.5 + Math.sin(this.time * 0.5) * 0.3;
        this.heatSource.power = 0.8 + Math.sin(this.time * 0.3) * 0.2;
        
        // Обновляем каждую каплю
        this.blobs.forEach((blob, index) => {
            this.updateBlob(blob, index, deltaTime);
        });
        
        // Обработка столкновений
        this.handleCollisions();
        
        // Ограничение внутри колбы
        this.constrainToContainer();
        
        // Добавление хаоса
        this.applyChaos();
    }
    
    updateBlob(blob, index, deltaTime) {
        // Обновляем трейл (след)
        blob.trail.unshift({ x: blob.x, y: blob.y });
        if (blob.trail.length > 10) blob.trail.pop();
        
        // Обновляем колебания
        blob.wobble += blob.wobbleSpeed * deltaTime * 60;
        
        // Тепловое воздействие
        const dx = blob.x - this.heatSource.x;
        const dy = blob.y - this.heatSource.y;
        const distanceToHeat = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceToHeat < 0.3) {
            const heatIntensity = (0.3 - distanceToHeat) / 0.3 * this.heatSource.power;
            blob.temperature = Math.min(1, blob.temperature + heatIntensity * 0.01);
            blob.isHeated = true;
            
            // Нагрев увеличивает подъемную силу
            blob.vy -= this.config.buoyancy * blob.temperature * heatIntensity;
        } else {
            blob.isHeated = false;
            blob.temperature = Math.max(0.3, blob.temperature - 0.001);
        }
        
        // Физика
        const temperatureEffect = blob.temperature * this.config.temperature;
        
        // Подъемная сила (зависит от температуры)
        blob.vy -= this.config.buoyancy * temperatureEffect;
        
        // Гравитация (зависит от массы и вязкости)
        blob.vy += this.config.gravity * (1 - temperatureEffect) * (1 - this.config.viscosity);
        
        // Случайные турбулентности
        if (Math.random() < this.config.chaos) {
            blob.vx += (Math.random() - 0.5) * 0.01 * this.config.chaos;
            blob.vy += (Math.random() - 0.5) * 0.01 * this.config.chaos;
        }
        
        // Сопротивление среды (вязкость)
        blob.vx *= 1 - this.config.viscosity * 0.1;
        blob.vy *= 1 - this.config.viscosity * 0.1;
        
        // Обновление позиции
        blob.x += blob.vx;
        blob.y += blob.vy;
        
        // Эффект "дрожания" при нагреве
        if (blob.isHeated) {
            blob.x += Math.sin(this.time * 10 + index) * 0.001 * temperatureEffect;
            blob.y += Math.cos(this.time * 8 + index) * 0.001 * temperatureEffect;
        }
    }
    
    handleCollisions() {
        for (let i = 0; i < this.blobs.length; i++) {
            for (let j = i + 1; j < this.blobs.length; j++) {
                const blobA = this.blobs[i];
                const blobB = this.blobs[j];
                
                const dx = blobB.x - blobA.x;
                const dy = blobB.y - blobA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = blobA.radius + blobB.radius;
                
                if (distance < minDistance) {
                    // Столкновение!
                    if (this.vibrateOnCollision) {
                        navigator.vibrate(50);
                    }
                    
                    // Упругое столкновение
                    const angle = Math.atan2(dy, dx);
                    const targetX = blobA.x + Math.cos(angle) * minDistance;
                    const targetY = blobA.y + Math.sin(angle) * minDistance;
                    
                    const force = this.config.repulsionForce * (1 - distance / minDistance);
                    
                    const ax = (targetX - blobB.x) * force / blobA.mass;
                    const ay = (targetY - blobB.y) * force / blobA.mass;
                    
                    blobA.vx -= ax;
                    blobA.vy -= ay;
                    blobB.vx += ax;
                    blobB.vy += ay;
                    
                    // Возможность слияния при определенных условиях
                    if (blobA.temperature > 0.8 && blobB.temperature > 0.8 && 
                        Math.random() < 0.01) {
                        this.mergeBlobs(i, j);
                    }
                }
            }
        }
    }
    
    mergeBlobs(indexA, indexB) {
        const blobA = this.blobs[indexA];
        const blobB = this.blobs[indexB];
        
        // Создаем новую каплю
        const newBlob = {
            id: `merged_${Date.now()}`,
            x: (blobA.x + blobB.x) / 2,
            y: (blobA.y + blobB.y) / 2,
            radius: Math.sqrt(blobA.radius * blobA.radius + blobB.radius * blobB.radius),
            vx: (blobA.vx + blobB.vx) / 2,
            vy: (blobA.vy + blobB.vy) / 2,
            mass: blobA.mass + blobB.mass,
            temperature: (blobA.temperature + blobB.temperature) / 2,
            color: this.blendColors(blobA.color, blobB.color),
            glow: Math.max(blobA.glow, blobB.glow),
            wobble: 0,
            wobbleSpeed: (blobA.wobbleSpeed + blobB.wobbleSpeed) / 2,
            isHeated: blobA.isHeated || blobB.isHeated,
            trail: []
        };
        
        // Удаляем старые, добавляем новую
        this.blobs.splice(Math.max(indexA, indexB), 1);
        this.blobs.splice(Math.min(indexA, indexB), 1);
        this.blobs.push(newBlob);
        
        console.log('🌀 Слияние капель!');
    }
    
    blendColors(colorA, colorB) {
        // Простое смешивание цветов
        return Math.random() > 0.5 ? colorA : colorB;
    }
    
    constrainToContainer() {
        const margin = 0.05;
        
        this.blobs.forEach(blob => {
            // Боковые стенки
            if (blob.x < blob.radius + margin) {
                blob.x = blob.radius + margin;
                blob.vx = Math.abs(blob.vx) * 0.8;
            }
            if (blob.x > 1 - blob.radius - margin) {
                blob.x = 1 - blob.radius - margin;
                blob.vx = -Math.abs(blob.vx) * 0.8;
            }
            
            // Верх и низ
            if (blob.y < blob.radius + margin) {
                blob.y = blob.radius + margin;
                blob.vy = Math.abs(blob.vy) * 0.8;
            }
            if (blob.y > 1 - blob.radius - margin) {
                blob.y = 1 - blob.radius - margin;
                blob.vy = -Math.abs(blob.vy) * 0.8;
            }
        });
    }
    
    applyChaos() {
        if (this.config.chaos > 0.5 && Math.random() < 0.02) {
            // Случайное создание новой капли
            if (this.blobs.length < 30) {
                const colorScheme = this.config.colorSchemes.rebellion;
                const newBlob = {
                    id: `chaos_${Date.now()}`,
                    x: 0.1 + Math.random() * 0.8,
                    y: 0.9,
                    radius: 0.02 + Math.random() * 0.03,
                    vx: (Math.random() - 0.5) * 0.05,
                    vy: -0.1 - Math.random() * 0.1,
                    mass: 0,
                    temperature: 0.8 + Math.random() * 0.2,
                    color: colorScheme[Math.floor(Math.random() * colorScheme.length)],
                    glow: 0.8,
                    wobble: Math.random() * Math.PI * 2,
                    wobbleSpeed: 0.1 + Math.random() * 0.2,
                    isHeated: true,
                    trail: []
                };
                newBlob.mass = Math.PI * newBlob.radius * newBlob.radius;
                this.blobs.push(newBlob);
            }
        }
    }
    
    // Публичные методы для управления
    setTemperature(value) {
        this.config.temperature = Math.max(0, Math.min(1, value));
    }
    
    setViscosity(value) {
        this.config.viscosity = Math.max(0, Math.min(1, value));
    }
    
    setChaos(value) {
        this.config.chaos = Math.max(0, Math.min(1, value));
    }
    
    addBlob() {
        const colorScheme = this.config.colorSchemes.rebellion;
        const newBlob = {
            id: `manual_${Date.now()}`,
            x: 0.5,
            y: 0.9,
            radius: 0.03 + Math.random() * 0.02,
            vx: (Math.random() - 0.5) * 0.02,
            vy: -0.05,
            mass: 0,
            temperature: 0.5 + Math.random() * 0.3,
            color: colorScheme[Math.floor(Math.random() * colorScheme.length)],
            glow: 0.6,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.05 + Math.random() * 0.1,
            isHeated: false,
            trail: []
        };
        newBlob.mass = Math.PI * newBlob.radius * newBlob.radius;
        this.blobs.push(newBlob);
    }
    
    reset() {
        this.generateBlobs();
    }
    
    getState() {
        return {
            blobCount: this.blobs.length,
            averageTemperature: this.blobs.reduce((sum, b) => sum + b.temperature, 0) / this.blobs.length,
            chaosLevel: this.config.chaos,
            isRunning: this.isRunning
        };
    }
}

// Экспорт для использования
window.LavaLampEngine = LavaLampEngine;
console.log('✅ Ядро лава-лампы готово');
