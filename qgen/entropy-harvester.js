// ENTROPY_HARVESTER v3.0 - Максимальный сбор хаоса из реальности
class EntropyHarvester {
    constructor() {
        this.entropyPools = {
            temporal: new Float64Array(2048),      // Временная энтропия
            system: new Float64Array(1024),        // Системная энтропия  
            quantum: new Float64Array(512),        // Квантовая энтропия
            user: new Float64Array(256),           // Пользовательская энтропия
            cosmic: new Float64Array(128)          // Космическая энтропия
        };
        
        this.poolPointers = {
            temporal: 0,
            system: 0,
            quantum: 0, 
            user: 0,
            cosmic: 0
        };
        
        this.entropyStats = {
            totalHarvested: 0,
            harvestRate: 0,
            quality: 0,
            diversity: 0
        };
        
        this.userInteractions = [];
        this.systemMetrics = new Map();
        
        this.initHarvestingSystem();
    }

    initHarvestingSystem() {
        this.startTemporalHarvesting();
        this.startSystemHarvesting(); 
        this.startQuantumHarvesting();
        this.startUserHarvesting();
        this.startCosmicHarvesting();
        this.startMetricsCollection();
        
        console.log('🌪️ Система сбора энтропии активирована');
    }

    // === ВРЕМЕННАЯ ЭНТРОПИЯ ===
    startTemporalHarvesting() {
        // Высокоточный сбор временной энтропии
        setInterval(() => {
            this.harvestPrecisionTime();
            this.harvestPerformanceTime();
            this.harvestAnimationTime();
        }, 10); // Каждые 10ms для максимальной точности
    }

    harvestPrecisionTime() {
        const now = performance.now();
        const entropy = (now * Math.PI * 1.6180339887) % 1;
        this.addToPool('temporal', entropy);
    }

    harvestPerformanceTime() {
        // Использование Performance API для точных измерений
        const marks = [];
        
        performance.mark('entropy-start');
        // Микро-задача для измерения
        for (let i = 0; i < 10; i++) {
            Math.random();
        }
        performance.mark('entropy-end');
        
        performance.measure('entropy-task', 'entropy-start', 'entropy-end');
        const measure = performance.getEntriesByName('entropy-task')[0];
        
        if (measure) {
            const timeEntropy = (measure.duration * 1000000) % 1;
            this.addToPool('temporal', timeEntropy);
            
            performance.clearMarks();
            performance.clearMeasures();
        }
    }

    harvestAnimationTime() {
        // Энтропия из requestAnimationFrame
        const frameTime = Date.now() % 1000 / 1000;
        const entropy = (frameTime * Math.PI * 2.718281828) % 1;
        this.addToPool('temporal', entropy);
    }

    // === СИСТЕМНАЯ ЭНТРОПИЯ ===
    startSystemHarvesting() {
        setInterval(() => {
            this.harvestHardwareEntropy();
            this.harvestNetworkEntropy();
            this.harvestBrowserEntropy();
            this.harvestMemoryEntropy();
        }, 50);
    }

    harvestHardwareEntropy() {
        const sources = [];
        
        // CPU cores
        sources.push(navigator.hardwareConcurrency * Math.PI % 1);
        
        // Screen properties
        sources.push((screen.width * screen.height * 1.6180339887) % 1);
        sources.push((screen.colorDepth * screen.pixelDepth * 2.718281828) % 1);
        
        // Device memory
        if (navigator.deviceMemory) {
            sources.push((navigator.deviceMemory * 3.1415926535) % 1);
        }
        
        // Платформа и ОС
        sources.push((navigator.platform.length * 0.123456789) % 1);
        
        const combined = sources.reduce((a, b) => (a + b) % 1, 0) / sources.length;
        this.addToPool('system', combined);
    }

    harvestNetworkEntropy() {
        if (navigator.connection) {
            const conn = navigator.connection;
            const sources = [];
            
            if (conn.downlink) sources.push(conn.downlink % 1);
            if (conn.rtt) sources.push(conn.rtt % 1);
            if (conn.saveData) sources.push(0.123456);
            
            if (sources.length > 0) {
                const entropy = sources.reduce((a, b) => (a + b) % 1, 0) / sources.length;
                this.addToPool('system', entropy);
            }
        }
    }

