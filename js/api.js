/**
 * Simplified API Module for D&D Solo Play
 * Using a public CORS proxy to avoid CORS issues
 */

const APIModule = (() => {
    // Configuration
    let config = {
        provider: 'claude',
        apiKey: '', // Will be entered by user
        maxTokens: 4000,
        temperature: 0.7,
        tokenEstimate: 0,
        totalSpent: 0
    };

    // Message history
    let messageHistory = [];
    let isConnected = false;
    let lastResponse = '';

    /**
     * Initialize the API module
     */
    function init() {
        // Load configuration from localStorage
        const savedConfig = localStorage.getItem('dnd-solo-api-config');
        if (savedConfig) {
            config = {...config, ...JSON.parse(savedConfig)};
        }
        
        // Update UI elements if they exist
        if (document.getElementById('apiKey')) {
            document.getElementById('apiKey').value = config.apiKey;
        }
        
        // Load message history from localStorage
        const savedHistory = localStorage.getItem('dnd-solo-message-history');
        if (savedHistory) {
            messageHistory = JSON.parse(savedHistory);
        }
        
        console.log('API Module initialized - DIRECT CLAUDE API VERSION');
        
        // Set up event listeners if elements exist
        if (document.getElementById('apiKey')) {
            document.getElementById('apiKey').addEventListener('change', saveConfig);
        }
        if (document.getElementById('testConnection')) {
            document.getElementById('testConnection').addEventListener('click', testConnection);
        }
        
        // Update connection status
        updateConnectionStatus(Boolean(config.apiKey));
    }

    /**
     * Save configuration to localStorage
     */
    function saveConfig() {
        // Update config object
        if (document.getElementById('apiKey')) {
            config.apiKey = document.getElementById('apiKey').value;
        }
        
        // Save to localStorage
        localStorage.setItem('dnd-solo-api-config', JSON.stringify(config));
        
        // Update connection status
        updateConnectionStatus(Boolean(config.apiKey));
    }

    /**
     * Test connection to Claude API
     */
    async function testConnection() {
        updateConnectionStatus('testing');
        
        if (!config.apiKey) {
            updateConnectionStatus(false, 'API key required');
            return;
        }
        
        try {
            const response = await callClaudeAPI("Hello, testing connection.", "You are a helpful assistant.");
            updateConnectionStatus(true);
            return true;
        } catch (error) {
            console.error('Connection test failed:', error);
            updateConnectionStatus(false, error.message);
            return false;
        }
    }

    /**
     * Update connection status indicator
     */
    function updateConnectionStatus(status, errorMsg = '') {
        const statusElement = document.getElementById('connectionStatus');
        
        if (!statusElement) return;
        
        if (status === 'testing') {
            statusElement.textContent = 'Testing...';
            statusElement.className = 'status-testing';
            return;
        }
        
        isConnected = status;
        
        if (status) {
            statusElement.textContent = 'Connected';
            statusElement.className = 'status-connected';
        } else {
            statusElement.textContent = errorMsg || 'Not connected';
            statusElement.className = 'status-disconnected';
        }
    }

    /**
     * Send a message to the AI
     */
    async function sendMessage(message, characterData = {}) {
        if (!config.apiKey) {
            return "⚠️ Please enter your Claude API key in the settings panel.";
        }
        
        // Add user message to history
        messageHistory.push({role: "user", content: message});
        
        // Prune history to avoid token limits
        if (messageHistory.length > 20) {
            messageHistory = messageHistory.slice(-20);
        }
        
        // Create system message based on character data
        const systemMessage = createDMSystemMessage(characterData);
        
        try {
            const response = await callClaudeAPI(message, systemMessage);
            
            // Add assistant response to history
            messageHistory.push({role: "assistant", content: response});
            
            // Save updated history
            localStorage.setItem('dnd-solo-message-history', JSON.stringify(messageHistory));
            
            lastResponse = response;
            return response;
        } catch (error) {
            console.error('AI request failed:', error);
            return `⚠️ AI request failed: ${error.message}`;
        }
    }

    /**
     * Call Claude API directly using a CORS proxy
     */
    async function callClaudeAPI(message, systemMessage) {
        // Format messages for Claude API
        const formattedMessages = [
            {role: "system", content: systemMessage}
        ];
        
        // Add message history (skip system messages)
        messageHistory.forEach(msg => {
            if (msg.role !== "system") {
                formattedMessages.push({
                    role: msg.role,
                    content: msg.content
                });
            }
        });
        
        // Add current message if not in history yet
        if (!messageHistory.some(msg => msg.role === "user" && msg.content === message)) {
            formattedMessages.push({role: "user", content: message});
        }
        
        // Use a public CORS proxy to avoid CORS issues
        const proxyUrl = "https://corsproxy.io/?";
        const targetUrl = "https://api.anthropic.com/v1/messages";
        
        const claudeResponse = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: "claude-3-sonnet-20240229",
                max_tokens: config.maxTokens,
                temperature: config.temperature,
                messages: formattedMessages
            })
        });
        
        const claudeData = await claudeResponse.json();
        
        if (!claudeResponse.ok) {
            throw new Error(claudeData.error?.message || 'Unknown error');
        }
        
        return claudeData.content[0].text;
    }

    /**
     * Create the system message for the DM
     */
    function createDMSystemMessage(characterData) {
        // Create a detailed system prompt for the AI
        let systemMessage = `You are an expert Dungeon Master for a solo D&D 5e adventure. 
Your goal is to provide an immersive, engaging, and balanced game experience.

Follow these guidelines:
1. Describe scenes vividly but concisely.
2. Balance roleplay, exploration, and combat.
3. Adapt to player decisions - never railroad them.
4. Apply D&D 5e rules accurately but prioritize fun.
5. Tell the player when to make dice rolls and what the DC is.
6. Keep track of the narrative, NPCs, locations, and quests.
7. Provide reasonable options when the player seems stuck.
8. Create engaging NPCs with distinct personalities.
9. Incorporate the character's background and traits into the story.

Your tone should be descriptive, immersive, and reactive to player choices. 
Ask for specific dice rolls (e.g., "Roll a Perception check" or "Make a DC 15 Dexterity save").`;

        // Add character information if available
        if (characterData && Object.keys(characterData).length > 0) {
            systemMessage += `\n\nThe player's character information:
Name: ${characterData.name || 'Unknown'}
Race: ${characterData.race || 'Unknown'}
Class: ${characterData.class || 'Unknown'}${characterData.subclass ? ' (' + characterData.subclass + ')' : ''}
Level: ${characterData.level || 1}
Background: ${characterData.background || 'Unknown'}
HP: ${characterData.hp || '?'}/${characterData.maxHp || '?'}
AC: ${characterData.ac || '?'}
Proficiency Bonus: +${characterData.proficiencyBonus || 2}

Ability Scores:
STR: ${characterData.abilities?.strength || '?'} (${calculateModifier(characterData.abilities?.strength)})
DEX: ${characterData.abilities?.dexterity || '?'} (${calculateModifier(characterData.abilities?.dexterity)})
CON: ${characterData.abilities?.constitution || '?'} (${calculateModifier(characterData.abilities?.constitution)})
INT: ${characterData.abilities?.intelligence || '?'} (${calculateModifier(characterData.abilities?.intelligence)})
WIS: ${characterData.abilities?.wisdom || '?'} (${calculateModifier(characterData.abilities?.wisdom)})
CHA: ${characterData.abilities?.charisma || '?'} (${calculateModifier(characterData.abilities?.charisma)})

Proficient Skills: ${characterData.skills?.join(', ') || 'None listed'}`;
        }

        return systemMessage;
    }

    /**
     * Calculate ability modifier
     */
    function calculateModifier(score) {
        if (!score) return '?';
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? '+' + mod : mod.toString();
    }

    /**
     * Reset conversation history
     */
    function resetConversation() {
        messageHistory = [];
        localStorage.setItem('dnd-solo-message-history', JSON.stringify(messageHistory));
    }

    /**
     * Start a new adventure
     */
    async function startNewAdventure(characterData, options = {}) {
        // Reset conversation
        resetConversation();
        
        // Create initial prompt
        const name = characterData.name || 'the adventurer';
        const className = characterData.class || 'adventurer';
        const location = options.location || 'a mysterious land';
        const theme = options.theme || 'high fantasy';
        const tone = options.tone || 'balanced';
        
        const adventurePrompt = `I want to play D&D 5e solo. I'll be playing ${name}, a level ${characterData.level || 1} ${characterData.race || ''} ${className}${characterData.subclass ? ' (' + characterData.subclass + ')' : ''} with a ${characterData.background || 'mysterious'} background.

Please create a ${theme} adventure in ${location} with a ${tone} tone. Start by describing the initial scene and situation to draw me into the world. Give me clear hooks to engage with, but let me decide how to approach them.

Use D&D 5e rules. Tell me when to make ability checks, saving throws, or attack rolls by specifying the type of roll and DC (e.g., "Make a DC 15 Perception check"). I'll roll the dice and tell you the results.

Let's begin!`;
        
        // Get the AI's response
        const response = await sendMessage(adventurePrompt, characterData);
        
        return response;
    }

    /**
     * Get configuration
     */
    function getConfig() {
        return {...config};
    }

    // Public API
    return {
        init,
        testConnection,
        sendMessage,
        getConfig,
        resetConversation,
        startNewAdventure,
        updateConnectionStatus
    };
})();

// Export the module
window.APIModule = APIModule;
