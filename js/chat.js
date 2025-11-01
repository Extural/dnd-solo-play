// Chat Module
// Handles chat messages, dual-mode chat (in-game/out-of-game), and AI interaction

const ChatModule = (function() {
    let conversationHistory = [];
    let isInGameMode = true;

    function init() {
        attachEventListeners();
        loadChatHistory();
    }

    function attachEventListeners() {
        // Send button
        document.getElementById('sendBtn')?.addEventListener('click', sendMessage);
        
        // Enter key to send
        document.getElementById('userInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Chat mode toggle
        document.getElementById('inGameModeBtn')?.addEventListener('click', () => setMode(true));
        document.getElementById('outGameModeBtn')?.addEventListener('click', () => setMode(false));
    }

    function setMode(inGame) {
        isInGameMode = inGame;
        
        // Update button states
        document.getElementById('inGameModeBtn')?.classList.toggle('active', inGame);
        document.getElementById('outGameModeBtn')?.classList.toggle('active', !inGame);
        
        // Update placeholder
        const input = document.getElementById('userInput');
        if (input) {
            input.placeholder = inGame ? 
                'What does your character do or say?' : 
                'Ask the DM a question (out of game)';
        }
    }

    async function sendMessage() {
        const input = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (!input || !sendBtn) return;
        
        const message = input.value.trim();
        if (!message) return;

        // Disable input
        input.disabled = true;
        sendBtn.disabled = true;

        // Add user message to chat
        addUserMessage(message);

        // Clear input
        input.value = '';

        // Add to conversation history
        conversationHistory.push({ role: 'user', content: message });

        try {
            // Send to AI
            const response = await window.APIModule.sendMessage(conversationHistory, isInGameMode);

            // Add DM response
            addDMMessage(response);

            // Add to conversation history
            conversationHistory.push({ role: 'assistant', content: response });

            // Save history
            saveChatHistory();

        } catch (error) {
            addSystemMessage(`Error: ${error.message}`);
        } finally {
            // Re-enable input
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }

    function addUserMessage(text) {
        addMessage(text, 'user');
    }

    function addDMMessage(text) {
        addMessage(text, 'dm');
    }

    function addSystemMessage(text) {
        addMessage(text, 'system');
    }

    function addRollMessage(text) {
        addMessage(text, 'roll');
    }

    function addMessage(text, type = 'system') {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        conversationHistory = [];
        saveChatHistory();
    }

    function saveChatHistory() {
        localStorage.setItem('dnd_chat_history', JSON.stringify(conversationHistory));
    }

    function loadChatHistory() {
        const saved = localStorage.getItem('dnd_chat_history');
        if (saved) {
            conversationHistory = JSON.parse(saved);
            // Optionally reload messages to display
            conversationHistory.forEach(msg => {
                if (msg.role === 'user') {
                    addUserMessage(msg.content);
                } else {
                    addDMMessage(msg.content);
                }
            });
        }
    }

    return {
        init,
        addUserMessage,
        addDMMessage,
        addSystemMessage,
        addRollMessage,
        clearChat
    };
})();

window.ChatModule = ChatModule;
