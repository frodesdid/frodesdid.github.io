class QuantumChaosGenerator {
    constructor() {
        this.quantumState = new Map();
        this.chaosBuffer = new Float64Array(256);
        this.entropyPool = [];
        this.generatedCount = 0;
        this.initialized = false;
        this.init();
    }

    async init() {
        await this._quantumBootstrap();
        this._chaoticCalibration();
        this._startEntropyHarvesting();
        this.initialized = true;
        console.log('🔮 Quantum Chaos Generator активирован');
    }

    async _quantumBootstrap() {
        const quantumSeeds = [
            performance.now() * Math.PI,
            navigator.hardwareConcurrency * 137,
            screen.width * screen.height ^ 0xDEADBEEF,
            Date.now() & 0xFFFFFFFF
        ];

        for (let i = 0; i < quantumSeeds.length; i++) {
            const angle = quantumSeeds[i] * Math.PI / 180;
            const real = Math.cos(angle);
            const imag = Math.sin(angle);
            
            this.quantumState.set(`qbit_${i}`, {
                amplitude: Math.sqrt(real**2 + imag**2),
                phase: Math.atan2(imag, real)
            });
        }
        this._createQuantumEntanglement();
    }

    _createQuantumEntanglement() {
        const states = Array.from(this.quantumState.values());
        for (let i = 0; i < states.length - 1; i += 2) {
            const avgPhase = (states[i].phase + states[i + 1].phase) / 2;
            states[i].phase = avgPhase + Math.PI/4;
            states[i + 1].phase = avgPhase - Math.PI/4;
            states[i].entangledWith = i + 1;
            states[i + 1].entangledWith = i;
        }
    }

    _chaoticCalibration() {
        let x = 0.1, y = 0.0, z = 0.0;
        const dt = 0.01;
        const sigma = 10, rho = 28, beta = 8/3;

        for (let i = 0; i < this.chaosBuffer.length; i++) {
            const dx = sigma * (y - x);
            const dy = x * (rho - z) - y;
            const dz = x * y - beta * z;

            x += dx * dt;
            y += dy * dt;
            z += dz * dt;

            this.chaosBuffer[i] = x * y * z;
        }
    }

    _startEntropyHarvesting() {
        const entropySources = [
            () => performance.now() % 1000 / 1000,
            () => (Math.random() * Date.now()) % 1,
            () => {
                const mem = performance.memory;
                return mem ? (mem.usedJSHeapSize % 1000) / 1000 : Math.random();
            }
        ];

        setInterval(() => {
            const freshEntropy = entropySources.map(source => source())
                .reduce((a, b) => a ^ b, Math.random());
            
            this.entropyPool.push(freshEntropy);
            if (this.entropyPool.length > 1000) {
                this.entropyPool = this.entropyPool.slice(-500);
            }
        }, 50);
    }

    _quantumMeasurement() {
        const results = [];
        
        for (const [key, state] of this.quantumState) {
            const prob1 = state.amplitude ** 2;
            const measurement = (Math.random() + this.entropyPool.length / 1000) > prob1 ? 1 : 0;
            results.push(measurement);
            state.amplitude = measurement === 1 ? 
                Math.sqrt(prob1) : Math.sqrt(1 - prob1);
        }

        return results;
    }

    _chaoticTransform(data) {
        let result = 0;
        
        for (let i = 0; i < data.length; i++) {
            const chaosIndex = Math.abs(data[i] * 100) % this.chaosBuffer.length;
            result ^= this.chaosBuffer[chaosIndex] * (i + 1);
            this.chaosBuffer[chaosIndex] = 
                (this.chaosBuffer[chaosIndex] * 1.6180339887) % 1;
        }

        return Math.abs(result) % 1;
    }

    generate() {
        if (!this.initialized) {
            return Math.random();
        }

        try {
            const quantumBits = this._quantumMeasurement();
            const entropyValue = this.entropyPool.length > 0 ? 
                this.entropyPool[Math.floor(Math.random() * this.entropyPool.length)] : 0;
            
            const mixedData = [...quantumBits, entropyValue];
            const chaoticResult = this._chaoticTransform(mixedData);
            
            this._updateQuantumStates(chaoticResult);
            this.generatedCount++;
            
            return chaoticResult;
            
        } catch (error) {
            console.warn('Quantum generator error:', error);
            return Math.random();
        }
    }

    _updateQuantumStates(value) {
        for (const state of this.quantumState.values()) {
            state.phase = (state.phase + value * Math.PI) % (2 * Math.PI);
            state.amplitude = Math.abs(Math.sin(state.phase));
        }
    }

    random() {
        return this.generate();
    }

    randomInt(min, max) {
        return min + Math.floor(this.generate() * (max - min + 1));
    }

    getEntropyLevel() {
        const level = this.entropyPool.length / 10;
        if (level > 80) return 'Максимальная';
        if (level > 60) return 'Очень высокая';
        if (level > 40) return 'Высокая';
        if (level > 20) return 'Средняя';
        return 'Низкая';
    }

    getGeneratedCount() {
        return this.generatedCount;
    }
}

window.QuantumChaos = new QuantumChaosGenerator();
