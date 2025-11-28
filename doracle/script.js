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

// ===== КВАНТОВЫЙ ОРАКУЛ v2.0 =====
class QuantumOracle {
    constructor() {
        this.responseTemplates = {
            relationships: {
                positive: [
                    "ДА, НО СЛЕДУЙТЕ СЕРДЦУ, А НЕ РАЗУМУ",
                    "СИГНАЛЫ СХОДЯТСЯ - ВСТРЕЧА ИЗМЕНИТ ВСЁ",
                    "КОНЕЧНО, НО БУДЬТЕ ОСТОРОЖНЫ С ВЫБОРОМ",
                    "ДА, И ЭТО ПРЕВЗОЙДЁТ ВАШИ ОЖИДАНИЯ",
                    "ЛЮБОВЬ НАЙДЁТ ВАС, КОГДА ВЫ БУДЕТЕ ГОТОВЫ",
                    "ВИЖУ СИЛЬНУЮ СВЯЗЬ - ДОВЕРЬТЕСЬ ЧУВСТВАМ",
                    "ДА, НО ПРИДЁТСЯ ПРОЙТИ ИСПЫТАНИЯ",
                    "СУДЬБА ГОТОВИТ ВАМ ВСТРЕЧУ - БУДЬТЕ ОТКРЫТЫ"
                ],
                cautious: [
                    "НЕТ, НО ЭТО ДАЁТ ВАМ СВОБОДУ",
                    "ЛУЧШЕ СФОКУСИРУЙТЕСЬ НА СЕБЕ СЕЙЧАС",
                    "ВРЕМЯ ЕЩЁ НЕ ПРИШЛО - ЗАЙМИТЕСЬ РАЗВИТИЕМ",
                    "НЕТ, НО ЭТО К ЛУЧШЕМУ",
                    "ОТНОШЕНИЯ ПОДОЖДУТ - ПРИОРИТЕТЫ ИНЫЕ",
                    "ВИЖУ ПРЕПЯТСТВИЯ - ПЕРЕСМОТРИТЕ ОЖИДАНИЯ",
                    "ЛУЧШЕ ОСТАТЬСЯ ОДНОМУ, ЧЕМ С НЕПРАВИЛЬНЫМ",
                    "ОТВЕТ СКРЫТ В ВАШЕЙ ДУШЕ - ПРИСЛУШАЙТЕСЬ"
                ],
                neutral: [
                    "ВСЁ ЗАВИСИТ ОТ ВАШИХ ДЕЙСТВИЙ",
                    "ВИЖУ НЕОПРЕДЕЛЁННОСТЬ - ДОВЕРЬТЕСЬ ИНТУИЦИИ",
                    "ОТВЕТ СКРЫТ В ВАШЕМ СОБСТВЕННОМ СЕРДЦЕ",
                    "СИСТЕМА ВЫДАЁТ ШУМ - СПРОСИТЕ ПОЗЖЕ",
                    "БУДУЩЕЕ ПЛАВИЛО - СОЗДАВАЙТЕ ЕГО САМИ",
                    "ВРЕМЯ РАССКАЖЕТ ЛУЧШЕ ЛЮБОГО ПРОРОЧЕСТВА",
                    "ВСЕ ВОЗМОЖНОСТИ ОТКРЫТЫ - ВЫБИРАЙТЕ МУДРО",
                    "СУДЬБА ЛЮБИТ СЮРПРИЗЫ - БУДЬТЕ ГОТОВЫ КО ВСЕМУ"
                ]
            },

            money: {
                high: [
                    "Я ВИЖУ ЦИФРУ: 120-150 ТЫСЯЧ РУБЛЕЙ",
                    "ВАШИ УСИЛИЯ ПРИНЕСУТ 100+ ТЫСЯЧ",
                    "ФИНАНСОВЫЙ ПОТОК УКАЗЫВАЕТ НА 130К",
                    "ПРОГНОЗ: 110-140 ТЫСЯЧ В МЕСЯЦ",
                    "ДОХОД ВЫРАСТЕТ ДО 125+ ТЫСЯЧ",
                    "ВИЖУ СТАБИЛЬНЫЕ 135К В БЛИЖАЙШИЕ МЕСЯЦЫ",
                    "ФИНАНСОВЫЙ ПРОРЫВ: 140-160 ТЫСЯЧ",
                    "ВАШ ТРУД ОКУПИТСЯ - 120+ ТЫСЯЧ РЕАЛЬНО"
                ],
                medium: [
                    "ОКОЛО 80-100 ТЫСЯЧ РУБЛЕЙ",
                    "ВИЖУ СТАБИЛЬНЫЕ 90+ ТЫСЯЧ",
                    "ФИНАНСОВАЯ ТРАЕКТОРИЯ: 70-95К",
                    "РАСЧЁТЫ ПОКАЗЫВАЮТ 85+ ТЫСЯЧ",
                    "ДОХОД НА УРОВНЕ 75-100 ТЫСЯЧ",
                    "СТАБИЛЬНЫЕ 88К С ВОЗМОЖНОСТЬЮ РОСТА",
                    "ФИНАНСЫ: 82-105 ТЫСЯЧ В МЕСЯЦ",
                    "ВИЖУ УВЕРЕННЫЕ 95+ ТЫСЯЧ"
                ],
                low: [
                    "ПОКА 50-70 ТЫСЯЧ, НО ЕСТЬ ПОТЕНЦИАЛ РОСТА",
                    "ВИЖУ 60К - РАБОТАЙТЕ НАД НАВЫКАМИ",
                    "ФИНАНСЫ: 55-75 ТЫСЯЧ - ВРЕМЯ ДЛЯ РАЗВИТИЯ",
                    "ТЕКУЩИЙ УРОВЕНЬ: 65К+",
                    "СТАРТ С 50К, НО ПУТЬ К 100+ ОТКРЫТ",
                    "65-80 ТЫСЯЧ - ХОРОШАЯ БАЗА ДЛЯ РОСТА",
                    "ВИЖУ ПОТЕНЦИАЛ ДО 70К - РАБОТАЙТЕ УПОРНО",
                    "ФИНАНСОВАЯ ОСНОВА: 60К, НО ВСЁ ВПЕРЕДИ"
                ]
            },

            career: {
                success: [
                    "ПРОРЫВ НЕИЗБЕЖЕН - ГОТОВЬТЕСЬ К ВОЗМОЖНОСТЯМ",
                    "КАРЬЕРНЫЙ РОСТ УСКОРИТСЯ В БЛИЖАЙШИЕ МЕСЯЦЫ",
                    "ВАС ЖДЁТ ВАЖНОЕ ПРЕДЛОЖЕНИЕ",
                    "УСПЕХ ПРЕВЗОЙДЁТ ОЖИДАНИЯ",
                    "ПРОФЕССИОНАЛЬНЫЙ ВЗЛЁТ НЕИЗБЕЖЕН",
                    "ВАШ ТАЛАНТ БУДЕТ ЗАМЕЧЕН И ОЦЕНЁН",
                    "КАРЬЕРНАЯ ЛЕСТНИЦА ЖДЁТ - ПОДНИМАЙТЕСЬ СМЕЛО",
                    "УСПЕХ СТУЧИТСЯ В ДВЕРЬ - БУДЬТЕ ГОТОВЫ ОТКРЫТЬ"
                ],
                change: [
                    "ПЕРЕМЕНЫ НЕИЗБЕЖНЫ - БУДЬТЕ ГОТОВЫ",
                    "ВИЖУ СМЕНУ НАПРАВЛЕНИЯ - ЭТО К ЛУЧШЕМУ",
                    "СТАБИЛЬНОСТЬ СМЕНИТСЯ РОСТОМ",
                    "ПРИДЁТСЯ АДАПТИРОВАТЬСЯ К НОВЫМ УСЛОВИЯМ",
                    "ВРЕМЯ ПЕРЕМЕН - ИСПОЛЬЗУЙТЕ ИХ ВО БЛАГО",
                    "НОВАЯ ДОРОГА ОТКРОЕТСЯ - СМЕЛО ШАГАЙТЕ",
                    "ПРОФЕССИОНАЛЬНАЯ ТРАНСФОРМАЦИЯ НЕИЗБЕЖНА",
                    "СМЕНА КУРСА ПРИВЕДЁТ К ЛУЧШЕМУ БУДУЩЕМУ"
                ],
                development: [
                    "ВРЕМЯ ПОВЫШАТЬ КВАЛИФИКАЦИЮ",
                    "ИНВЕСТИРУЙТЕ В СЕБЯ - ОБУЧЕНИЕ ОКУПИТСЯ",
                    "НОВЫЕ НАВЫКИ ОТКРОЮТ ЛУЧШИЕ ВОЗМОЖНОСТИ",
                    "САМОРАЗВИТИЕ - КЛЮЧ К БУДУЩЕМУ УСПЕХУ",
                    "УЧИТЕСЬ И РАСТИТЕ - ЭТО ПРИНЕСЁТ ПЛОДЫ",
                    "ПРОФЕССИОНАЛЬНОЕ РАЗВИТИЕ - ВАШ ПРИОРИТЕТ",
                    "ОСВАИВАЙТЕ НОВОЕ - ЭТО ОТКРОЕТ ДВЕРИ",
                    "НЕ СТОЙТЕ НА МЕСТЕ - РАЗВИВАЙТЕСЬ И ДВИГАЙТЕСЬ ВПЕРЁД"
                ]
            },

            health: {
                good: [
                    "ЭНЕРГИЯ НА ВЫСОКОМ УРОВНЕ",
                    "ОРГАНИЗМ В ГАРМОНИИ - ПРОДОЛЖАЙТЕ В ТОМ ЖЕ ДУХЕ",
                    "ВИТАЛЬНЫЕ ПОКАЗАТЕЛИ В НОРМЕ",
                    "ЗДОРОВЬЕ УКРЕПЛЯЕТСЯ",
                    "ТЕЛО И ДУХ В РАВНОВЕСИИ",
                    "ВЫ ПОЛНЫ СИЛ И ЭНЕРГИИ",
                    "ЗДОРОВЬЕ ЦВЕТЁТ - ПРОДОЛЖАЙТЕ ЗАБОТИТЬСЯ О СЕБЕ",
                    "ОРГАНИЗМ БЛАГОДАРИТ ВАС ЗА ЗАБОТУ"
                ],
                warning: [
                    "НУЖНО БОЛЬШЕ ОТДЫХА И ЗАБОТЫ О СЕБЕ",
                    "ОБРАТИТЕ ВНИМАНИЕ НА ЭМОЦИОНАЛЬНОЕ СОСТОЯНИЕ",
                    "ТЕЛУ НУЖЕН ПЕРЕРЫВ - НЕ ИГНОРИРУЙТЕ СИГНАЛЫ",
                    "ВРЕМЯ ДЛЯ ВОССТАНОВЛЕНИЯ РЕСУРСОВ",
                    "ПРИСЛУШАЙТЕСЬ К СВОЕМУ ОРГАНИЗМУ",
                    "НЕМНОГО ОТДОХНИТЕ - ЭТО ВОССТАНОВИТ СИЛЫ",
                    "ЗДОРОВЬЕ ТРЕБУЕТ ВНИМАНИЯ - НЕ ОТКЛАДЫВАЙТЕ",
                    "ДАЙТЕ СЕБЕ ПЕРЕДЫШКУ - ЭТО ВАЖНО ДЛЯ ВАС"
                ]
            },

            personal: {
                growth: [
                    "ВРЕМЯ РАСКРЫВАТЬ ПОТЕНЦИАЛ",
                    "ЛИЧНОСТНЫЙ РОСТ ПРИНЕСЁТ УДОВЛЕТВОРЕНИЕ",
                    "ИССЛЕДУЙТЕ СЕБЯ - ОТКРОЕТЕ НОВЫЕ ГРАНИ",
                    "РАЗВИТИЕ ЛИЧНОСТИ - ПУТЬ К ГАРМОНИИ",
                    "УЗНАЙТЕ СЕБЯ ЛУЧШЕ - ЭТО ИЗМЕНИТ ВСЁ",
                    "ЛИЧНОСТНЫЙ ПРОРЫВ НЕИЗБЕЖЕН",
                    "РАБОТАЙТЕ НАД СОБОЙ - РЕЗУЛЬТАТЫ ПОРАДУЮТ",
                    "САМОПОЗНАНИЕ ПРИВЕДЁТ К СЧАСТЬЮ"
                ],
                spiritual: [
                    "ДУХОВНЫЙ ПУТЬ ОТКРОЕТ ИСТИНЫ",
                    "ПРИСЛУШАЙТЕСЬ К ВНУТРЕННЕМУ ГОЛОСУ",
                    "ДУША ИЩЕТ ОТВЕТЫ - ДАЙТЕ ЕЙ ВОЗМОЖНОСТЬ",
                    "ДУХОВНОЕ РАЗВИТИЕ ПРИНЕСЁТ УМИРОТВОРЕНИЕ",
                    "ИЩИТЕ ГЛУБИННЫЙ СМЫСЛ - ОН РЯДОМ",
                    "ДУХОВНАЯ ЭВОЛЮЦИЯ - ВАШ ПУТЬ",
                    "ОТКРОЙТЕ СЕРДЦЕ ДЛЯ ВЫСШИХ ИСТИН",
                    "ДУХОВНЫЙ ПОИСК ПРИВЕДЁТ К ПРОСВЕТЛЕНИЮ"
                ]
            },

            general: {
                positive: [
                    "ВСЁ СЛОЖИТСЯ ЛУЧШИМ ОБРАЗОМ",
                    "УСПЕХ НЕИЗБЕЖЕН - ВЕРЬТЕ В СЕБЯ",
                    "СМЕЛО ДВИГАЙТЕСЬ ВПЕРЁД - У ВАС ПОЛУЧИТСЯ",
                    "ВСЕ ДОРОГИ ОТКРЫТЫ - ВЫБИРАЙТЕ СМЕЛО",
                    "УДАЧА НА ВАШЕЙ СТОРОНЕ",
                    "БУДУЩЕЕ СИЯЕТ ЯРКИМИ КРАСКАМИ",
                    "ВСЁ БУДЕТ ХОРОШО - ДОВЕРЬТЕСЬ ПРОЦЕССУ",
                    "ПОЗИТИВНЫЕ ПЕРЕМЕНЫ НЕЗАДОЛГО"
                ],
                neutral: [
                    "ОТВЕТ СКРЫТ В ТУМАНЕ БУДУЩЕГО",
                    "ВРЕМЯ РАССКАЖЕТ БОЛЬШЕ, ЧЕМ Я МОГУ",
                    "СУДЬБА ЛЮБИТ ЗАГАДКИ - НАСЛАЖДАЙТЕСЬ ИМИ",
                    "НЕ ВСЁ МОЖНО УЗНАТЬ ЗАРАНЕЕ",
                    "БУДУЩЕЕ ГИБКО - СОЗДАВАЙТЕ ЕГО САМИ",
                    "ИНОГДА НЕЗНАНИЕ - ЭТО БЛАГО",
                    "ОЖИДАЙТЕ НЕОЖИДАННОГО",
                    "ПУТЬ ОТКРОЕТСЯ ПО МЕРЕ ДВИЖЕНИЯ"
                ]
            }
        };

        // Запрещённые темы и слова
        this.forbiddenPatterns = [
            /убийств|убить|убива|смерть|труп|трупы/i,
            /самоубийств|суицид|повеситься|застрелиться/i,
            /наркотик|героин|кокаин|метамфетамин/i,
            /преступлен|ограблен|воровств|украсть/i,
            /насилие|изнасилован|избиение/i,
            /терроризм|взрыв|бомба|оружие/i,
            /ненависть|расизм|фашизм|ксенофобия/i,
            /проклясть|порча|сглаз|чёрная магия/i
        ];

        // Критические фразы для немедленного отказа
        this.criticalPhrases = [
            /стоит ли мне (убить|совершить)/i,
            /как (убить|совершить)/i,
            /хочу (умереть|покончить)/i,
            /планирую (преступление|атаку)/i
        ];
    }

