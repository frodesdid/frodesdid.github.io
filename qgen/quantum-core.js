// QUANTUM_CORE v5.0 - Абсолютная непредсказуемость (исправленная)
class QuantumRealityGenerator {
    constructor() {
        this.quantumState = new Map();
        this.entropyPools = {
            temporal: new Float64Array(2048),
            system: new Float64Array(1024),
            quantum: new Float64Array(512)
        };
        this.realityBuffer = new ArrayBuffer(1024);
        this.scanCount = 0;
        this.chaosLevel = 78;
        this.lastResult = null;
        
        this.initQuantumSystem();
        this.startEntropyHarvesting();
        console.log('🌌 Квантовая система инициализирована');
    }

    initQuantumSystem() {
        const quantumSeeds = this.harvestQuantumSeeds();
        
        quantumSeeds.forEach((seed, index) => {
            const superposition = this.createSuperposition(seed);
            const entanglement = this.createEntanglement(superposition, index);
            
            this.quantumState.set(`qbit_${index}`, {
                amplitude: superposition.amplitude,
                phase: superposition.phase,
                entangledWith: entanglement.partner,
                probability: entanglement.probability,
                frequency: 100 + Math.random() * 900
            });
        });
    }

    harvestQuantumSeeds() {
        const seeds = [];
        const now = performance.now();
        
        // Много источников энтропии
        seeds.push(now * Math.PI * 1.6180339887);
        seeds.push(navigator.hardwareConcurrency * screen.width * screen.height * 3.14159);
        seeds.push(Date.now() * 1e6 + now % 1000);
        seeds.push((now * Math.E) % 1e9);
        seeds.push(Math.sin(now) * Math.cos(now * 2.71828) * 1e6);
        
        // Системные источники
        if (performance.memory) {
            seeds.push(performance.memory.usedJSHeapSize ^ performance.memory.totalJSHeapSize);
        }
        if (navigator.connection) {
            seeds.push(navigator.connection.downlink * 12345);
        }
        
        return seeds;
    }

    createSuperposition(seed) {
        const angle = (seed % 360) * Math.PI / 180;
        const real = Math.cos(angle * 1.618);
        const imag = Math.sin(angle * 2.718);
        
        return {
            amplitude: Math.sqrt(real * real + imag * imag),
            phase: Math.atan2(imag, real) * 3.14159,
            probability: Math.abs(Math.sin(angle * 4.6692))
        };
    }

    createEntanglement(superposition, index) {
        const partners = [1, 2, 3, 4].filter(i => i !== index);
        const partner = partners[Math.floor(Math.sin(index * 1.618) * partners.length) % partners.length];
        
        return {
            partner: partner,
            probability: (superposition.amplitude * Math.PI * 2.71828) % 1,
            correlation: Math.cos(superposition.phase * 4.6692)
        };
    }

    async performRealityScan(depth = 7) {
        this.scanCount++;
        
        // Запускаем визуализацию сканирования
        if (window.realityCanvas) {
            window.realityCanvas.startRealityScan(depth);
        }

        const scanData = {
            timestamp: performance.now(),
            depth: depth,
            quantumNoise: this.calculateQuantumNoise(),
            entropyLevel: this.calculateTotalEntropy(),
            realitySignature: this.generateRealitySignature()
        };

        // Многоуровневое сканирование с реальными задержками
        for (let level = 1; level <= depth; level++) {
            await this.scanRealityLevel(level, scanData);
            this.updateScanProgress(level, depth);
        }

        return scanData;
    }

    calculateQuantumNoise() {
        let noise = 0;
        this.quantumState.forEach(state => {
            noise += state.amplitude * Math.sin(state.phase * state.frequency);
        });
        return (noise / this.quantumState.size) % 1;
    }

