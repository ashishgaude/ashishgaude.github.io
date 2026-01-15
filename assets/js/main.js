document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.querySelector('.terminal-body');
    const inputContainer = document.getElementById('input-line');
    const inputField = document.getElementById('terminal-input');
    
    // Initialize Matrix Effect
    let matrixEffect = null;
    
    // Load external script for matrix if needed, or just assume it's loaded via HTML
    if (typeof MatrixEffect !== 'undefined') {
        matrixEffect = new MatrixEffect();
    }

    // Focus input on click
    document.addEventListener('click', () => {
        const selection = window.getSelection();
        if (selection.toString().length === 0) {
            inputField.focus();
        }
    });

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputField.value.trim();
            inputField.disabled = true; // Disable input while processing
            handleCommand(command);
        }
    });

    async function handleCommand(cmd) {
        // Create command line echo
        const cmdLine = document.createElement('div');
        cmdLine.className = 'command-line';
        cmdLine.innerHTML = `
            <span class="prompt"><span class="user">ashish@macbook</span>:<span class="loc">~</span>$</span>
            <span class="cmd" style="color: var(--text-color); font-weight: normal;">${escapeHtml(cmd)}</span>
        `;
        
        terminalBody.insertBefore(cmdLine, inputContainer);
        inputField.value = '';

        // Process command
        const response = processCommand(cmd.toLowerCase());
        
        if (response) {
            const outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            terminalBody.insertBefore(outputDiv, inputContainer);
            
            // "Type" the response
            await typeWriterHTML(outputDiv, response);
        }

        inputField.disabled = false;
        inputField.focus();
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Typewriter effect that respects HTML tags
    function typeWriterHTML(container, html) {
        return new Promise((resolve) => {
            // Create a temporary container to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            const queue = Array.from(tempDiv.childNodes);
            
            function typeNode() {
                if (queue.length === 0) {
                    resolve();
                    return;
                }

                const node = queue.shift();
                
                // If text node, type chars
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    let i = 0;
                    
                    function typeChar() {
                        if (i < text.length) {
                            container.append(text.charAt(i));
                            i++;
                            window.scrollTo(0, document.body.scrollHeight);
                            setTimeout(typeChar, 5); // Fast typing speed
                        } else {
                            typeNode();
                        }
                    }
                    typeChar();
                } else {
                    // If element node, create it and recurse or append immediately
                    // For complex structures like tables/lists, appending the whole block 
                    // looks better than typing inner text recursively, 
                    // but let's try a hybrid: clone the node empty, append it, then type into it
                    
                    const clone = node.cloneNode(false); // shallow clone
                    container.appendChild(clone);
                    
                    // If it has children, we need to process them inside the clone
                    if (node.childNodes.length > 0) {
                        // We need a new recursive typer for this new container
                        // But to keep it linear, we can't easily recurse asynchronously in this loop structure
                        // Simpler approach: Just append non-text nodes instantly for structure, 
                        // or better: "Stream" elements one by one with a small delay
                        
                        // Let's go with "Chunk Streaming" for HTML elements to ensure safety and style
                        // Replacing the empty clone with the full node
                        container.replaceChild(node, clone);
                        window.scrollTo(0, document.body.scrollHeight);
                        setTimeout(typeNode, 20); // Delay between blocks
                    } else {
                        setTimeout(typeNode, 20);
                    }
                }
            }
            
            typeNode();
        });
    }

    const data = {
        profile: `
            <div class="command-line">
                <span class="prompt"><span class="user">ashish@macbook</span>:<span class="loc">~</span>$</span>
                <span class="cmd">./show-profile.sh</span>
            </div>
            <div class="output">
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
            </div>
        `,
        help_hint: `
            <br>
            <p style="color: var(--comment); margin-bottom: 10px; font-size: 0.9em;">
                // Type '<span style="color: var(--cmd-color);">help</span>' to see available commands or '<span style="color: var(--cmd-color);">all</span>' to see full resume.
            </p>
        `,
        experience: `
            <div style="margin-bottom: 20px;">
                <span class="cmd">cat employment_history.log</span>
            </div>
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
            <div style="margin-bottom: 10px;">
                <span class="cmd">npm list --global --depth=0</span>
            </div>
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
            <div style="margin-bottom: 10px;">
                <span class="cmd">ls -la ./projects/</span>
            </div>
            <table style="width: 100%; border-collapse: collapse; color: var(--text-color);">
                <tr>
                    <td style="padding-right: 15px; color: var(--boolean);">drwxr-xr-x</td>
                    <td><a href="https://ashishgaude.github.io/kadamba-transport/?route=PNJ110" target="_blank">Kadamba_Transport</a></td>
                    <td style="color: #666;">// Bus route tracking app</td>
                </tr>
                <tr>
                    <td style="padding-right: 15px; color: var(--boolean);">drwxr-xr-x</td>
                    <td><a href="https://ashishgaude.github.io/screen-recorder/" target="_blank">Screen_Recorder</a></td>
                    <td style="color: #666;">// Browser-based recording tool</td>
                </tr>
                <tr>
                    <td style="padding-right: 15px; color: var(--boolean);">drwxr-xr-x</td>
                    <td><a href="https://ashishgaude.github.io/video-chat-pwa/" target="_blank">Video_Chat_PWA</a></td>
                    <td style="color: #666;">// P2P video chat application</td>
                </tr>
                <tr>
                    <td style="padding-right: 15px; color: var(--boolean);">drwxr-xr-x</td>
                    <td><a href="https://ashishgaude.github.io/drop-share/" target="_blank">Drop_Share</a></td>
                    <td style="color: #666;">// P2P file sharing service</td>
                </tr>
                <tr>
                    <td style="padding-right: 15px; color: var(--boolean);">drwxr-xr-x</td>
                    <td><a href="https://game-hub-hazel-zeta.vercel.app/" target="_blank">Game_Hub</a></td>
                    <td style="color: #666;">// React 18 game browsing site</td>
                </tr>
                <tr>
                    <td style="padding-right: 15px; color: var(--boolean);">drwxr-xr-x</td>
                    <td>CloudSploit</td>
                    <td style="color: #666;">// Open source contributor</td>
                </tr>
            </table>
        `,
        education: `
            <div style="margin-bottom: 10px;">
                <span class="cmd">cat education.txt</span>
            </div>
            <p><span class="key">Degree:</span> <span class="string">"BE (Information Technology)"</span></p>
            <p><span class="key">Institute:</span> Goa College Of Engineering</p>
            <p><span class="key">Year:</span> 2016</p>
        `
    };

    function processCommand(cmd) {
        const args = cmd.split(' ');
        const mainCmd = args[0];

        switch (mainCmd) {
            case 'help':
                return `
                    <div style="color: var(--text-color);">
                        Available commands:<br>
                        <span class="cmd">all</span>        - Show full resume details<br>
                        <span class="cmd">about</span>      - Display profile summary<br>
                        <span class="cmd">experience</span> - Show work history<br>
                        <span class="cmd">skills</span>     - List technical skills<br>
                        <span class="cmd">projects</span>   - Show project links<br>
                        <span class="cmd">education</span>  - Show education details<br>
                        <span class="cmd">email</span>      - Send me an email<br>
                        <span class="cmd">matrix</span>     - Toggle 'The Matrix' mode<br>
                        <span class="cmd">clear</span>      - Reset the terminal<br>
                    </div>
                `;
            
            case 'matrix':
                if (matrixEffect) {
                    return matrixEffect.toggle();
                }
                return "Matrix effect not loaded.";

            case 'all':
            case 'resume':
                return data.experience + 
                       "<br>" + data.skills + 
                       "<br>" + data.projects + 
                       "<br>" + data.education;

            case 'experience':
            case 'work':
                return data.experience;
            
            case 'skills':
                return data.skills;
            
            case 'projects':
                return data.projects;

            case 'education':
                return data.education;
            
            case 'clear':
            case 'reset':
                // Clear everything EXCEPT the input line
                while (terminalBody.firstChild && terminalBody.firstChild !== inputContainer) {
                    terminalBody.removeChild(terminalBody.firstChild);
                }
                
                // Restore initial state immediately (no typing for clear)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data.profile + data.help_hint;
                
                while (tempDiv.firstChild) {
                    terminalBody.insertBefore(tempDiv.firstChild, inputContainer);
                }
                
                return '';
            
            case 'whoami':
                return '<span class="string">"guest_user"</span>';

            case 'date':
                return new Date().toString();

            case 'email':
                window.location.href = "mailto:ashishgaude@outlook.com";
                return 'Opening mail client...';
                
            case 'about':
                return `
                    Senior Product Delivery Engineer with 9+ years of experience.<br>
                    Specialized in Node.js, AWS, and Azure.
                `;

            case '':
                return ''; // Do nothing for empty enter

            default:
                return `<span style="color: #ff5f56;">Command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.</span>`;
        }
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});