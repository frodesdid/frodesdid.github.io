// ritual-effects.js - ПРОСТАЯ ВЕРСИЯ  
console.log('⚡ ritual-effects.js загружен');

class RitualEffects {
    constructor() {
        console.log('🔄 RitualEffects создан');
    }
    
    initialize() {
        console.log('✅ RitualEffects инициализирован');
    }
    
    createActivationEffect(x, y) {
        console.log('🎇 Создаем эффект активации в', x, y);
        // Простой эффект - можно добавить позже
    }
}

window.RitualEffects = RitualEffects;
