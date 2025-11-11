// Параллакс эффект для визуальных элементов
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

// Эффекты для кнопок
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.spike-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.backgroundPosition = '0% 0%';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundPosition = '100% 100%';
        });
    });
    
    // Эффекты для проектов в арсенале
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
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

// Particle system for interactive project
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            this.alpha -= 0.002;
            if (this.alpha <= 0) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }

    createParticles();
    animateParticles();
}

// Activate particle system
function activateParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Create explosion effect
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const x = canvas.width / 2;
            const y = canvas.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 5;
            
            ctx.fillStyle = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(
                x + Math.cos(angle) * speed,
                y + Math.sin(angle) * speed,
                Math.random() * 3 + 1,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }, i * 20);
    }
}

// Initialize particles when page loads
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    
    // Add click effects to arsenal items
    const arsenalItems = document.querySelectorAll('.arsenal-item');
    
    arsenalItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
});