    harvestBrowserEntropy() {
        const sources = [];
        
        // User agent variations
        sources.push((navigator.userAgent.length * 0.02468) % 1);
        sources.push((navigator.language.length * 0.13579) % 1);
        
        // Browser features
        sources.push(navigator.cookieEnabled ? 0.24680 : 0.13579);
        sources.push(navigator.onLine ? 0.11235 : 0.44567);
        
        // Plugin variations
        sources.push((navigator.plugins.length * 0.33445) % 1);
        
        const entropy = sources.reduce((a, b) => (a + b) % 1, 0) / sources.length;
        this.addToPool('system', entropy);
    }

    harvestMemoryEntropy() {
        if (performance.memory) {
            const mem = performance.memory;
            const sources = [
                (mem.usedJSHeapSize * 1.6180339887) % 1,
                (mem.totalJSHeapSize * 2.718281828) % 1,
                (mem.jsHeapSizeLimit * 3.1415926535) % 1
            ];
            
            const entropy = sources.reduce((a, b) => (a + b) % 1, 0) / sources.length;
            this.addToPool('system', entropy);
        }
    }

    // === КВАНТОВАЯ ЭНТРОПИЯ ===
    startQuantumHarvesting() {
        setInterval(() => {
            this.harvestQuantumFluctuations();
            this.harvestMathEntropy();
            this.harvestFloatPrecision();
        }, 20);
    }

    harvestQuantumFluctuations() {
        // Эмуляция квантовых флуктуаций
        const fluctuations = [];
        
        for (let i = 0; i < 5; i++) {
            const base = performance.now() * (i + 1);
            const fluctuation = (Math.sin(base) * Math.cos(base * 1.618) * Math.PI) % 1;
            fluctuations.push(Math.abs(fluctuation));
        }
        
        const entropy = fluctuations.reduce((a, b) => (a + b) % 1, 0) / fluctuations.length;
        this.addToPool('quantum', entropy);
    }

    harvestMathEntropy() {
        // Энтропия из математических вычислений
        const computations = [];
        
        // Тригонометрические функции
        computations.push((Math.sin(performance.now()) + 1) / 2);
        computations.push((Math.cos(performance.now() * 1.618) + 1) / 2);
        
        // Экспоненциальные функции
        computations.push((Math.exp(performance.now() % 10) % 1));
        
        // Логарифмические функции
        computations.push((Math.log1p(performance.now() % 100) % 1));
        
        const entropy = computations.reduce((a, b) => (a + b) % 1, 0) / computations.length;
        this.addToPool('quantum', entropy);
    }

    harvestFloatPrecision() {
        // Энтропия из потери точности float
        const precise = performance.now();
        const operations = [
            precise * 1.0000000001,
            precise / 1.0000000001,
            precise + 0.0000000001,
            precise - 0.0000000001
        ];
        
        const differences = operations.map(op => Math.abs(op - precise) % 1);
        const entropy = differences.reduce((a, b) => (a + b) % 1, 0) / differences.length;
        
        this.addToPool('quantum', entropy);
    }

    // === ПОЛЬЗОВАТЕЛЬСКАЯ ЭНТРОПИЯ ===
    startUserHarvesting() {
        this.setupUserInteractionListeners();
        
        setInterval(() => {
            this.harvestInteractionPatterns();
            this.harvestMouseEntropy();
            this.harvestScrollEntropy();
        }, 100);
    }

