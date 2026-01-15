document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.querySelector('.terminal-body');
    const inputContainer = document.getElementById('input-line');
    const inputField = document.getElementById('terminal-input');

    // Focus input on click anywhere in terminal
    document.addEventListener('click', () => {
        // Don't force focus if user is selecting text
        const selection = window.getSelection();
        if (selection.toString().length === 0) {
            inputField.focus();
        }
    });

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputField.value.trim();
            handleCommand(command);
            inputField.value = '';
        }
    });

    function handleCommand(cmd) {
        // Create the line showing what the user just typed
        const cmdLine = document.createElement('div');
        cmdLine.className = 'command-line';
        cmdLine.innerHTML = `
            <span class="prompt"><span class="user">ashish@macbook</span>:<span class="loc">~</span>$</span>
            <span class="cmd" style="color: var(--text-color); font-weight: normal;">${escapeHtml(cmd)}</span>
        `;
        
        // Insert before the input line
        terminalBody.insertBefore(cmdLine, inputContainer);

        // Process command
        const output = processCommand(cmd.toLowerCase());
        
        if (output) {
            const outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            outputDiv.innerHTML = output;
            terminalBody.insertBefore(outputDiv, inputContainer);
        }

        // Auto scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);
    }

    const data = {
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
        `,
        download: `
             <div style="margin-bottom: 10px;">
                <span class="cmd">sudo wget resume.pdf</span>
            </div>
            <a href="javascript:window.print()" style="color: var(--highlight); text-decoration: none; border: 1px solid var(--highlight); padding: 5px 10px; border-radius: 4px;">
                <i class="fas fa-download"></i> Click to Download/Print PDF
            </a>
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
                        <span class="cmd">clear</span>      - Clear the terminal screen<br>
                        <span class="cmd">whoami</span>     - Current user info<br>
                        <span class="cmd">date</span>       - Show current date<br>
                    </div>
                `;
            
            case 'all':
            case 'resume':
                return data.experience + 
                       "<br>" + data.skills + 
                       "<br>" + data.projects + 
                       "<br>" + data.education +
                       "<br>" + data.download;

            case 'experience':
            case 'work':
                return data.experience;
            
            case 'skills':
                return data.skills;
            
            case 'projects':
                return data.projects;

            case 'education':
                return data.education;
            
            case 'download':
            case 'pdf':
                return data.download;

            case 'clear':
                // Clear everything EXCEPT the input line
                while (terminalBody.firstChild && terminalBody.firstChild !== inputContainer) {
                    terminalBody.removeChild(terminalBody.firstChild);
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