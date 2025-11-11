// Параллакс эффект для элементов
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

// Интерактив для проектов в арсенале
document.addEventListener('DOMContentLoaded', () => {
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Случайный эффект для каждого элемента
            const effects = [
                { transform: 'rotate(1deg) scale(1.05)', borderColor: '#ff003c' },
                { transform: 'skew(-2deg) scale(1.03)', borderColor: '#0066ff' },
                { transform: 'rotate(-1deg) scale(1.04)', borderColor: '#00ff88' }
            ];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            
            Object.assign(item.style, randomEffect);
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'none';
            item.style.borderColor = '#222';
        });
    });
});
