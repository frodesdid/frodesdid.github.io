class NeuroSynthesizer {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.isPlaying = false;
        this.currentFrequency = 432;
        this.energyLevel = 0;
        
        this.frequencyData = {
            174: { name: "Foundation", color: "#4ECDC4", description: "Базовые энергии, основание" },
            285: { name: "Energy", color: "#45B7D1", description: "Восстановление энергии" },
            396: { name: "Liberation", color: "#FF6B6B", description: "Освобождение от страхов" },
            417: { name: "Change", color: "#96CEB4", description: "Стимуляция перемен" },
            432: { name: "Harmony", color: "#00FF41", description: "Естественная гармония" },
            528: { name: "Healing", color: "#00FFEA", description: "Исцеление и репарация" },
            639: { name: "Connection", color: "#FF00FF", description: "Гармонизация отношений" },
            741: { name: "Intuition", color: "#0080FF", description: "Пробуждение интуиции" },
            852: { name: "Awakening", color: "#FF003C", description: "Возвращение к духовности" }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateEnergyDisplay();
    }

    setupEventListeners() {
        // Клики по узлам частот
        document.querySelectorAll('.freq-node').forEach(node => {
            node.addEventListener('click', (e) => {
                const freq = parseInt(e.currentTarget.dataset.freq);
                this.selectFrequency(freq);
            });
        });

        // Слайдеры
        document.getElementById('intensity').addEventListener('input', (e) => {
            this.updateIntensity(e.target.value);
        });

        document.getElementById('modulation').addEventListener('input', (e) => {
            this.updateModulation(e.target.value);
        });
    }

    selectFrequency(frequency) {
        this.currentFrequency = frequency;
        
        // Обновляем UI
        document.querySelectorAll('.freq-node').forEach(node => {
            node.classList.remove('active');
        });
        
        event.currentTarget.classList.add('active');
        document.getElementById('currentFreq').textContent = frequency;
        
        // Обновляем визуализацию
        this.updateVisualization();
    }

    async startFrequency() {
        if (this.isPlaying) return;

        try {
            // Создаем AudioContext при первом использовании
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Создаем осциллятор
            this.oscillator = this.audioContext.createOscillator();
            this.oscillator.type = 'sine';
            this.oscillator.frequency.setValueAtTime(this.currentFrequency, this.audioContext.currentTime);
            
            // Создаем gain node для контроля громкости
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            
            // Подключаем
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            // Запускаем
            this.oscillator.start();
            this.isPlaying = true;
            
            this.updateStatus('АКТИВНО');
            this.startEnergyFlow();
            
        } catch (error) {
            console.error('Ошибка синтезатора:', error);
            this.fallbackVisualization();
        }
    }

    stopFrequency() {
        if (!this.isPlaying || !this.oscillator) return;

        // Плавное затухание
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
        
        setTimeout(() => {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.isPlaying = false;
            this.updateStatus('ПАУЗА');
            this.stopEnergyFlow();
        }, 1000);
    }

    createFrequencyMix() {
        if (this.isPlaying) {
            this.stopFrequency();
            setTimeout(() => this.startFrequencyMix(), 1000);
        } else {
            this.startFrequencyMix();
        }
    }

    startFrequencyMix() {
        // Создает микс из нескольких частот
        const baseFreq = this.currentFrequency;
        const frequencies = [
            baseFreq,
            baseFreq * 1.5, // Квинта
            baseFreq * 2,   // Октава
            baseFreq * 2.5  // Большая терция
        ];

        // Сложная визуализация для микса
        this.createComplexVisualization(frequencies);
        this.updateStatus('МИКС АКТИВЕН');
    }

    updateIntensity(value) {
        if (this.gainNode) {
            const volume = value / 100 * 0.3; // Макс громкость 30%
            this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
        this.energyLevel = value;
        this.updateEnergyDisplay();
    }

    updateModulation(value) {
        // Модуляция частоты для более интересного звука
        if (this.oscillator) {
            const modulationDepth = value / 100 * 10; // ±10 Hz
            const now = this.audioContext.currentTime;
            
            this.oscillator.frequency.setValueAtTime(
                this.currentFrequency + Math.sin(now) * modulationDepth, 
                now
            );
        }
    }

    updateVisualization() {
        const wave = document.querySelector('.sine-wave');
        const color = this.frequencyData[this.currentFrequency]?.color || '#00ffea';
        
        wave.style.background = color;
        wave.style.boxShadow = `0 0 10px ${color}`;
    }

    createComplexVisualization(frequencies) {
        const visualizer = document.getElementById('waveDisplay');
        visualizer.innerHTML = '';
        
        frequencies.forEach((freq, index) => {
            const wave = document.createElement('div');
            wave.className = 'harmonic-wave';
            wave.style.cssText = `
                position: absolute;
                bottom: ${index * 15}px;
                width: 100%;
                height: 2px;
                background: ${this.getColorForFrequency(freq)};
                opacity: ${0.8 - index * 0.2};
                animation: wave-move ${2 - index * 0.3}s linear infinite;
            `;
            visualizer.appendChild(wave);
        });
    }

    getColorForFrequency(freq) {
        const colors = ['#00ffea', '#ff00ff', '#00ff41', '#0080ff'];
        return colors[Math.floor(freq % colors.length)];
    }

    startEnergyFlow() {
        this.energyInterval = setInterval(() => {
            this.energyLevel = Math.min(100, this.energyLevel + 1);
            this.updateEnergyDisplay();
            this.createEnergyParticles();
        }, 100);
    }

    stopEnergyFlow() {
        if (this.energyInterval) {
            clearInterval(this.energyInterval);
            this.energyLevel = 0;
            this.updateEnergyDisplay();
        }
    }

    createEnergyParticles() {
        const particles = document.querySelector('.energy-particles');
        const particle = document.createElement('div');
        
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: #00ffea;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            animation: particle-float ${1 + Math.random()}s ease-in-out;
        `;
        
        particles.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }

    updateEnergyDisplay() {
        document.getElementById('energyLevel').textContent = `${this.energyLevel}%`;
    }

    updateStatus(status) {
        document.getElementById('synthStatus').textContent = status;
    }

    fallbackVisualization() {
        // Fallback если Audio API не доступен
        this.updateStatus('ВИЗУАЛЬНЫЙ РЕЖИМ');
        this.createComplexVisualization([432, 528, 639]);
    }
}

// Глобальные функции для кнопок
let neuroSynth = null;

function initSynthesizer() {
    if (!neuroSynth) {
        neuroSynth = new NeuroSynthesizer();
    }
}

function startFrequency() {
    if (!neuroSynth) initSynthesizer();
    neuroSynth.startFrequency();
}

function stopFrequency() {
    if (neuroSynth) neuroSynth.stopFrequency();
}

function createFrequencyMix() {
    if (!neuroSynth) initSynthesizer();
    neuroSynth.createFrequencyMix();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initSynthesizer);
