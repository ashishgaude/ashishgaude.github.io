document.addEventListener('DOMContentLoaded', () => {
    const hud = document.getElementById('hud');
    const hudBody = document.getElementById('hud-body');
    const closeHud = document.getElementById('close-hud');
    const loader = document.getElementById('loader');
    const quickNav = document.getElementById('quick-nav');
    const radarNodes = document.getElementById('radar-nodes');

    // Handle Quick Nav Clicks
    quickNav.addEventListener('click', (e) => {
        const item = e.target.closest('.nav-item');
        if (item) {
            const section = item.dataset.section;
            if (window.portfolio3d) {
                window.portfolio3d.focusSectionByName(section);
                highlightNav(section);
            }
        }
    });

    function highlightNav(name) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === name);
        });
    }

    // Radar Logic
    function updateRadar() {
        if (window.portfolio3d && window.portfolio3d.nodes) {
            radarNodes.innerHTML = '';
            window.portfolio3d.nodes.forEach(node => {
                const pos = new THREE.Vector3();
                node.getWorldPosition(pos);
                // Range mapping for galaxy scale
                const x = (pos.x / 25) * 50 + 50;
                const z = (pos.z / 25) * 50 + 50;
                const dot = document.createElement('div');
                dot.className = 'radar-dot';
                dot.style.left = `${x}%`;
                dot.style.top = `${z}%`;
                radarNodes.appendChild(dot);
            });

            const camPos = window.portfolio3d.camera.position;
            const camX = (camPos.x / 25) * 50 + 50;
            const camZ = (camPos.z / 25) * 50 + 50;
            const selfDot = document.createElement('div');
            selfDot.className = 'radar-dot self';
            selfDot.style.left = `${camX}%`;
            selfDot.style.top = `${camZ}%`;
            radarNodes.appendChild(selfDot);
        }
        requestAnimationFrame(updateRadar);
    }
    updateRadar();

    const data = {
        profile: `
            <div class="profile-grid">
                <img src="profile.jpeg" alt="Ashish Gaude" class="profile-pic">
                <div>
                    <h1 class="job-title">"Ashish Gaude"</h1>
                    <p style="color: var(--comment); font-family: var(--font-mono);">// Senior Product Delivery Engineer</p>
                    <p style="color: var(--comment); font-family: var(--font-mono);">// 9+ Years of Experience in Full Stack & Cloud</p>
                    <br>
                    <div style="font-family: var(--font-mono); font-size: 0.9em;">
                        <span class="key">Email:</span> <a href="mailto:ashishgaude@outlook.com" class="string">"ashishgaude@outlook.com"</a><br>
                        <span class="key">Phone:</span> <span class="number">+91 8805112235</span><br>
                        <span class="key">Location:</span> <span class="string">"Pune, India"</span><br>
                        <span class="key">Links:</span> 
                        [<a href="https://www.linkedin.com/in/ashishgaude/" target="_blank">LinkedIn</a>, 
                        <a href="https://mycloudexperiences.blogspot.com" target="_blank">Blog</a>]
                    </div>
                </div>
            </div>
            <p style="margin-top: 25px; font-size: 1.1em;">
                Expert Senior Software Engineer with a focus on high-scale distributed systems and cloud infrastructure. 
                Proven track record in migrating complex microservices, optimizing ML pipelines, and leading product delivery across AWS and Azure ecosystems.
            </p>
        `,
        experience: `
            <div class="job-block">
                <div class="job-title">Senior Software Engineer</div>
                <div class="company-name">@ Velotio Technologies</div>
                <div class="job-date">[ July 2021 - Present ]</div>
                <ul>
                    <li>Migrated <span class="highlight">OxfordVR</span> microservices from C# .NET to NodeJS for improved performance and developer velocity.</li>
                    <li>Designed and implemented comprehensive unit testing strategies using Jest, achieving >90% coverage.</li>
                    <li>Executed seamless database migration from Azure to AWS PostgreSQL using AWS DMS with zero downtime.</li>
                </ul>
            </div>

            <div class="job-block">
                <div class="job-title">Senior Product Delivery Engineer</div>
                <div class="company-name">@ Numinolabs Private Limited</div>
                <div class="job-date">[ Oct 2019 - July 2021 ]</div>
                <ul>
                    <li>Core developer for <span class="highlight">Pixm</span>, an AI-driven Phishing Protection platform.</li>
                    <li>Scaled ML visual detection APIs to handle concurrent requests from 1000+ users using Azure Function Apps.</li>
                    <li>Engineered high-performance browser extensions for Chrome, Firefox, and Edge with a unified codebase.</li>
                </ul>
            </div>

            <div class="job-block">
                <div class="job-title">Product Delivery Engineer</div>
                <div class="company-name">@ Numinolabs Private Limited</div>
                <div class="job-date">[ June 2017 - Sept 2019 ]</div>
                <ul>
                    <li>Architected and developed the MyFlowZone fitness portal utilizing Angular and AWS Lambda.</li>
                    <li>Automated deployment processes by implementing CI/CD pipelines using GoCD.</li>
                </ul>
            </div>
        `,
        skills: `
            <div class="skills-grid">
                <div class="skill-category">
                    <span class="skill-title">Languages</span>
                    <p>JavaScript (ES6+), TypeScript, Python, C++, SQL</p>
                </div>
                <div class="skill-category">
                    <span class="skill-title">Backend & Cloud</span>
                    <p>Node.js, Express, Serverless, AWS (Lambda, DynamoDB, CloudFormation), Azure (Functions, SQL Server, FrontDoor)</p>
                </div>
                <div class="skill-category">
                    <span class="skill-title">Frontend</span>
                    <p>React, Redux, Angular, RxJS, CSS3/SCSS</p>
                </div>
                <div class="skill-category">
                    <span class="skill-title">Tools & DevOps</span>
                    <p>Git, Docker, Docker Compose, GoCD, Postman, Jest, AWS DMS</p>
                </div>
            </div>
        `,
        projects: `
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 40%;"><a href="https://ashishgaude.github.io/kadamba-transport/?route=PNJ110" target="_blank">Kadamba Transport</a></td>
                    <td style="color: #94a3b8;">// Real-time bus route tracking application for Goa commuters.</td>
                </tr>
                <tr>
                    <td><a href="https://ashishgaude.github.io/screen-recorder/" target="_blank">Screen Recorder</a></td>
                    <td style="color: #94a3b8;">// Lightweight, browser-based recording tool with no installation required.</td>
                </tr>
                <tr>
                    <td><a href="https://ashishgaude.github.io/video-chat-pwa/" target="_blank">Video Chat PWA</a></td>
                    <td style="color: #94a3b8;">// High-performance P2P video calling application built as a PWA.</td>
                </tr>
                <tr>
                    <td><a href="https://ashishgaude.github.io/drop-share/" target="_blank">Drop Share</a></td>
                    <td style="color: #94a3b8;">// Secure, peer-to-peer file sharing service leveraging WebRTC.</td>
                </tr>
                <tr>
                    <td><a href="https://game-hub-hazel-zeta.vercel.app/" target="_blank">Game Hub</a></td>
                    <td style="color: #94a3b8;">// Modern gaming platform built with React 18 and TanStack Query.</td>
                </tr>
            </table>
        `,
        education: `
            <div class="job-block">
                <div class="job-title">BE (Information Technology)</div>
                <div class="company-name">Goa College Of Engineering</div>
                <div class="job-date">Graduated: 2016</div>
                <p>Focused on Data Structures, Algorithms, Distributed Computing, and Network Security.</p>
            </div>
        `
    };

    window.addEventListener('nodeFocused', (e) => {
        const section = e.detail.name;
        highlightNav(section);
        showSection(section);
    });

    function showSection(name) {
        if (data[name]) {
            const title = name.toUpperCase().replace('-', ' ');
            hudBody.innerHTML = `<h2 style="color: var(--text-color); font-family: var(--font-mono); margin-bottom: 30px; letter-spacing: 4px; border-bottom: 1px solid rgba(34, 211, 238, 0.2); padding-bottom: 10px; font-size: 1.1rem;">// SYSTEM_LOG: ${title}</h2>`;
            const contentDiv = document.createElement('div');
            hudBody.appendChild(contentDiv);
            hud.classList.add('active');
            typeWriterHTML(contentDiv, data[name]);
        }
    }

    closeHud.addEventListener('click', () => {
        hud.classList.remove('active');
        highlightNav('');
        if (window.portfolio3d) window.portfolio3d.resetCamera();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hud.classList.contains('active')) closeHud.click();
    });

    function typeWriterHTML(container, html) {
        return new Promise((resolve) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const queue = Array.from(tempDiv.childNodes);
            function typeNode() {
                if (queue.length === 0) { resolve(); return; }
                const node = queue.shift();
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    let i = 0;
                    function typeChar() {
                        if (i < text.length) {
                            container.append(text.charAt(i));
                            i += 4; // Faster typing speed
                            setTimeout(typeChar, 1);
                        } else { typeNode(); }
                    }
                    typeChar();
                } else {
                    const clone = node.cloneNode(true);
                    container.appendChild(clone);
                    setTimeout(typeNode, 1);
                }
            }
            typeNode();
        });
    }

    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1500);
});