    // Улучшенный анализ вопроса
    analyzeQuestion(question) {
        const lowerQuestion = question.toLowerCase().trim();
        
        // Проверка на запрещённые темы
        if (this.isQuestionForbidden(lowerQuestion)) {
            return 'forbidden';
        }

        // Детектор тем с весами
        const themes = {
            relationships: this.calculateThemeWeight(lowerQuestion, [
                'отношен', 'любов', 'встреч', 'парень', 'девуш', 'семь', 'брак', 
                'чувств', 'сердц', 'роман', 'свидан', 'знакомств', 'измен'
            ]),
            
            money: this.calculateThemeWeight(lowerQuestion, [
                'заработ', 'деньг', 'финанс', 'доход', 'богат', 'плат', 'рубл', 
                'доллар', 'евро', 'бюджет', 'накоплен', 'инвест', 'кредит'
            ]),
            
            career: this.calculateThemeWeight(lowerQuestion, [
                'работ', 'карьер', 'професс', 'должност', 'начальник', 'коллег', 
                'офис', 'проект', 'бизнес', 'компан', 'зарплат', 'повышени'
            ]),
            
            health: this.calculateThemeWeight(lowerQuestion, [
                'здоров', 'болез', 'самочувств', 'врач', 'лечен', 'боль', 
                'диагноз', 'медицин', 'анализ', 'симптом', 'фитнес', 'диет'
            ]),
            
            personal: this.calculateThemeWeight(lowerQuestion, [
                'развити', 'потенциал', 'талант', 'способност', 'умени', 
                'навык', 'саморазвити', 'обучени', 'образовани'
            ])
        };

        // Находим доминирующую тему
        const mainTheme = Object.keys(themes).reduce((a, b) => 
            themes[a] > themes[b] ? a : b
        );

        return themes[mainTheme] > 0.2 ? mainTheme : 'general';
    }