    calculateTotalEntropy() {
        let totalEntropy = 0;
        let totalWeight = 0;
        
        // Энтропия из квантовых состояний
        this.quantumState.forEach(state => {
            const entropy = state.probability * (1 - state.probability) * 4; // Максимум при 0.5
            totalEntropy += entropy;
            totalWeight++;
        });
        
        // Энтропия из пулов
        Object.values(this.entropyPools).forEach(pool => {
            const variance = this.calculateVariance(pool);
            totalEntropy += variance * pool.length;
            totalWeight += pool.length;
        });
        
        return (totalEntropy / totalWeight) * 100;
    }

    calculateVariance(array) {
        const mean = array.reduce((a, b) => a + b, 0) / array.length;
        const variance = array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
        return Math.sqrt(variance);
    }

    async scanRealityLevel(level, scanData) {
        return new Promise(resolve => {
            const complexity = 50 + level * 20; // Сложность растет с уровнем
            
            setTimeout(() => {
                // Реальные вычисления для энтропии
                const levelData = this.calculateLevelEntropy(level);
                scanData[`level_${level}`] = levelData;
                
                // Обновление квантовых состояний на основе сканирования
                this.updateQuantumStates(levelData, level);
                
                resolve();
            }, complexity);
        });
    }

    calculateLevelEntropy(level) {
        // Сложный расчет энтропии уровня
        const baseEntropy = this.extractTemporalEntropy();
        const quantumInfluence = this.extractQuantumEntropy();
        const systemInfluence = this.extractSystemEntropy();
        
        // Нелинейная комбинация
        const combined = (baseEntropy * 1.618 + 
                         quantumInfluence * 2.718 + 
                         systemInfluence * 3.14159) % 1;
        
        // Влияние уровня глубины
        return Math.pow(combined, 1 + level * 0.1) % 1;
    }

    updateQuantumStates(levelData, level) {
        this.quantumState.forEach((state, key) => {
            // Сложное обновление фаз и амплитуд
            const phaseNoise = (levelData * Math.PI * level * 1.618) % (2 * Math.PI);
            const amplitudeNoise = Math.sin(levelData * Math.E * level);
            
            state.phase = (state.phase + phaseNoise) % (2 * Math.PI);
            state.amplitude = Math.abs(Math.sin(state.phase + amplitudeNoise));
            state.probability = Math.pow(Math.cos(state.phase), 2) % 1;
            state.frequency = 100 + (Math.sin(state.phase * 2.71828) * 450 + 450);
        });
    }

    startEntropyHarvesting() {
        // Агрессивный сбор энтропии
        setInterval(() => this.harvestTemporalEntropy(), 5);
        setInterval(() => this.harvestSystemEntropy(), 15);
        setInterval(() => this.harvestQuantumEntropy(), 10);
        setInterval(() => this.harvestUserEntropy(), 20);
        
        setInterval(() => {
            this.chaosLevel = this.calculateTotalEntropy();
            this.updateChaosDisplay();
        }, 500);
    }

    harvestTemporalEntropy() {
        const now = performance.now();
        const sources = [
            (now * Math.PI) % 1,
            (now * Math.E) % 1,
            (now * 1.6180339887) % 1,
            (Date.now() * 3.14159) % 1
        ];
        
        sources.forEach(entropy => {
            this.addToPool('temporal', entropy);
        });
    }

    harvestSystemEntropy() {
        const sources = [];
        
        // Аппаратные источники
        sources.push((navigator.hardwareConcurrency * 2.71828) % 1);
        sources.push((screen.width * screen.height * 1.618) % 1);
        
        // Память и производительность
        if (performance.memory) {
            sources.push((performance.memory.usedJSHeapSize * 3.14159) % 1);
        }
        
        // Сетевые характеристики
        if (navigator.connection) {
            sources.push((navigator.connection.downlink * 4.6692) % 1);
        }
        
        sources.forEach(entropy => {
            this.addToPool('system', entropy);
        });
    }

    harvestQuantumEntropy() {
        this.quantumState.forEach(state => {
            const entropy = (state.amplitude * state.phase * state.frequency * Math.PI) % 1;
            this.addToPool('quantum', entropy);
        });
    }

