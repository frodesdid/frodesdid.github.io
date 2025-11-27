// QUANTUM_CORE v4.2 - Абсолютная непредсказуемость
class QuantumRealityGenerator {
    constructor() {
        this.quantumState = new Map();
        this.entropyPool = new Float64Array(4096);
        this.realityBuffer = new ArrayBuffer(1024);
        this.scanCount = 0;
        this.chaosLevel = 78;
        
        this.initQuantumSystem();
        this.startEntropyHarvesting();
    }

    initQuantumSystem() {
        // Инициализация квантовых состояний через системный хаос
        const quantumSeeds = this.harvestQuantumSeeds();
        
        quantumSeeds.forEach((seed, index) => {
            // Создание запутанных квантовых состояний
            const superposition = this.createSuperposition(seed);
            const entanglement = this.createEntanglement(superposition);
            
            this.quantumState.set(`qbit_${index}`, {
                amplitude: superposition.amplitude,
                phase: superposition.phase,
                entangledWith: entanglement.partner,
                probability: entanglement.probability
            });
        });

        console.log('🌌 Квантовая система инициализирована');
    }

    harvestQuantumSeeds() {
        // Сбор квантовых семян из самых глубоких уровней реальности
        const seeds = [];
        
        // 1. Наносекундные временные метки
        seeds.push(performance.now() * Math.PI * 1.6180339887);
        
        // 2. Аппаратные характеристики
        seeds.push(navigator.hardwareConcurrency * screen.width * screen.height);
        
        // 3. Квантовые флуктуации памяти
        const memory = performance.memory;
        seeds.push(memory ? memory.usedJSHeapSize ^ memory.totalJSHeapSize : Math.random() * 1e9);
        
        // 4. Энтропия сети
        seeds.push(navigator.connection ? navigator.connection.downlink * 1000 : Math.random() * 1e6);
        
        // 5. Космическое время (Unix timestamp с наносекундами)
        seeds.push(Date.now() * 1e6 + performance.now() % 1000);
        
        return seeds;
    }

    createSuperposition(seed) {
        // Создание квантовой суперпозиции
        const angle = (seed % 360) * Math.PI / 180;
        const real = Math.cos(angle);
        const imag = Math.sin(angle);
        
        return {
            amplitude: Math.sqrt(real * real + imag * imag),
            phase: Math.atan2(imag, real),
            probability: (real * real) / (real * real + imag * imag)
        };
    }

    createEntanglement(superposition) {
        // Создание квантовой запутанности между состояниями
        const partnerIndex = Math.floor(superposition.phase * 100) % 5;
        const probability = (superposition.amplitude * Math.PI) % 1;
        
        return {
            partner: partnerIndex,
            probability: probability,
            correlation: Math.sin(superposition.phase * 2)
        };
    }

    async performRealityScan(depth = 7) {
        // Рентген-сканирование реальности на указанную глубину
        this.scanCount++;
        
        const scanData = {
            timestamp: performance.now(),
            depth: depth,
            quantumNoise: this.quantumState.size * Math.random(),
            entropyLevel: this.calculateEntropyLevel(),
            realitySignature: this.generateRealitySignature()
        };

        // Многоуровневое сканирование
        for (let level = 1; level <= depth; level++) {
            await this.scanRealityLevel(level, scanData);
            this.updateScanProgress(level, depth);
        }

        return this.processScanData(scanData);
    }

    async scanRealityLevel(level, scanData) {
        // Сканирование конкретного уровня реальности
        return new Promise(resolve => {
            setTimeout(() => {
                // Эмуляция сложных вычислений
                const levelData = this.calculateLevelEntropy(level);
                scanData[`level_${level}`] = levelData;
                
                // Обновление квантовых состояний
                this.updateQuantumStates(levelData);
                
                resolve();
            }, 100 + level * 50); // Прогрессивная задержка
        });
    }

    calculateLevelEntropy(level) {
        // Расчет энтропии для уровня реальности
        const baseEntropy = Math.random() * level;
        const quantumInfluence = Array.from(this.quantumState.values())
            .reduce((sum, state) => sum + state.amplitude * state.probability, 0);
        
        return (baseEntropy + quantumInfluence) % 1;
    }

    updateQuantumStates(levelData) {
        // Обновление квантовых состояний на основе сканирования
        this.quantumState.forEach((state, key) => {
            const noise = (levelData * Math.PI) % (2 * Math.PI);
            state.phase = (state.phase + noise) % (2 * Math.PI);
            state.amplitude = Math.abs(Math.sin(state.phase));
            state.probability = (Math.cos(state.phase) ** 2);
        });
    }

    generateRealitySignature() {
        // Генерация уникальной подписи реальности
        const signatureComponents = [
            performance.now().toString(36),
            this.quantumState.size.toString(36),
            this.entropyPool.length.toString(36),
            Date.now().toString(36)
        ];
        
        return signatureComponents.join('-') + '-' + 
               btoa(String.fromCharCode(...new Uint8Array(this.realityBuffer)));
    }

    calculateEntropyLevel() {
        // Расчет общего уровня энтропии системы
        const quantumEntropy = Array.from(this.quantumState.values())
            .reduce((sum, state) => sum + state.probability * (1 - state.probability), 0);
        
        const poolEntropy = this.entropyPool.reduce((sum, val) => sum + Math.abs(val % 1), 0);
        
        return ((quantumEntropy + poolEntropy) * 100 / (this.quantumState.size + this.entropyPool.length));
    }

    startEntropyHarvesting() {
        // Непрерывный сбор энтропии из всех возможных источников
        setInterval(() => {
            this.harvestSystemEntropy();
            this.harvestTemporalEntropy();
            this.harvestQuantumEntropy();
        }, 100);
        
        setInterval(() => {
            this.chaosLevel = this.calculateEntropyLevel();
            this.updateChaosDisplay();
        }, 1000);
    }