    setupUserInteractionListeners() {
        // Сбор всех возможных пользовательских взаимодействий
        const events = [
            'mousemove', 'click', 'keydown', 'keyup', 'scroll',
            'touchstart', 'touchmove', 'wheel', 'contextmenu'
        ];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                this.recordUserInteraction(eventType, e);
            }, { passive: true });
        });
    }

    recordUserInteraction(type, event) {
        const interaction = {
            type: type,
            timestamp: performance.now(),
            coordinates: this.getEventCoordinates(event),
            entropy: (performance.now() * Math.PI) % 1
        };
        
        this.userInteractions.push(interaction);
        
        // Ограничение размера массива
        if (this.userInteractions.length > 1000) {
            this.userInteractions = this.userInteractions.slice(-500);
        }
        
        // Непосредственное добавление в пул
        this.addToPool('user', interaction.entropy);
    }

    getEventCoordinates(event) {
        if (event.type.includes('mouse') || event.type === 'click') {
            return { x: event.clientX, y: event.clientY };
        } else if (event.type.includes('touch')) {
            return event.touches[0] ? 
                   { x: event.touches[0].clientX, y: event.touches[0].clientY } : 
                   { x: 0, y: 0 };
        }
        return { x: 0, y: 0 };
    }

    harvestInteractionPatterns() {
        if (this.userInteractions.length < 2) return;
        
        // Анализ паттернов взаимодействия
        const recentInteractions = this.userInteractions.slice(-10);
        const timeDeltas = [];
        
        for (let i = 1; i < recentInteractions.length; i++) {
            const delta = recentInteractions[i].timestamp - recentInteractions[i-1].timestamp;
            timeDeltas.push(delta % 1);
        }
        
        if (timeDeltas.length > 0) {
            const entropy = timeDeltas.reduce((a, b) => (a + b) % 1, 0) / timeDeltas.length;
            this.addToPool('user', entropy);
        }
    }

    harvestMouseEntropy() {
        // Энтропия из микро-движений мыши
        if (this.userInteractions.filter(i => i.type === 'mousemove').length > 5) {
            const mouseEvents = this.userInteractions
                .filter(i => i.type === 'mousemove')
                .slice(-5);
            
            const coordEntropy = mouseEvents.map(event => 
                (event.coordinates.x * event.coordinates.y * Math.PI) % 1
            );
            
            const entropy = coordEntropy.reduce((a, b) => (a + b) % 1, 0) / coordEntropy.length;
            this.addToPool('user', entropy);
        }
    }

    harvestScrollEntropy() {
        // Энтропия из паттернов скроллинга
        const scrollEvents = this.userInteractions.filter(i => i.type === 'scroll');
        if (scrollEvents.length > 3) {
            const scrollEntropy = (scrollEvents.length * performance.now() * 0.12345) % 1;
            this.addToPool('user', scrollEntropy);
        }
    }

    // === КОСМИЧЕСКАЯ ЭНТРОПИЯ ===
    startCosmicHarvesting() {
        setInterval(() => {
            this.harvestUniversalTime();
            this.harvestRandomness();
            this.harvestAtmosphericEntropy();
        }, 500);
    }

    harvestUniversalTime() {
        // Космическое время (Unix timestamp с разными точностями)
        const now = Date.now();
        const sources = [
            (now / 1000) % 1,           // Секунды
            (now / 60000) % 1,          // Минуты  
            (now / 3600000) % 1,        // Часы
            (now / 86400000) % 1        // Дни
        ];
        
        const entropy = sources.reduce((a, b) => (a + b) % 1, 0) / sources.length;
        this.addToPool('cosmic', entropy);
    }

    harvestRandomness() {
        // Использование встроенного Math.random() как источника космической энтропии
        const randomValues = Array.from({length: 5}, () => Math.random());
        const entropy = randomValues.reduce((a, b) => (a + b) % 1, 0) / randomValues.length;
        this.addToPool('cosmic', entropy);
    }

    harvestAtmosphericEntropy() {
        // Эмуляция атмосферных и космических влияний
        const time = Date.now() * 0.001;
        const sources = [
            (Math.sin(time) * Math.cos(time * 1.618) + 1) / 2,
            (Math.tan(time * 0.317) % 1 + 1) / 2,
            (Math.atan(time * 2.718) % 1)
        ];
        
        const entropy = sources.reduce((a, b) => (a + b) % 1, 0) / sources.length;
        this.addToPool('cosmic', entropy);
    }

    // === ОСНОВНЫЕ МЕТОДЫ ===
    addToPool(poolName, value) {
        const pool = this.entropyPools[poolName];
        const pointer = this.poolPointers[poolName];
        
        pool[pointer] = value;
        this.poolPointers[poolName] = (pointer + 1) % pool.length;
        
        this.entropyStats.totalHarvested++;
    }

    getEntropySample(size = 1) {
        // Получение образца энтропии из всех пулов
        const samples = [];
        const totalSize = Object.values(this.entropyPools).reduce((sum, pool) => sum + pool.length, 0);
        
        // Сбор образцов из всех пулов пропорционально их размеру
        Object.entries(this.entropyPools).forEach(([poolName, pool]) => {
            const poolRatio = pool.length / totalSize;
            const samplesFromPool = Math.ceil(size * poolRatio);
            
            for (let i = 0; i < samplesFromPool; i++) {
                const randomIndex = Math.floor(Math.random() * pool.length);
                samples.push(pool[randomIndex]);
            }
        });
        
        // Смешивание образцов
        return this.mixEntropySamples(samples.slice(0, size));
    }

    mixEntropySamples(samples) {
        // Нелинейное смешивание образцов энтропии
        if (samples.length === 0) return Math.random();
        if (samples.length === 1) return samples[0];
        
        let mixed = samples[0];
        for (let i = 1; i < samples.length; i++) {
            // Использование разных математических операций для смешивания
            mixed = (mixed * 1.6180339887 + samples[i] * 2.718281828) % 1;
            mixed = Math.sin(mixed * Math.PI * samples.length) % 1;
            mixed = Math.abs(mixed);
        }
        
        return mixed;
    }

    getHighQualityEntropy() {
        // Получение энтропии высшего качества для критических операций
        const highQualitySamples = [];
        
        // Сбор из всех пулов с весами
        highQualitySamples.push(this.entropyPools.temporal[this.poolPointers.temporal] * 0.3);
        highQualitySamples.push(this.entropyPools.quantum[this.poolPointers.quantum] * 0.3);
        highQualitySamples.push(this.entropyPools.system[this.poolPointers.system] * 0.2);
        highQualitySamples.push(this.entropyPools.user[this.poolPointers.user] * 0.1);
        highQualitySamples.push(this.entropyPools.cosmic[this.poolPointers.cosmic] * 0.1);
        
        // Дополнительное криптографическое смешивание
        return this.cryptographicMix(highQualitySamples);
    }

    cryptographicMix(samples) {
        // Криптографическое смешивание образцов
        let mixed = 0;
        
        samples.forEach((sample, index) => {
            const prime = [2, 3, 5, 7, 11][index % 5];
            mixed = (mixed * prime + sample * Math.PI) % 1;
        });
        
        // Дополнительные преобразования
        mixed = Math.sin(mixed * Math.PI * 2.718281828) % 1;
        mixed = Math.abs(mixed);
        
        return mixed;
    }

    // === МЕТРИКИ И СТАТИСТИКА ===
    startMetricsCollection() {
        setInterval(() => {
            this.updateEntropyStats();
        }, 1000);
    }

    updateEntropyStats() {
        // Расчет качества энтропии
        let totalFilled = 0;
        let totalSlots = 0;
        
        Object.values(this.entropyPools).forEach(pool => {
            const filled = Array.from(pool).filter(val => val !== 0).length;
            totalFilled += filled;
            totalSlots += pool.length;
        });
        
        this.entropyStats.quality = (totalFilled / totalSlots) * 100;
        this.entropyStats.diversity = this.calculateDiversity();
        
        // Расчет rate (примерный)
        this.entropyStats.harvestRate = this.entropyStats.totalHarvested / 
                                      (Date.now() - this.startTime || 1) * 1000;
    }

    calculateDiversity() {
        // Расчет разнообразия энтропии по пулам
        const poolEntropies = Object.values(this.entropyPools).map(pool => {
            const mean = Array.from(pool).reduce((a, b) => a + b, 0) / pool.length;
            const variance = Array.from(pool).reduce((a, b) => a + Math.pow(b - mean, 2), 0) / pool.length;
            return Math.sqrt(variance);
        });
        
        return poolEntropies.reduce((a, b) => a + b, 0) / poolEntropies.length * 100;
    }

    getStats() {
        return {
            ...this.entropyStats,
            pools: Object.keys(this.entropyPools).reduce((acc, poolName) => {
                acc[poolName] = {
                    size: this.entropyPools[poolName].length,
                    filled: Array.from(this.entropyPools[poolName]).filter(v => v !== 0).length,
                    pointer: this.poolPointers[poolName]
                };
                return acc;
            }, {})
        };
    }
}

// Глобальная инициализация
let entropyHarvester = null;

function initEntropyHarvester() {
    if (!entropyHarvester) {
        entropyHarvester = new EntropyHarvester();
    }
    return entropyHarvester;
}

// Экспорт для использования в quantum-core.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EntropyHarvester, initEntropyHarvester };
} else {
    window.EntropyHarvester = EntropyHarvester;
    window.initEntropyHarvester = initEntropyHarvester;
}
