// Параллакс эффект
document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('[data-depth]');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    parallaxElements.forEach(element => {
        const depth = parseFloat(element.getAttribute('data-depth'));
        const moveX = mouseX * depth * 100;
        const moveY = mouseY * depth * 100;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Дополнительные эффекты для заголовка
document.addEventListener('DOMContentLoaded', function() {
    const titleContainer = document.querySelector('.title-container');
    const title = document.getElementById('mainTitle');
    
    // Создаем частицы при наведении
    titleContainer.addEventListener('mouseenter', function() {
        createParticles(10);
    });
    
    function createParticles(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${Math.random() > 0.5 ? '#ff003c' : '#0066ff'};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    top: ${title.getBoundingClientRect().top + title.offsetHeight/2}px;
                    left: ${title.getBoundingClientRect().left + Math.random() * title.offsetWidth}px;
                    animation: particleFloat 1s ease-out forwards;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }, i * 100);
        }
    }
    
    console.log('✅ Этап 1 загружен: Акцидентный заголовок');
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
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
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
