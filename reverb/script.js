// Дополнительные эффекты для заголовка
document.addEventListener('DOMContentLoaded', function() {
    const titleContainer = document.querySelector('.title-container');
    const title = document.getElementById('mainTitle');
    const channelsHeader = document.querySelector('.channels-header');
    
    // Создаем частицы при наведении
    titleContainer.addEventListener('mouseenter', function() {
        createParticles(15);
    });
    
    function createParticles(count) {
        const titleRect = title.getBoundingClientRect();
        const headerRect = channelsHeader.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute; /* Меняем fixed на absolute */
                    width: 4px;
                    height: 4px;
                    background: ${Math.random() > 0.5 ? '#ff003c' : '#0066ff'};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    top: ${titleRect.top - headerRect.top + title.offsetHeight/2}px;
                    left: ${titleRect.left - headerRect.left + Math.random() * title.offsetWidth}px;
                    animation: particleFloat 1s ease-out forwards;
                `;
                
                channelsHeader.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }, i * 50); // Уменьшил задержку для более плавного эффекта
        }
    }
    
    // Адаптация к ресайзу окна
    window.addEventListener('resize', function() {
        // Пересчитываем позиции при изменении размера
        titleContainer.style.transform = 'none'; // Сбрасываем любые трансформации
    });
    
    console.log('✅ Акцидентный заголовок загружен');
});

// Добавляем CSS для частиц
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-80px) scale(0);
            opacity: 0;
        }
    }
    
    /* Гарантируем центрирование контейнера */
    .channels-header {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
    }
    
    .title-container {
        text-align: center !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }
    
    .main-title {
        text-align: center !important;
        margin: 0 auto !important;
        display: inline-block !important;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const bpmInput = document.getElementById('bpm');
    const bpmDisplay = document.getElementById('bpmDisplay');
    const roomBtns = document.querySelectorAll('.room-btn');
    const calculateBtn = document.getElementById('calculateBtn');
    const results = document.getElementById('results');
    const preDelayElem = document.getElementById('preDelay');
    const decayTimeElem = document.getElementById('decayTime');
    const totalReverbElem = document.getElementById('totalReverb');
    
    // Текущие значения
    let currentBPM = 128;
    let currentRoomSize = 'small';
    
    // Обновление BPM
    bpmInput.addEventListener('input', function() {
        currentBPM = parseInt(this.value) || 128;
        bpmDisplay.textContent = currentBPM;
    });
    
    // Выбор размера комнаты
    roomBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            roomBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentRoomSize = this.dataset.size;
        });
    });
    
    // Функция расчета с точным округлением и увеличенными коэффициентами
    function calculateReverb() {
        // Коэффициенты для разных размеров комнат (МАКСИМАЛЬНО увеличены для обволакивающего звука)
        const roomCoefficients = {
            small: { pre: 0.25, decay: 5.0 },     // small теперь ощутимо больше
            medium: { pre: 0.5, decay: 10.0 },    // medium - очень обволакивающий
            large: { pre: 0.75, decay: 15.0 }     // large - эпический разлёт
        };
        
        const coeff = roomCoefficients[currentRoomSize];
        const beatLength = 60000 / currentBPM; // Длительность доли в ms
        
        // Расчет значений (теперь с плавающей точкой)
        const preDelayMs = (beatLength / 16) * coeff.pre;
        const decayTimeMs = (beatLength / 4) * coeff.decay;
        const totalReverbMs = preDelayMs + decayTimeMs;
        
        // Форматирование (разные единицы измерения и точность)
        preDelayElem.textContent = `${preDelayMs.toFixed(1)} ms`;      // до десятых, ms
        decayTimeElem.textContent = `${(decayTimeMs / 1000).toFixed(2)} s`; // до сотых, секунды
        totalReverbElem.textContent = `${totalReverbMs.toFixed(2)} ms`;   // до сотых, ms
        
        // Показать результаты (если скрыты)
        results.style.display = 'flex';
    }
    
    // Кнопка расчета
    calculateBtn.addEventListener('click', calculateReverb);
    
    // Рассчитать при загрузке
    calculateReverb();
    
    // Валидация ввода BPM
    bpmInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < 60) value = 60;
        if (value > 240) value = 240;
        this.value = value;
        currentBPM = value;
        bpmDisplay.textContent = value;
        calculateReverb();
    });
});