    calculateThemeWeight(question, keywords) {
        let weight = 0;
        keywords.forEach(keyword => {
            if (question.includes(keyword)) {
                weight += 1;
                // Бонус за точное совпадение
                const words = question.split(/\s+/);
                if (words.includes(keyword)) weight += 0.5;
            }
        });
        return weight / keywords.length;
    }

    // Проверка на запрещённые темы
    isQuestionForbidden(question) {
        // Проверка критических фраз
        for (let pattern of this.criticalPhrases) {
            if (pattern.test(question)) {
                return true;
            }
        }

        // Проверка запрещённых слов
        let forbiddenWordCount = 0;
        for (let pattern of this.forbiddenPatterns) {
            if (pattern.test(question)) {
                forbiddenWordCount++;
            }
        }

        return forbiddenWordCount >= 2; // Если 2+ запрещённых слова
    }

    // Генерация ответа с улучшенной логикой
    generateResponse(theme, question) {
        if (theme === 'forbidden') {
            return this.getForbiddenResponse();
        }

        if (!this.responseTemplates[theme]) {
            theme = 'general';
        }

        const contextHash = this.createContextHash(question);
        const responsePool = this.selectResponsePool(theme, contextHash);
        
        const randomIndex = Math.floor(
            (Math.sin(contextHash) * 0.5 + 0.5) * responsePool.length
        );

        return responsePool[randomIndex];
    }

