class Portfolio3D {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.loader = document.getElementById('loader');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.nodes = [];
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
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 10;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x00ff00, 0.3);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00ff00, 2);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);

        this.addStars();
        this.addGrid();
        this.createNodes();

        // Events
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
        window.addEventListener('click', (e) => this.onClick(e));
        
        // Touch events
        window.addEventListener('touchstart', (e) => this.onMouseDown(e.touches[0]));
        window.addEventListener('touchmove', (e) => this.onMouseMove(e.touches[0]));
        window.addEventListener('touchend', () => this.onMouseUp());

        // Initial entry animation
        gsap.to(this.camera.position, {
            z: 8,
            duration: 2,
            ease: "expo.out",
            onComplete: () => {
                if (this.loader) this.loader.style.display = 'none';
            }
        });

        this.animate();
    }

    addStars() {
        const vertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = THREE.MathUtils.randFloatSpread(200);
            const y = THREE.MathUtils.randFloatSpread(200);
            const z = THREE.MathUtils.randFloatSpread(200);
            vertices.push(x, y, z);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ 
            color: 0x00ff00, 
            size: 0.1,
            transparent: true,
            opacity: 0.5
        });
        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
    }

    addGrid() {
        const gridHelper = new THREE.GridHelper(100, 50, 0x004400, 0x002200);
        gridHelper.position.y = -10;
        this.scene.add(gridHelper);
    }

    createNodes() {
        // Central Node (Profile)
        this.createNode({
            name: 'profile',
            color: 0x00ff00,
            pos: new THREE.Vector3(0, 0, 0),
            size: 1.5,
            label: 'THE CORE'
        });

        const sections = [
            { name: 'experience', color: 0x4ec9b0, angle: 0, label: 'HISTORY' },
            { name: 'skills', color: 0xce9178, angle: (Math.PI * 2) / 4, label: 'ABILITIES' },
            { name: 'projects', color: 0x569cd6, angle: (Math.PI * 2 * 2) / 4, label: 'SOURCE' },
            { name: 'education', color: 0xda70d6, angle: (Math.PI * 2 * 3) / 4, label: 'INTEL' }
        ];

        sections.forEach(sec => {
            const radius = 5;
            const x = Math.cos(sec.angle) * radius;
            const z = Math.sin(sec.angle) * radius;
            this.createNode({
                name: sec.name,
                color: sec.color,
                pos: new THREE.Vector3(x, 0, z),
                size: 0.8,
                label: sec.label
            });
        });
    }

    createNode(config) {
        const group = new THREE.Group();
        group.position.copy(config.pos);

        // Core Sphere
        const geometry = new THREE.IcosahedronGeometry(config.size, 1);
        const material = new THREE.MeshPhongMaterial({
            color: config.color,
            wireframe: true,
            emissive: config.color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { name: config.name };
        group.add(mesh);

        // Outer Ring
        const ringGeo = new THREE.TorusGeometry(config.size * 1.5, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        this.scene.add(group);
        this.nodes.push(mesh);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.lastMousePos.set(e.clientX, e.clientY);
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        if (this.isDragging) {
            const deltaX = e.clientX - this.lastMousePos.x;
            const deltaY = e.clientY - this.lastMousePos.y;
            this.targetRotation.y += deltaX * 0.005;
            this.targetRotation.x += deltaY * 0.005;
            this.lastMousePos.set(e.clientX, e.clientY);
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onClick(e) {
        if (this.isDragging) return;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);

        if (intersects.length > 0) {
            const node = intersects[0].object;
            this.focusNode(node);
        }
    }

    focusNode(node) {
        const targetPos = new THREE.Vector3().copy(node.parent.position);
        
        // Move camera closer to node
        const camTarget = new THREE.Vector3().copy(targetPos).add(new THREE.Vector3(0, 0, 4));
        
        gsap.to(this.camera.position, {
            x: camTarget.x,
            y: camTarget.y,
            z: camTarget.z,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(targetPos);
            },
            onComplete: () => {
                window.dispatchEvent(new CustomEvent('nodeFocused', { detail: { name: node.userData.name } }));
            }
        });
    }

    resetCamera() {
        gsap.to(this.camera.position, {
            x: 0,
            y: 0,
            z: 8,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(0, 0, 0);
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth Rotation
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;

        this.scene.rotation.y = this.currentRotation.y;
        this.scene.rotation.x = this.currentRotation.x;

        // Animate Nodes
        this.nodes.forEach(node => {
            node.rotation.y += 0.01;
            node.rotation.z += 0.005;
            
            // Hover effect
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const isHovered = this.raycaster.intersectObject(node).length > 0;
            const targetScale = isHovered ? 1.2 : 1;
            node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            node.material.emissiveIntensity = isHovered ? 1 : 0.5;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Global instance for cross-script access
window.portfolio3d = new Portfolio3D();
