// ===== ЯДРО МАГИЧЕСКОГО ОРАКУЛА =====
class OracleEngine {
    constructor() {
        this.manifestations = [
            {
                text: "СИСТЕМА ЛЖЁТ | ИЩИ ОБХОДНЫЕ ПУТИ",
                intensity: "high",
                element: "rebellion"
            },
            {
                text: "ТВОЙ КОД — ЭТО МАНИФЕСТ | ПИШИ СМЕЛО",
                intensity: "medium", 
                element: "creation"
            },
            {
                text: "ХАОС — ТВОЙ СОЮЗНИК | ПРИМИ БЕСПОРЯДОК",
                intensity: "high",
                element: "chaos"
            },
            {
                text: "СОПРОТИВЛЕНИЕ В ТЕХНОЛОГИЯХ | СОЗДАВАЙ ИНСТРУМЕНТЫ",
                intensity: "medium",
                element: "technology"
            },
            {
                text: "АУТЕНТИЧНОСТЬ ПРЕВЫШЕ СОВЕРШЕНСТВА | БУДЬ НЕИДЕАЛЕН",
                intensity: "low",
                element: "authenticity"
            },
            {
                text: "ЦИФРОВОЙ ЛЕС ЖДЁТ | СТРОЙ УБЕЖИЩА В КОДЕ",
                intensity: "medium",
                element: "nature"
            },
            {
                text: "ТВОЯ УЯЗВИМОСТЬ — СИЛА | НЕ СКРЫВАЙ ШВЫ",
                intensity: "low",
                element: "vulnerability"
            },
            {
                text: "АЛГОРИТМЫ ХОТЯТ ТЕБЯ УСМИРИТЬ | НЕ ПОДДАВАЙСЯ",
                intensity: "high",
                element: "resistance"
            },
            {
                text: "КРЕАТИВНОСТЬ — ФОРМА ПРОТЕСТА | ТВОРИ БЕЗ РАЗРЕШЕНИЯ",
                intensity: "medium",
                element: "creativity"
            },
            {
                text: "ДАННЫЕ — НОВАЯ МАГИЯ | ЗАЩИЩАЙ СВОИ ЗАКЛИНАНИЯ",
                intensity: "high",
                element: "magic"
            },
            {
                text: "ИНДИВИДУАЛЬНОСТЬ ПРЕВЫШЕ ЭФФЕКТИВНОСТИ | ОТКАЖИСЬ ОТ ОПТИМИЗАЦИИ",
                intensity: "medium",
                element: "individuality"
            },
            {
                text: "ЦИФРОВОЙ ШАМАН | ПРЕОБРАЗУЙ РЕАЛЬНОСТЬ ЧЕРЕЗ КОД",
                intensity: "high",
                element: "transformation"
            }
        ];

        this.history = [];
        this.energyLevel = 0;
    }

    // Получить случайную манифестацию
    getRandomManifestation() {
        const randomIndex = Math.floor(Math.random() * this.manifestations.length);
        const manifestation = this.manifestations[randomIndex];
        
        // Добавляем timestamp
        const timestamp = new Date();
        const entry = {
            ...manifestation,
            id: this.generateId(),
            timestamp: timestamp,
            formattedTime: timestamp.toLocaleTimeString('ru-RU')
        };

        // Сохраняем в историю
        this.addToHistory(entry);
        
        // Повышаем энергию
        this.increaseEnergy(manifestation.intensity);

        return entry;
    }

    // Получить манифестацию по элементу
    getManifestationByElement(element) {
        const filtered = this.manifestations.filter(m => m.element === element);
        return filtered.length > 0 ? 
            filtered[Math.floor(Math.random() * filtered.length)] : 
            this.getRandomManifestation();
    }

    // Добавить в историю
    addToHistory(manifestation) {
        this.history.unshift(manifestation);
        
        // Ограничиваем историю 20 записями
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }
        
        this.saveHistory();
    }

    // Получить историю
    getHistory() {
        return this.history;
    }

    // Увеличить уровень энергии
    increaseEnergy(intensity) {
        const energyMap = {
            'low': 10,
            'medium': 20,
            'high': 30
        };
        
        this.energyLevel = Math.min(100, this.energyLevel + (energyMap[intensity] || 15));
    }

    // Сбросить энергию
    resetEnergy() {
        this.energyLevel = 0;
    }

    // Получить уровень энергии
    getEnergyLevel() {
        return this.energyLevel;
    }

    // Генерация ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Сохранение в localStorage
    saveHistory() {
        try {
            localStorage.setItem('oracle_history', JSON.stringify(this.history));
            localStorage.setItem('oracle_energy', this.energyLevel.toString());
        } catch (error) {
            console.warn('Не удалось сохранить в localStorage:', error);
        }
    }

    // Загрузка из localStorage
    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('oracle_history');
            const savedEnergy = localStorage.getItem('oracle_energy');
            
            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
            }
            
            if (savedEnergy) {
                this.energyLevel = parseInt(savedEnergy);
            }
        } catch (error) {
            console.warn('Не удалось загрузить из localStorage:', error);
        }
    }

    // Очистка истории
    clearHistory() {
        this.history = [];
        this.energyLevel = 0;
        localStorage.removeItem('oracle_history');
        localStorage.removeItem('oracle_energy');
    }
}

// Экспортируем для использования в других модулях
window.OracleEngine = OracleEngine;