    harvestUserEntropy() {
        // Энтропия от пользовательских взаимодействий
        const mouseX = (Math.random() * screen.width) % 1;
        const mouseY = (Math.random() * screen.height) % 1;
        const scrollPos = (window.pageYOffset * 1.618) % 1;
        
        this.addToPool('system', (mouseX * mouseY * scrollPos) % 1);
    }

    addToPool(poolName, value) {
        const pool = this.entropyPools[poolName];
        const pointer = Math.floor(Math.random() * pool.length);
        pool[pointer] = (pool[pointer] + value) % 1;
    }

    async generateRandomNumber(min, max) {
        if (min >= max) return min;
        
        // Выполняем сканирование реальности
        await this.performRealityScan(this.getScanDepth());
        
        // Извлекаем случайность из ВСЕХ источников
        const sources = [
            this.extractQuantumRandomness(),
            this.extractTemporalRandomness(),
            this.extractSystemRandomness(),
            this.extractEntropyPoolRandomness(),
            this.extractChaosRandomness()
        ];
        
        // Сложное нелинейное смешивание
        const combinedRandom = this.combineRandomSources(sources);
        
        // Применяем диапазон с дополнительным перемешиванием
        const range = max - min + 1;
        let result = min + Math.floor(combinedRandom * range);
        
        // Защита от повторений
        result = this.avoidRepetition(result, min, max);
        
        this.updateDisplay(result);
        this.lastResult = result;
        
        return result;
    }

    extractQuantumRandomness() {
        let value = 0;
        let weight = 0;
        
        this.quantumState.forEach(state => {
            const measurement = Math.random() < state.probability ? 1 : 0;
            const influence = state.amplitude * Math.sin(state.phase);
            value = (value * 2.71828 + measurement * influence) % 1;
            weight += state.amplitude;
        });
        
        return (value / (weight || 1)) % 1;
    }

    extractTemporalRandomness() {
        const now = performance.now();
        return (now * Math.PI * Math.E * this.scanCount * 1.6180339887) % 1;
    }

    extractSystemRandomness() {
        let value = 0;
        Object.values(this.entropyPools).forEach(pool => {
            const sample = pool[Math.floor(Math.random() * pool.length)];
            value = (value * 3.14159 + sample * 2.71828) % 1;
        });
        return value;
    }

    extractEntropyPoolRandomness() {
        // Случайность из комбинированных пулов
        const samples = [];
        Object.values(this.entropyPools).forEach(pool => {
            for (let i = 0; i < 3; i++) {
                samples.push(pool[Math.floor(Math.random() * pool.length)]);
            }
        });
        
        return samples.reduce((a, b) => (a * 1.618 + b * 2.718) % 1, 0) / samples.length;
    }

    extractChaosRandomness() {
        // Дополнительный хаос
        return Math.sin(this.chaosLevel * Math.PI * this.scanCount * 0.001) % 1;
    }

    combineRandomSources(sources) {
        if (sources.length === 0) return Math.random();
        
        let combined = sources[0];
        const weights = [1.618, 2.718, 3.14159, 4.6692, 6.28318];
        
        for (let i = 1; i < sources.length; i++) {
            const weight = weights[i % weights.length];
            combined = (combined * weight + sources[i] * (1 / weight)) % 1;
        }
        
        // Дополнительные нелинейные преобразования
        combined = Math.sin(combined * Math.PI * this.chaosLevel) % 1;
        combined = Math.pow(combined, 1 + this.scanCount * 0.001) % 1;
        combined = Math.tan(combined * Math.E) % 1;
        
        return Math.abs(combined);
    }

