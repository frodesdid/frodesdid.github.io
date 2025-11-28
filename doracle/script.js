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

// ===== КВАНТОВЫЙ ОРАКУЛ =====
class QuantumOracle {
    constructor() {
        this.responseTemplates = {
            relationships: {
                positive: [
                    "ДА, НО СЛЕДУЙТЕ СЕРДЦУ, А НЕ РАЗУМУ",
                    "СИГНАЛЫ СХОДЯТСЯ - ВСТРЕЧА ИЗМЕНИТ ВСЁ",
                    "КОНЕЧНО, НО БУДЬТЕ ОСТОРОЖНЫ С ВЫБОРОМ",
                    "ДА, И ЭТО ПРЕВЗОЙДЁТ ВАШИ ОЖИДАНИЯ",
                    "ЛЮБОВЬ НАЙДЁТ ВАС, КОГДА ВЫ БУДЕТЕ ГОТОВЫ"
                ],
                cautious: [
                    "НЕТ, НО ЭТО ДАЁТ ВАМ СВОБОДУ",
                    "ЛУЧШЕ СФОКУСИРУЙТЕСЬ НА СЕБЕ СЕЙЧАС",
                    "ВРЕМЯ ЕЩЁ НЕ ПРИШЛО - ЗАЙМИТЕСЬ РАЗВИТИЕМ",
                    "НЕТ, НО ЭТО К ЛУЧШЕМУ",
                    "ОТНОШЕНИЯ ПОДОЖДУТ - ПРИОРИТЕТЫ ИНЫЕ"
                ]
            },
            money: {
                high: [
                    "Я ВИЖУ ЦИФРУ: 120-150 ТЫСЯЧ РУБЛЕЙ",
                    "ВАШИ УСИЛИЯ ПРИНЕСУТ 100+ ТЫСЯЧ",
                    "ФИНАНСОВЫЙ ПОТОК УКАЗЫВАЕТ НА 130К",
                    "ПРОГНОЗ: 110-140 ТЫСЯЧ В МЕСЯЦ"
                ],
                medium: [
                    "ОКОЛО 80-100 ТЫСЯЧ РУБЛЕЙ",
                    "ВИЖУ СТАБИЛЬНЫЕ 90+ ТЫСЯЧ",
                    "ФИНАНСОВАЯ ТРАЕКТОРИЯ: 70-95К"
                ]
            },
            career: {
                success: [
                    "ПРОРЫВ НЕИЗБЕЖЕН - ГОТОВЬТЕСЬ К ВОЗМОЖНОСТЯМ",
                    "КАРЬЕРНЫЙ РОСТ УСКОРИТСЯ В БЛИЖАЙШИЕ МЕСЯЦЫ",
                    "ВАС ЖДЁТ ВАЖНОЕ ПРЕДЛОЖЕНИЕ"
                ],
                change: [
                    "ПЕРЕМЕНЫ НЕИЗБЕЖНЫ - БУДЬТЕ ГОТОВЫ",
                    "ВИЖУ СМЕНУ НАПРАВЛЕНИЯ - ЭТО К ЛУЧШЕМУ"
                ]
            }
        };
    }

    analyzeQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('отношен') || lowerQuestion.includes('любов') || lowerQuestion.includes('встреч')) {
            return 'relationships';
        } else if (lowerQuestion.includes('заработ') || lowerQuestion.includes('деньг') || lowerQuestion.includes('финанс')) {
            return 'money';
        } else if (lowerQuestion.includes('работ') || lowerQuestion.includes('карьер') || lowerQuestion.includes('професс')) {
            return 'career';
        }
        
        return 'general';
    }

    generateResponse(theme, question) {
        if (!this.responseTemplates[theme]) {
            return "СИСТЕМА НЕ МОЖЕТ ПРОАНАЛИЗИРОВАТЬ ВОПРОС. ПЕРЕФОРМУЛИРУЙТЕ.";
        }

        const pools = this.responseTemplates[theme];
        const poolKeys = Object.keys(pools);
        const randomPool = poolKeys[Math.floor(Math.random() * poolKeys.length)];
        const responses = pools[randomPool];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    consult(question) {
        const theme = this.analyzeQuestion(question);
        const response = this.generateResponse(theme, question);
        
        return {
            question: question,
            theme: theme,
            response: response,
            confidence: (0.7 + Math.random() * 0.25).toFixed(3)
        };
    }
}

