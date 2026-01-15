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

    function processCommand(cmd) {
        const args = cmd.split(' ');
        const mainCmd = args[0];

        switch (mainCmd) {
            case 'help':
                return `
                    <div style="color: var(--text-color);">
                        Available commands:<br>
                        <span class="cmd">about</span>    - Display profile summary<br>
                        <span class="cmd">skills</span>   - List technical skills<br>
                        <span class="cmd">projects</span> - Show project links<br>
                        <span class="cmd">email</span>    - Send me an email<br>
                        <span class="cmd">clear</span>    - Clear the terminal screen<br>
                        <span class="cmd">whoami</span>   - Current user info<br>
                        <span class="cmd">date</span>     - Show current date<br>
                        <span class="cmd">gui</span>      - <span style="color: #666">// coming soon (switch to normal web view)</span>
                    </div>
                `;
            case 'clear':
                // Remove all previous siblings of inputContainer inside terminalBody
                // But we want to keep the header? No, 'clear' usually clears everything visible.
                // However, for recruiters, we might want to reload the page or just hide the "history".
                // Let's just remove the dynamically added lines AND the static content?
                // Safest bet: just remove everything above the input line inside terminal-body
                
                // Better approach: Hiding the static content might confuse recruiters if they did it by accident.
                // Let's just clear the "dynamic" content or everything inside .terminal-body except the input-line.
                
                // Actually, let's clear everything EXCEPT the input line.
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

            case 'skills':
                return `
                    <span class="key">languages:</span> [JS, TS, Python, C++]<br>
                    <span class="key">backend:</span> [Node.js, Serverless, Azure Functions]<br>
                    <span class="key">frontend:</span> [React, Angular]
                `;
            
            case 'projects':
                return `
                    <a href="https://ashishgaude.github.io/kadamba-transport/?route=PNJ110" target="_blank">Kadamba_Transport</a><br>
                    <a href="https://ashishgaude.github.io/screen-recorder/" target="_blank">Screen_Recorder</a><br>
                    <a href="https://ashishgaude.github.io/video-chat-pwa/" target="_blank">Video_Chat_PWA</a><br>
                    <a href="https://ashishgaude.github.io/drop-share/" target="_blank">Drop_Share</a>
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