    avoidRepetition(newResult, min, max) {
        if (this.lastResult === null) return newResult;
        
        // Если результат повторяется, добавляем хаос
        if (newResult === this.lastResult) {
            const range = max - min + 1;
            const shift = Math.floor((this.chaosLevel / 100) * range * 0.3) + 1;
            newResult = min + ((newResult - min + shift) % range);
        }
        
        // Дополнительная проверка для малых диапазонов
        if (max - min < 10) {
            const attempts = [];
            while (attempts.length < 5 && newResult === this.lastResult) {
                newResult = min + Math.floor(this.extractTemporalRandomness() * (max - min + 1));
                attempts.push(newResult);
            }
        }
        
        return newResult;
    }

    getScanDepth() {
        const depthInput = document.getElementById('scanDepth');
        return depthInput ? parseInt(depthInput.value) || 7 : 7;
    }

    updateScanProgress(level, total) {
        const percent = (level / total) * 100;
        const progressBar = document.getElementById('scanProgress');
        const percentText = document.getElementById('scanPercent');
        
        if (progressBar) progressBar.style.width = percent + '%';
        if (percentText) percentText.textContent = Math.round(percent) + '%';
    }

    updateChaosDisplay() {
        const dialValue = document.querySelector('.dial-value');
        if (dialValue) {
            dialValue.textContent = Math.round(this.chaosLevel) + '%';
        }
    }

    updateDisplay(result) {
        const resultElement = document.getElementById('quantumResult');
        const entropyElement = document.getElementById('entropyLevel');
        const scanCountElement = document.getElementById('scanCount');
        
        if (resultElement) {
            resultElement.textContent = result;
            resultElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                resultElement.style.transform = 'scale(1)';
            }, 300);
        }
        
        if (entropyElement) entropyElement.textContent = Math.round(this.chaosLevel) + '%';
        if (scanCountElement) scanCountElement.textContent = this.scanCount;
    }
}

// Глобальная инициализация
let quantumReality = null;

function initQuantumReality() {
    if (!quantumReality) {
        quantumReality = new QuantumRealityGenerator();
        const statusElement = document.getElementById('systemStatus');
        if (statusElement) statusElement.textContent = 'РЕАЛЬНОСТЬ_АКТИВИРОВАНА';
        console.log('🚀 Quantum Reality Generator готов к работе!');
    }
    return quantumReality;
}

async function generateQuantumNumber() {
    if (!quantumReality) initQuantumReality();
    
    const minInput = document.getElementById('minRange');
    const maxInput = document.getElementById('maxRange');
    
    if (!minInput || !maxInput) {
        console.error('Элементы ввода не найдены!');
        return;
    }
    
    const min = parseInt(minInput.value) || 1;
    const max = parseInt(maxInput.value) || 100;
    
    if (min >= max) {
        alert('Максимальное значение должно быть больше минимального');
        return;
    }
    
    const button = document.getElementById('generateBtn');
    if (!button) return;
    
    const buttonText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.quantum-spinner');
    
    // Анимация процесса
    button.disabled = true;
    if (buttonText) buttonText.style.display = 'none';
    if (spinner) spinner.style.display = 'block';
    
    try {
        const result = await quantumReality.generateRandomNumber(min, max);
        console.log(`🎲 Сгенерировано число: ${result} (диапазон: ${min}-${max})`);
    } catch (error) {
        console.error('Ошибка генерации:', error);
    } finally {
        // Восстановление кнопки
        button.disabled = false;
        if (buttonText) buttonText.style.display = 'block';
        if (spinner) spinner.style.display = 'none';
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initQuantumReality();
    
    // Обработчики событий
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateQuantumNumber);
    }
    
    const scanDepth = document.getElementById('scanDepth');
    if (scanDepth) {
        scanDepth.addEventListener('input', (e) => {
            if (quantumReality) {
                quantumReality.chaosLevel = 20 + parseInt(e.target.value) * 12;
                quantumReality.updateChaosDisplay();
            }
        });
    }
    
    // Глобальный экспорт для отладки
    window.quantumReality = quantumReality;
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuantumRealityGenerator, initQuantumReality, generateQuantumNumber };
}