// Инициализация оракула
window.QuantumOracle = new QuantumOracle();

// Функция для вызова оракула
async function consultOracle() {
    const questionInput = document.getElementById('oracleQuestion');
    const outputDiv = document.getElementById('oracleOutput');
    const button = document.querySelector('.hack-button');
    const buttonText = button.querySelector('.btn-text');
    const scanAnimation = button.querySelector('.scanning-animation');
    
    const question = questionInput.value.trim();
    
    if (!question) {
        showTemporaryMessage('ОРАКУЛ ТРЕБУЕТ ВОПРОС...', 'warning');
        return;
    }

    // Визуализация "процесса анализа"
    buttonText.style.display = 'none';
    scanAnimation.style.display = 'block';
    button.disabled = true;
    
    outputDiv.innerHTML = '<div class="response-placeholder">АНАЛИЗИРУЮ КВАНТОВЫЕ ВЕРОЯТНОСТИ...</div>';

    // Имитация "сложных вычислений"
    await delay(1500 + Math.random() * 1000);

    try {
        const result = window.QuantumOracle.consult(question);
        
        // Показываем результат
        outputDiv.innerHTML = `
            <div class="response-content">
                <div class="question-preview">ВОПРОС: "${question}"</div>
                <div class="oracle-answer">${result.response}</div>
                <div class="confidence">ВЕРОЯТНОСТЬ: ${(result.confidence * 100).toFixed(1)}%</div>
            </div>
        `;
        
        // Обновляем статистику
        updateOracleStats(result.confidence);
        
        // Создаем частицы
        createOracleParticles(5);
        
    } catch (error) {
        outputDiv.innerHTML = '<div class="response-placeholder">ОШИБКА СИСТЕМЫ - КВАНТОВЫЙ ШУМ...</div>';
    }

    // Восстанавливаем кнопку
    buttonText.style.display = 'block';
    scanAnimation.style.display = 'none';
    button.disabled = false;
}

function updateOracleStats(confidence) {
    const accuracyElem = document.getElementById('accuracy');
    const entropyElem = document.getElementById('entropy');
    
    accuracyElem.textContent = (confidence * 100).toFixed(1) + '%';
    
    const entropyLevels = ['НИЗКАЯ', 'СРЕДНЯЯ', 'ВЫСОКАЯ', 'МАКСИМАЛЬНАЯ'];
    entropyElem.textContent = entropyLevels[Math.floor(Math.random() * entropyLevels.length)];
}

function createOracleParticles(count) {
    const oracle = document.querySelector('.cyber-oracle');
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const rect = oracle.getBoundingClientRect();
            
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: #00ffea;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                top: ${rect.top + Math.random() * rect.height}px;
                left: ${rect.left + Math.random() * rect.width}px;
                animation: particleFloat 1.5s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }, i * 200);
    }
}

function showTemporaryMessage(message, type) {
    const tempDiv = document.createElement('div');
    tempDiv.className = `temp-message ${type}`;
    tempDiv.textContent = message;
    tempDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'warning' ? '#ff003c' : '#00ffea'};
        color: #000;
        padding: 10px 20px;
        font-family: 'Orbitron', monospace;
        z-index: 1000;
        border-radius: 4px;
    `;
    
    document.body.appendChild(tempDiv);
    
    setTimeout(() => {
        tempDiv.remove();
    }, 3000);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Инициализация оракула при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const questionInput = document.getElementById('oracleQuestion');
    
    questionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            consultOracle();
        }
    });
    
    console.log('✅ Quantum Oracle загружен и готов к работе');
});
