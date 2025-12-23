lucide.createIcons();

const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: -1000, y: -1000 };

const PARTICLE_COUNT = 230; 
const CONNECT_DISTANCE = 130;
const ACCENT_COLOR = '#d6a3ff'; 

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2.0; 
        this.vy = (Math.random() - 0.5) * 2.0;
        
        this.radius = Math.random() * 2 + 0.8;
        this.color = Math.random() > 0.3 ? ACCENT_COLOR : '#FFFFFF';
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) {
            const force = (200 - distance) / 200;
            const angle = Math.atan2(dy, dx);
            const pushStrength = 0.8; 
            this.vx -= Math.cos(angle) * force * pushStrength;
            this.vy -= Math.sin(angle) * force * pushStrength;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.995;
        this.vy *= 0.995;
        if (Math.abs(this.vx) < 0.2) this.vx *= 1.05;
        if (Math.abs(this.vy) < 0.2) this.vy *= 1.05;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < CONNECT_DISTANCE) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                
                const mouseDist = Math.sqrt(Math.pow(mouse.x - particles[i].x, 2) + Math.pow(mouse.y - particles[i].y, 2));
                let opacity = (1 - distance / CONNECT_DISTANCE) * 0.2;
                if (mouseDist < 250) {
                    opacity += 0.3; 
                }
                ctx.strokeStyle = `rgba(214, 163, 255, ${opacity})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(20, 20, 20, 0.8)'; 
    ctx.fillRect(0, 0, width, height);
    
    drawConnections();
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
});

init();
animate();