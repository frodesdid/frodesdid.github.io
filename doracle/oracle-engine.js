// oracle-engine.js - ПРОСТАЯ ВЕРСИЯ
console.log('🧠 oracle-engine.js загружен');

class OracleEngine {
    constructor() {
        console.log('🔄 OracleEngine создан');
        this.manifestations = [
            "СИСТЕМА ЛЖЁТ | ИЩИ ОБХОДНЫЕ ПУТИ",
            "ТВОЙ КОД — ЭТО МАНИФЕСТ | ПИШИ СМЕЛО",
            "ХАОС — ТВОЙ СОЮЗНИК | ПРИМИ БЕСПОРЯДОК"
        ];
    }
    
    getRandomManifestation() {
        const text = this.manifestations[Math.floor(Math.random() * this.manifestations.length)];
        return {
            text: text,
            timestamp: new Date()
        };
    }
}

window.OracleEngine = OracleEngine;
