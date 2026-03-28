document.addEventListener('DOMContentLoaded', () => {
    const hud = document.getElementById('hud');
    const hudBody = document.getElementById('hud-body');
    const closeHud = document.getElementById('close-hud');
    const loader = document.getElementById('loader');

    const data = {
        profile: `
            <div class="profile-grid">
                <img src="profile.jpeg" alt="Ashish Gaude" class="profile-pic">
                <div>
                    <h1 class="string" style="font-size: 1.8em; margin-bottom: 10px;">"Ashish Gaude"</h1>
                    <p style="color: var(--comment);">// Senior Product Delivery Engineer</p>
                    <p style="color: var(--comment);">// 9+ Years of Experience in Full Stack & Cloud</p>
                    <br>
                    <div>
                        <span class="key">Email:</span> <a href="mailto:ashishgaude@outlook.com" class="string">"ashishgaude@outlook.com"</a><br>
                        <span class="key">Phone:</span> <span class="number">+91 8805112235</span><br>
                        <span class="key">Location:</span> <span class="string">"Pune, India"</span><br>
                        <span class="key">Links:</span> 
                        [<a href="https://www.linkedin.com/in/ashishgaude/" target="_blank">LinkedIn</a>, 
                        <a href="https://mycloudexperiences.blogspot.com" target="_blank">Blog</a>]
                    </div>
                </div>
            </div>
            <p style="margin-top: 20px;">
                Senior Product Delivery Engineer with 9+ years of experience specialized in Node.js, AWS, and Azure. 
                Focusing on building scalable, high-performance web applications and cloud infrastructures.
            </p>
        `,
        experience: `
            <div class="job-block">
                <div class="job-title">Senior Software Engineer</div>
                <div class="company-name">@ Velotio Technologies</div>
                <div class="job-date">[ July 2021 - Present ]</div>
                <ul>
                    <li>Migrated <span class="highlight">OxfordVR</span> microservices from C# .NET to NodeJS.</li>
                    <li>Implemented comprehensive unit testing using Jest.</li>
                    <li>Executed database migration from Azure to AWS PostgreSQL using DMS.</li>
                </ul>
            </div>

            <div class="job-block">
                <div class="job-title">Senior Product Delivery Engineer</div>
                <div class="company-name">@ Numinolabs Private Limited</div>
                <div class="job-date">[ Oct 2019 - July 2021 ]</div>
                <ul>
                    <li>Core developer for <span class="highlight">Pixm</span> (Phishing Protection).</li>
                    <li>Scaled ML visual detection APIs to handle 1000+ users using Azure Function Apps.</li>
                    <li>Managed frontend hosting via Azure FrontDoor & CDN.</li>
                    <li>Developed browser extensions for Chrome, Firefox, and Edge.</li>
                </ul>
            </div>

            <div class="job-block">
                <div class="job-title">Product Delivery Engineer</div>
                <div class="company-name">@ Numinolabs Private Limited</div>
                <div class="job-date">[ June 2017 - Sept 2019 ]</div>
                <ul>
                    <li>Developed MyFlowZone fitness portal with Angular & AWS Lambda.</li>
                    <li>Implemented CI/CD pipelines using GoCD.</li>
                </ul>
            </div>
        `,
        skills: `
            <div style="color: var(--text-color);">
                <span class="key">languages:</span> [<span class="string">"JavaScript"</span>, <span class="string">"TypeScript"</span>, <span class="string">"Python"</span>, <span class="string">"C++"</span>]<br>
                <span class="key">backend:</span> [<span class="string">"Node.js"</span>, <span class="string">"Express"</span>, <span class="string">"Serverless"</span>]<br>
                <span class="key">frontend:</span> [<span class="string">"React"</span>, <span class="string">"Redux"</span>, <span class="string">"Angular"</span>]<br>
                <span class="key">cloud_aws:</span> [<span class="string">"Lambda"</span>, <span class="string">"DynamoDB"</span>, <span class="string">"CloudFormation"</span>]<br>
                <span class="key">cloud_azure:</span> [<span class="string">"Functions"</span>, <span class="string">"SQL Server"</span>, <span class="string">"FrontDoor"</span>]<br>
                <span class="key">tools:</span> [<span class="string">"Git"</span>, <span class="string">"GoCD"</span>, <span class="string">"Docker"</span>, <span class="string">"Postman"</span>]
            </div>
        `,
        projects: `
            <table style="width: 100%; border-collapse: collapse; color: var(--text-color);">
                <tr>
                    <td><a href="https://ashishgaude.github.io/kadamba-transport/?route=PNJ110" target="_blank">Kadamba_Transport</a></td>
                    <td style="color: #666;">// Bus route tracking app</td>
                </tr>
                <tr>
                    <td><a href="https://ashishgaude.github.io/screen-recorder/" target="_blank">Screen_Recorder</a></td>
                    <td style="color: #666;">// Browser-based recording tool</td>
                </tr>
                <tr>
                    <td><a href="https://ashishgaude.github.io/video-chat-pwa/" target="_blank">Video_Chat_PWA</a></td>
                    <td style="color: #666;">// P2P video chat application</td>
                </tr>
                <tr>
                    <td><a href="https://ashishgaude.github.io/drop-share/" target="_blank">Drop_Share</a></td>
                    <td style="color: #666;">// P2P file sharing service</td>
                </tr>
                <tr>
                    <td><a href="https://game-hub-hazel-zeta.vercel.app/" target="_blank">Game_Hub</a></td>
                    <td style="color: #666;">// React 18 game browsing site</td>
                </tr>
            </table>
        `,
        education: `
            <p><span class="key">Degree:</span> <span class="string">"BE (Information Technology)"</span></p>
            <p><span class="key">Institute:</span> Goa College Of Engineering</p>
            <p><span class="key">Year:</span> 2016</p>
        `
    };

    // Listen for node focus events from Portfolio3D
    window.addEventListener('nodeFocused', (e) => {
        const section = e.detail.name;
        showSection(section);
    });

    function showSection(name) {
        if (data[name]) {
            hudBody.innerHTML = ''; // Clear previous
            hud.classList.add('active');
            typeWriterHTML(hudBody, data[name]);
        }
    }

    closeHud.addEventListener('click', () => {
        hud.classList.remove('active');
        if (window.portfolio3d) {
            window.portfolio3d.resetCamera();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hud.classList.contains('active')) {
            closeHud.click();
        }
    });

    // Typewriter effect that respects HTML tags
    function typeWriterHTML(container, html) {
        return new Promise((resolve) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const queue = Array.from(tempDiv.childNodes);
            
            function typeNode() {
                if (queue.length === 0) {
                    resolve();
                    return;
                }
                const node = queue.shift();
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    let i = 0;
                    function typeChar() {
                        if (i < text.length) {
                            container.append(text.charAt(i));
                            i++;
                            setTimeout(typeChar, 2); // Ultra fast typing
                        } else {
                            typeNode();
                        }
                    }
                    typeChar();
                } else {
                    const clone = node.cloneNode(true);
                    container.appendChild(clone);
                    setTimeout(typeNode, 10);
                }
            }
            typeNode();
        });
    }

    // Hide loader after a delay
    setTimeout(() => {
        if (loader) loader.style.opacity = '0';
        setTimeout(() => {
            if (loader) loader.style.display = 'none';
        }, 500);
    }, 2000);
});
