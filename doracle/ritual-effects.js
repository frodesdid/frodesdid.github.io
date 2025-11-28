// ===== СИСТЕМА ВИЗУАЛЬНЫХ ЭФФЕКТОВ =====
class RitualEffects {
    constructor() {
        this.isInitialized = false;
        this.activeEffects = new Set();
    }

    // Инициализация системы эффектов
    initialize() {
        if (this.isInitialized) return;
        
        this.createGlobalStyles();
        this.isInitialized = true;
        console.log('🎨 Система визуальных эффектов инициализирована');
    }

    // Создание глобальных стилей для эффектов
    createGlobalStyles() {
        const styles = `
            .ritual-particle {
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                border-radius: 50%;
            }
            
            .energy-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(2px);
                pointer-events: none;
            }
            
            @keyframes particleFloat {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
            }
            
            @keyframes orbPulse {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.3); opacity: 1; }
            }
            
            @keyframes shockwave {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Эффект активации шара
    createActivationEffect(centerX, centerY) {
        // Шоквейв при активации
        this.createShockwave(centerX, centerY, '#ff003c');
        
        // Частицы энергии
        for (let i = 0; i < 16; i++) {
            setTimeout(() => {
                this.createEnergyParticle(centerX, centerY);
            }, i * 80);
        }
        
        // Орбы вокруг шара
        this.createOrbRing(centerX, centerY);
    }

    // Эффект проявления манифестации
    createRevelationEffect(centerX, centerY, intensity = 'medium') {
        const intensityMap = {
            'low': { count: 8, size: 3, speed: 800 },
            'medium': { count: 12, size: 4, speed: 600 },
            'high': { count: 20, size: 5, speed: 400 }
        };
        
        const config = intensityMap[intensity] || intensityMap.medium;
        
        // Вспышка в центре
        this.createFlash(centerX, centerY, config.size);
        
        // Кольцо частиц
        for (let i = 0; i < config.count; i++) {
            setTimeout(() => {
                this.createRevelationParticle(centerX, centerY, config);
            }, i * 50);
        }
    }

    // Создание шоквейва
    createShockwave(x, y, color) {
        const shockwave = document.createElement('div');
        shockwave.className = 'ritual-particle';
        shockwave.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, ${color}, transparent);
            border: 2px solid ${color};
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(shockwave);
        
        const animation = shockwave.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(8)', opacity: 0 }
        ], {
            duration: 1200,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => shockwave.remove();
        this.activeEffects.add(animation);
    }

    // Создание частицы энергии
    createEnergyParticle(centerX, centerY) {
        const particle = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const size = 3 + Math.random() * 4;
        const colors = ['#ff003c', '#0066ff', '#00ff88', '#ff5500'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.className = 'ritual-particle';
        particle.style.cssText = `
            left: ${centerX}px;
            top: ${centerY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            --tx: ${Math.cos(angle) * distance}px;
            --ty: ${Math.sin(angle) * distance}px;
        `;
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: 'translate(var(--tx), var(--ty)) scale(0)', opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => particle.remove();
        this.activeEffects.add(animation);
    }

    // Создание кольца орбов
    createOrbRing(centerX, centerY) {
        const orbCount = 6;
        const radius = 120;
        
        for (let i = 0; i < orbCount; i++) {
            const angle = (i / orbCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.createOrb(x, y, i * 200);
        }
    }

    // Создание орба
    createOrb(x, y, delay) {
        const orb = document.createElement('div');
        const size = 8 + Math.random() * 6;
        const colors = ['#ff003c', '#0066ff', '#00ff88'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        orb.className = 'energy-orb';
        orb.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            transform: translate(-50%, -50%);
            animation: orbPulse 2s ease-in-out infinite;
            animation-delay: ${delay}ms;
        `;
        
        document.body.appendChild(orb);
        
        // Автоудаление через 3 секунды
        setTimeout(() => {
            orb.remove();
        }, 3000);
    }

    // Создание вспышки
    createFlash(x, y, intensity) {
        const flash = document.createElement('div');
        const size = intensity * 15;
        
        flash.className = 'ritual-particle';
        flash.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, #00ff88, #0066ff, transparent);
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(flash);
        
        const animation = flash.animate([
            { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => flash.remove();
        this.activeEffects.add(animation);
    }

    // Создание частицы откровения
    createRevelationParticle(centerX, centerY, config) {
        const particle = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        
        particle.className = 'ritual-particle';
        particle.style.cssText = `
            left: ${centerX}px;
            top: ${centerY}px;
            width: ${config.size}px;
            height: ${config.size}px;
            background: #00ff88;
            --tx: ${Math.cos(angle) * distance}px;
            --ty: ${Math.sin(angle) * distance}px;
        `;
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: 'translate(var(--tx), var(--ty)) scale(0)', opacity: 0 }
        ], {
            duration: config.speed,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        });
        
        animation.onfinish = () => particle.remove();
        this.activeEffects.add(animation);
    }

    // Очистка всех активных эффектов
    clearAllEffects() {
        this.activeEffects.forEach(animation => {
            try {
                animation.cancel();
            } catch (e) {
                // Игнорируем ошибки от уже завершенных анимаций
            }
        });
        this.activeEffects.clear();
        
        // Удаляем все частицы
        document.querySelectorAll('.ritual-particle, .energy-orb').forEach(el => {
            el.remove();
        });
    }
}

window.RitualEffects = RitualEffects;