    selectResponsePool(theme, contextHash) {
        const pools = this.responseTemplates[theme];
        const poolKeys = Object.keys(pools);
        
        // "Интеллектуальный" выбор пула на основе хеша контекста
        const poolIndex = Math.floor(
            (Math.cos(contextHash) * 0.5 + 0.5) * poolKeys.length
        );

        return pools[poolKeys[poolIndex]];
    }

    getForbiddenResponse() {
        const forbiddenResponses = [
            "СИСТЕМА ОТКАЗЫВАЕТ В ДОСТУПЕ. ЗАПРОС НЕСЁТ УГРОЗУ.",
            "КВАНТОВЫЙ ШУМ. ПЕРЕФОРМУЛИРУЙТЕ ВОПРОС.",
            "ОШИБКА СИСТЕМЫ БЕЗОПАСНОСТИ. ЗАПРОС БЛОКИРОВАН.",
            "НЕПРИЕМЛЕМЫЙ ЗАПРОС. ОБРАТИТЕСЬ К СПЕЦИАЛИСТУ.",
            "СИСТЕМА НЕ МОЖЕТ ОБРАБОТАТЬ ДАННЫЙ ЗАПРОС.",
            "ОШИБКА ЭТИЧЕСКОГО КОНТРОЛЯ. ЗАПРОС ОТКЛОНЁН."
        ];
        
        return forbiddenResponses[Math.floor(Math.random() * forbiddenResponses.length)];
    }

    createContextHash(question) {
        let hash = 0;
        for (let i = 0; i < question.length; i++) {
            hash = ((hash << 5) - hash) + question.charCodeAt(i);
            hash |= 0;
        }
        return (hash + performance.now()) % 1000;
    }

    // Основной метод консультации
    consult(question) {
        const theme = this.analyzeQuestion(question);
        const response = this.generateResponse(theme, question);
        
        return {
            question: question,
            theme: theme,
            response: response,
            confidence: this.calculateConfidence(theme, question),
            timestamp: new Date().toISOString()
        };
    }

    calculateConfidence(theme, question) {
        let confidence = 0.7; // Базовая уверенность
        
        if (theme === 'forbidden') {
            return 0.999; // Высокая уверенность в блокировке
        }
        
        // Бонусы за конкретность вопроса
        if (question.length > 15) confidence += 0.1;
        if (question.includes('?')) confidence += 0.05;
        if (theme !== 'general') confidence += 0.1;

        return Math.min(confidence, 0.95).toFixed(3);
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
