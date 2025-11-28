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

class NeuroOracle {
    constructor() {
        this.responseTemplates = {
            love: [
                "ДА, НО ЛУЧШЕ ПРИСЛУШАТЬСЯ К СЕРДЦУ",
                "НЕТ, НО ЭТО ВОЗМОЖНОСТЬ ДЛЯ РОСТА", 
                "ВИЖУ ВСТРЕЧУ, НО СУДЬБА В ВАШИХ РУКАХ",
                "ОТНОШЕНИЯ БУДУТ, НО НЕ ТАКИЕ, КАК ОЖИДАЕТЕ",
                "СЕРДЦЕ ПОДСКАЖЕТ ПРАВИЛЬНЫЙ ПУТЬ"
            ],
            money: [
                "ВИЖУ СУММУ ОКОЛО {amount} РУБЛЕЙ",
                "ФИНАНСЫ РАСТУТ, ЕСЛИ ДЕЙСТВОВАТЬ СМЕЛО",
                "ДЕНЬГИ ПРИДУТ НЕОЖИДАННЫМ ПУТЁМ",
                "УСПЕХ ЗАВИСИТ ОТ ВАШЕЙ СМЕЛОСТИ",
                "ИНВЕСТИЦИЯ В СЕБЯ ОКУПИТСЯ"
            ],
            career: [
                "ПЕРЕМЕНЫ НА ГОРИЗОНТЕ",
                "НОВАЯ ВОЗМОЖНОСТЬ СКОРО ПОЯВИТСЯ", 
                "УСПЕХ ТРЕБУЕТ РИСКА",
                "ВАШ ТАЛАНТ БУДЕТ ЗАМЕЧЕН",
                "ПУТЬ К ВЕРШИНЕ НАЧИНАЕТСЯ СЕЙЧАС"
            ],
            health: [
                "ЭНЕРГИЯ ВОССТАНАВЛИВАЕТСЯ",
                "ПОЗАБОТЬТЕСЬ О ДУХЕ И ТЕЛО ОТКЛИКНЕТСЯ",
                "ВИЖУ ПРИЛИВ СИЛ В БЛИЖАЙШЕЕ ВРЕМЯ",
                "БАЛАНС - КЛЮЧ К ГАРМОНИИ",
                "ТЕЛО ГОВОРИТ С ВАМИ - СЛУШАЙТЕ ЕГО"
            ],
            general: [
                "ОТВЕТ ПРИДЁТ ИЗНУТРИ",
                "ВРЕМЯ ДЕЙСТВОВАТЬ СМЕЛО",
                "СУДЬБА ЛЮБИТ СМЕЛЫХ",
                "ПУТЬ ПРОЯСНИТСЯ СКОРО",
                "ДОВЕРЬТЕСЬ СВОЕЙ ИНТУИЦИИ"
            ]
        };
        
        this.quantumState = 0;
        this.updateQuantumNoise();
    }

    analyzeQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Определяем категорию вопроса
        if (this.containsWords(lowerQuestion, ['любов', 'отношен', 'брак', 'встреч', 'сердц'])) {
            return this.generateResponse('love', question);
        } else if (this.containsWords(lowerQuestion, ['деньг', 'заработ', 'финанс', 'богат', 'рубл', 'доход'])) {
            return this.generateResponse('money', question);
        } else if (this.containsWords(lowerQuestion, ['работ', 'карьер', 'професс', 'успех', 'бизнес'])) {
            return this.generateResponse('career', question);
        } else if (this.containsWords(lowerQuestion, ['здоров', 'болез', 'энерг', 'сил', 'тело'])) {
            return this.generateResponse('health', question);
        } else {
            return this.generateResponse('general', question);
        }
    }

    containsWords(text, words) {
        return words.some(word => text.includes(word));
    }

    generateResponse(category, question) {
        const templates = this.responseTemplates[category];
        const randomIndex = this.quantumRandom(templates.length);
        let response = templates[randomIndex];

        // Специальная обработка для денежных вопросов
        if (category === 'money' && response.includes('{amount}')) {
            const amount = this.generateRealisticAmount(question);
            response = response.replace('{amount}', amount.toLocaleString());
        }

        // Добавляем "квантовую" вариативность
        if (this.quantumRandom(100) > 70) {
            response = this.addQuantumTwist(response);
        }

        return response;
    }

    generateRealisticAmount(question) {
        // Генерация правдоподобных сумм на основе вопроса
        const amounts = {
            small: [15000, 25000, 35000, 45000, 60000],
            medium: [80000, 120000, 150000, 200000, 250000],
            large: [300000, 500000, 750000, 1000000, 1500000]
        };

        const lowerQuestion = question.toLowerCase();
        
        if (this.containsWords(lowerQuestion, ['много', 'больш', 'миллион'])) {
            return this.quantumChoice(amounts.large);
        } else if (this.containsWords(lowerQuestion, ['мало', 'небольш', 'скромн'])) {
            return this.quantumChoice(amounts.small);
        } else {
            return this.quantumChoice(amounts.medium);
        }
    }

    addQuantumTwist(response) {
        const twists = [
            "\nНО ПОМНИТЕ - БУДУЩЕЕ ИЗМЕНЧИВО",
            "\nЭТО ВСЕГО ЛИШЬ ОДНА ИЗ ВОЗМОЖНОСТЕЙ", 
            "\nВАШ ВЫБОР ИЗМЕНИТ РЕАЛЬНОСТЬ",
            "\nКОСМИЧЕСКИЕ СИЛЫ БЛАГОСКЛОННЫ",
            "\nСУДЬБА ЛЮБИТ СЮРПРИЗЫ"
        ];
        
        return response + twists[this.quantumRandom(twists.length)];
    }

    quantumRandom(max) {
        // "Квантовый" рандом на основе времени и состояния
        this.quantumState = (this.quantumState * 9301 + 49297) % 233280;
        const random = this.quantumState / 233280;
        return Math.floor(random * max);
    }

    quantumChoice(array) {
        return array[this.quantumRandom(array.length)];
    }

    updateQuantumNoise() {
        // Обновление "квантового шума" каждую секунду
        setInterval(() => {
            const noise = (this.quantumRandom(1000) / 10).toFixed(1);
            document.getElementById('quantumNoise').textContent = `${noise}%`;
        }, 1000);
    }
}

// Инициализация оракула
const oracle = new NeuroOracle();

function initiateOracle() {
    const questionInput = document.getElementById('oracleQuestion');
    const output = document.getElementById('oracleOutput');
    const button = document.querySelector('.hack-button');
    const btnText = button.querySelector('.btn-text');
    const scanner = button.querySelector('.scanning-animation');

    const question = questionInput.value.trim();
    
    if (!question) {
        output.innerHTML = '<div class="error-message">ОШИБКА: ЗАПРОС ПУСТ</div>';
        return;
    }

    // Анимация процесса
    btnText.style.display = 'none';
    scanner.style.display = 'block';
    button.disabled = true;
    
    output.innerHTML = '<div class="scanning">АНАЛИЗИРУЮ ЗАПРОС...<br><span class="scan-dots"></span></div>';

    // Имитация "нейро-анализа"
    setTimeout(() => {
        const response = oracle.analyzeQuestion(question);
        
        output.innerHTML = `
            <div class="oracle-response">
                <div class="question">ВОПРОС: "${question.toUpperCase()}"</div>
                <div class="divider">⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
                <div class="answer">${response}</div>
                <div class="quantum-stamp">КВАНТОВАЯ ВЕРОЯТНОСТЬ: ${(Math.random() * 30 + 70).toFixed(1)}%</div>
            </div>
        `;

        // Возвращаем кнопку в нормальное состояние
        btnText.style.display = 'block';
        scanner.style.display = 'none';
        button.disabled = false;
        
    }, 2000 + Math.random() * 2000); // Случайная задержка для "реальности"
}

// Обработка нажатия Enter
document.getElementById('oracleQuestion').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        initiateOracle();
    }
});
