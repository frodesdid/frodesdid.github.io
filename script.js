/* === ЭФФЕКТ ДВОЙНИКА ПРИ НАВЕДЕНИИ === */
.main-title {
    font-family: 'Black Ops One', 'Orbitron', 'Anton', Impact, sans-serif;
    font-size: clamp(3rem, 11.25vw, 9rem);
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #0a0a0a;
    text-shadow: 
        -3px -3px 0 #ff003c,
        3px 3px 0 #0066ff;
    line-height: 0.9;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    
    background: linear-gradient(45deg, #8B0000, #B22222, #DC143C, #FF0033);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-size: 300% 300%;
    animation: metalShift 6s ease-in-out infinite;
}

/* Псевдоэлемент — второе имя (двойник) */
.main-title::before {
    content: 'THEFRODESDID';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-family: 'Orbitron', 'Black Ops One', 'Anton', Impact, sans-serif;
    font-size: clamp(2.4rem, 9vw, 7.2rem);
    color: transparent;
    text-shadow: 
        -4px -4px 0 #0066ff,
        4px 4px 0 #00ff88,
        0 0 30px rgba(0, 102, 255, 0.5);
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    background: linear-gradient(45deg, #00BFFF, #1E90FF, #0066ff, #0044cc);
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 300% 300%;
    animation: neonShift 4s ease-in-out infinite;
}

/* При наведении — двойник проявляется, оригинал бледнеет */
.title-container:hover .main-title::before {
    opacity: 1;
    transform: scale(1.05) rotate(1deg);
    letter-spacing: 0.08em;
}

.title-container:hover .main-title {
    text-shadow: 
        -2px -2px 0 transparent,
        2px 2px 0 transparent;
    transform: scale(0.95);
}

/* Анимации для градиентов */
@keyframes metalShift {
    0%, 100% { 
        background-position: 0% 50%;
        filter: hue-rotate(0deg);
    }
    50% { 
        background-position: 100% 50%;
        filter: hue-rotate(20deg);
    }
}

@keyframes neonShift {
    0%, 100% { 
        background-position: 0% 50%;
        filter: hue-rotate(0deg);
    }
    50% { 
        background-position: 100% 50%;
        filter: hue-rotate(45deg);
    }
}

/* Свечение вокруг при наведении */
.title-container::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: radial-gradient(circle, transparent 30%, rgba(255, 0, 60, 0.1) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: -1;
}

.title-container:hover::after {
    opacity: 1;
    animation: sparkPulse 2s ease-in-out infinite;
}

@keyframes sparkPulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.6; }
}

/* Теглайн тоже реагирует */
.title-container:hover ~ .tagline {
    color: #ff003c;
    text-shadow: 0 0 10px rgba(255, 0, 60, 0.5);
}
