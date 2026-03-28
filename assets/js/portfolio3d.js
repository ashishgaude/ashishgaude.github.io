class Portfolio3D {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.loader = document.getElementById('loader');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.nodes = [];
        this.connections = [];
        this.planets = []; // Special array for orbit animation
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Vector2();
        this.currentRotation = new THREE.Vector2();
        this.isDragging = false;
        this.lastMousePos = new THREE.Vector2();
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x050505);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 15;
        this.camera.fov = window.innerWidth < 768 ? 85 : 75;
        this.camera.updateProjectionMatrix();

        // Lighting - Warm Golden
        const ambientLight = new THREE.AmbientLight(0xffd700, 0.2);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffd700, 4);
        pointLight.position.set(0, 0, 0); 
        this.scene.add(pointLight);

        this.addStars();
        this.createGalaxy();

        // Events
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
        window.addEventListener('touchstart', (e) => this.onMouseDown(e.touches[0]));
        window.addEventListener('touchmove', (e) => this.onMouseMove(e.touches[0]));
        window.addEventListener('touchend', () => this.onMouseUp());
        window.addEventListener('click', (e) => this.onClick(e));

        if (this.loader) {
            setTimeout(() => {
                this.loader.style.opacity = '0';
                setTimeout(() => this.loader.style.display = 'none', 500);
            }, 1000);
        }

        this.animate();
    }

    addStars() {
        const count = 8000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 300;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
            const val = Math.random();
            // Golden variance
            colors[i * 3] = val; // Red
            colors[i * 3 + 1] = val * 0.8; // Green
            colors[i * 3 + 2] = val * 0.2; // Blue (Minimal)
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.6 });
        this.scene.add(new THREE.Points(geometry, material));
    }

    createGalaxy() {
        // THE SUN (CORE)
        this.createPlanet({
            name: 'profile',
            color: 0xffd700,
            size: 2.5,
            label: 'CORE',
            dist: 0,
            speed: 0
        });

        const sections = [
            { name: 'experience', color: 0xf59e0b, size: 1.0, dist: 7, speed: 0.005, label: 'HISTORY' },
            { name: 'skills', color: 0xd97706, size: 0.8, dist: 11, speed: 0.003, label: 'ABILITIES' },
            { name: 'projects', color: 0xfbbf24, size: 1.2, dist: 15, speed: 0.002, label: 'SOURCE' },
            { name: 'education', color: 0xfcd34d, size: 0.7, dist: 19, speed: 0.0015, label: 'INTEL' }
        ];

        sections.forEach(sec => this.createPlanet(sec));
    }

    createPlanet(config) {
        const pivot = new THREE.Group(); // Pivot for orbit
        this.scene.add(pivot);

        const group = new THREE.Group();
        group.position.x = config.dist;
        pivot.add(group);

        // Planet Mesh
        const geometry = new THREE.IcosahedronGeometry(config.size, 1);
        const material = new THREE.MeshPhongMaterial({
            color: config.color,
            wireframe: true,
            emissive: config.color,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { name: config.name, size: config.size };
        group.add(mesh);

        // Orbit Path Ring
        if (config.dist > 0) {
            const pathGeo = new THREE.TorusGeometry(config.dist, 0.01, 16, 100);
            const pathMat = new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.1 });
            const path = new THREE.Mesh(pathGeo, pathMat);
            path.rotation.x = Math.PI / 2;
            this.scene.add(path);

            // Planetary Ring (Saturn style)
            const ringGeo = new THREE.TorusGeometry(config.size * 1.8, 0.02, 2, 64);
            const ringMat = new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.3, wireframe: true });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2.5;
            group.add(ring);
        }

        this.nodes.push(mesh);
        this.planets.push({ pivot, group, mesh, speed: config.speed, angle: Math.random() * Math.PI * 2 });

        const label = this.createLabel(config.label, config.color);
        label.position.y = config.size + 1.2;
        group.add(label);
    }

    createLabel(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256; canvas.height = 64;
        context.font = 'bold 40px "Inter", sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.fillText(text, 128, 32);
        const texture = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 }));
        sprite.scale.set(3, 0.75, 1);
        return sprite;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.fov = window.innerWidth < 768 ? 85 : 75;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(e) {
        this.isDragging = true;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        this.lastMousePos.set(clientX, clientY);
    }

    onMouseMove(e) {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        if (this.isDragging) {
            this.targetRotation.y += (clientX - this.lastMousePos.x) * 0.005;
            this.targetRotation.x += (clientY - this.lastMousePos.y) * 0.005;
            this.targetRotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, this.targetRotation.x));
            this.lastMousePos.set(clientX, clientY);
        }
    }

    onMouseUp() { this.isDragging = false; }

    onClick(e) {
        if (this.isDragging) return;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);
        if (intersects.length > 0) this.focusNode(intersects[0].object);
    }

    focusNode(node) {
        const targetPos = new THREE.Vector3();
        node.getWorldPosition(targetPos);
        const camTarget = new THREE.Vector3().copy(targetPos).add(new THREE.Vector3(0, 0, 5));
        
        this.isOrbiting = false; // Pause orbits when focused
        gsap.to(this.camera.position, {
            x: camTarget.x, y: camTarget.y, z: camTarget.z,
            duration: 1.5,
            onUpdate: () => this.camera.lookAt(targetPos),
            onComplete: () => window.dispatchEvent(new CustomEvent('nodeFocused', { detail: { name: node.userData.name } }))
        });
    }

    resetCamera() {
        this.isOrbiting = true;
        gsap.to(this.camera.position, {
            x: 0, y: 0, z: 15,
            duration: 1.5,
            onUpdate: () => this.camera.lookAt(0, 0, 0)
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const time = Date.now() * 0.001;

        // Orbit Rotation
        if (this.isOrbiting !== false) {
            this.planets.forEach(p => {
                p.angle += p.speed;
                p.group.position.x = Math.cos(p.angle) * p.group.position.length();
                p.group.position.z = Math.sin(p.angle) * p.group.position.length();
                p.mesh.rotation.y += 0.01;
            });
        }

        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
        this.scene.rotation.y = this.currentRotation.y;
        this.scene.rotation.x = this.currentRotation.x;

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.portfolio3d = new Portfolio3D();
});
