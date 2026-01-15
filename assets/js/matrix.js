class MatrixEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.active = false;
        this.interval = null;
        
        // Configuration
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        this.fontSize = 14;
        this.drops = [];
        
        // Style canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1'; // Behind everything
        this.canvas.style.opacity = '0.3'; // Subtle background
        this.canvas.style.pointerEvents = 'none'; // Don't block clicks
        this.canvas.style.display = 'none';
        
        document.body.appendChild(this.canvas);
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }

    start() {
        if (this.active) return;
        
        this.active = true;
        this.canvas.style.display = 'block';
        this.resize();
        
        // Initialize drops
        const columns = this.canvas.width / this.fontSize;
        this.drops = [];
        for (let i = 0; i < columns; i++) {
            this.drops[i] = 1;
        }

        this.interval = setInterval(() => this.draw(), 33); // ~30fps
    }

    stop() {
        this.active = false;
        this.canvas.style.display = 'none';
        clearInterval(this.interval);
    }

    toggle() {
        if (this.active) {
            this.stop();
            return "Matrix mode deactivated.";
        } else {
            this.start();
            return "Matrix mode activated. Follow the white rabbit...";
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw() {
        // Semi-transparent black to create trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#0F0'; // Green text
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            // Randomly send drop back to top
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }
    }
}