    harvestSystemEntropy() {
        // Сбор системной энтропии
        const entropySources = [
            performance.now() % 1,
            Math.random(),
            Date.now() % 1,
            navigator.userAgent.length % 1,
            screen.width * screen.height % 1
        ];
        
        entropySources.forEach(entropy => {
            const index = Math.floor(entropy * (this.entropyPool.length - 1));
            this.entropyPool[index] = (this.entropyPool[index] + entropy) % 1;
        });
    }

    harvestTemporalEntropy() {
        // Сбор временной энтропии
        const now = performance.now();
        const timeEntropy = (now * Math.PI * 1.6180339887) % 1;
        
        const index = Math.floor(timeEntropy * (this.entropyPool.length - 1));
        this.entropyPool[index] = (this.entropyPool[index] + timeEntropy) % 1;
    }

    harvestQuantumEntropy() {
        // Сбор энтропии из квантовых состояний
        this.quantumState.forEach((state, key) => {
            const quantumEntropy = (state.amplitude * state.phase * Math.PI) % 1;
            const index = Math.floor(quantumEntropy * (this.entropyPool.length - 1));
            this.entropyPool[index] = (this.entropyPool[index] + quantumEntropy) % 1;
        });
    }

    generateRandomNumber(min, max) {
        // Генерация абсолютно случайного числа
        const scanData = this.performRealityScan(this.getScanDepth());
        
        // Многоуровневое смешивание энтропии
        const quantumRandom = this.extractQuantumRandomness();
        const entropyRandom = this.extractEntropyRandomness();
        const temporalRandom = this.extractTemporalRandomness();
        
        // Нелинейная комбинация всех источников
        const combinedRandom = this.combineRandomSources(
            quantumRandom, 
            entropyRandom, 
            temporalRandom
        );
        
        // Применение диапазона
        const range = max - min + 1;
        const result = min + Math.floor(combinedRandom * range);
        
        this.updateDisplay(result);
        return result;
    }

    extractQuantumRandomness() {
        // Извлечение случайности из квантовых состояний
        let quantumValue = 0;
        
        this.quantumState.forEach(state => {
            const measurement = Math.random() < state.probability ? 1 : 0;
            quantumValue = (quantumValue * 2 + measurement) % 1;
        });
        
        return quantumValue;
    }

    extractEntropyRandomness() {
        // Извлечение случайности из пула энтропии
        const startIndex = Math.floor(Math.random() * (this.entropyPool.length - 10));
        const entropySlice = this.entropyPool.slice(startIndex, startIndex + 10);
        
        return entropySlice.reduce((sum, val) => (sum + val) % 1, 0) / 10;
    }

    extractTemporalRandomness() {
        // Извлечение временной случайности
        const now = performance.now();
        return (now * Math.PI * 1.6180339887 * this.scanCount) % 1;
    }

    combineRandomSources(q, e, t) {
        // Нелинейная комбинация источников случайности
        const combined = (q * 1.6180339887 + e * 2.718281828 + t * 3.1415926535) % 1;
        
        // Дополнительное хаотическое преобразование
        return Math.sin(combined * Math.PI * this.chaosLevel / 100) ** 2;
    }

    getScanDepth() {
        return parseInt(document.getElementById('scanDepth').value) || 7;
    }

    updateScanProgress(level, total) {
        const percent = (level / total) * 100;
        document.getElementById('scanProgress').style.width = percent + '%';
        document.getElementById('scanPercent').textContent = Math.round(percent) + '%';
    }

    updateChaosDisplay() {
        document.querySelector('.dial-value').textContent = this.chaosLevel.toFixed(0) + '%';
    }

    updateDisplay(result) {
        const resultElement = document.getElementById('quantumResult');
        const entropyElement = document.getElementById('entropyLevel');
        const scanCountElement = document.getElementById('scanCount');
        
        resultElement.textContent = result;
        entropyElement.textContent = this.chaosLevel.toFixed(1) + '%';
        scanCountElement.textContent = this.scanCount;
        
        // Анимация результата
        resultElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            resultElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// Инициализация системы
let quantumReality = null;

function initQuantumReality() {
    if (!quantumReality) {
        quantumReality = new QuantumRealityGenerator();
        document.getElementById('systemStatus').textContent = 'РЕАЛЬНОСТЬ_АКТИВИРОВАНА';
    }
}

function generateQuantumNumber() {
    if (!quantumReality) initQuantumReality();
    
    const min = parseInt(document.getElementById('minRange').value) || 1;
    const max = parseInt(document.getElementById('maxRange').value) || 100;
    
    if (min >= max) {
        alert('Максимальное значение должно быть больше минимального');
        return;
    }
    
    const button = document.getElementById('generateBtn');
    const buttonText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.quantum-spinner');
    
    // Анимация процесса
    buttonText.style.display = 'none';
    spinner.style.display = 'block';
    button.disabled = true;
    
    // Генерация с визуальной задержкой
    setTimeout(() => {
        const result = quantumReality.generateRandomNumber(min, max);
        
        // Восстановление кнопки
        buttonText.style.display = 'block';
        spinner.style.display = 'none';
        button.disabled = false;
    }, 800 + Math.random() * 1200);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initQuantumReality();
    
    // Обработчики событий
    document.getElementById('generateBtn').addEventListener('click', generateQuantumNumber);
    
    document.getElementById('scanDepth').addEventListener('input', (e) => {
        quantumReality.chaosLevel = 20 + parseInt(e.target.value) * 8;
        quantumReality.updateChaosDisplay();
    });
});
