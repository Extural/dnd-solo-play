/**
 * API Module
 * Handles communication with AI providers (Claude API, OpenAI, Ollama)
 */

const APIModule = (() => {
    // Configuration
    let config = {
        provider: 'claude', // 'claude', 'openai', or 'ollama'
        apiKey: '',
        ollamaUrl: 'http://localhost:11434',
        ollamaModel: 'llama3.1:latest',
        maxTokens: 4000,
        temperature: 0.7,
        tokenEstimate: 0,
        totalSpent: 0
    };

    // Token pricing (USD per 1M tokens)
    const pricingRates = {
        claude: {
            input: 3,    // $3 per 1M input tokens
            output: 15,  // $15 per 1M output tokens
        },
        openai: {
            input: 10,   // $10 per 1M input tokens (GPT-4)
            output: 30,  // $30 per 1M output tokens (GPT-4)
        }
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

        // Update UI elements
        document.getElementById('apiProvider').value = config.provider;
        document.getElementById('apiKey').value = config.apiKey;
        document.getElementById('ollamaUrl').value = config.ollamaUrl;
        document.getElementById('ollamaModel').value = config.ollamaModel;
        
        // Set up event listeners
        document.getElementById('apiProvider').addEventListener('change', handleProviderChange);
        document.getElementById('apiKey').addEventListener('change', saveConfig);
        document.getElementById('ollamaUrl').addEventListener('change', saveConfig);
        document.getElementById('ollamaModel').addEventListener('change', saveConfig);
        document.getElementById('testConnection').addEventListener('click', testConnection);
        
        // Show/hide relevant configuration fields
        handleProviderChange();
        
        // Load message history from localStorage
        const savedHistory = localStorage.getItem('dnd-solo-message-history');
        if (savedHistory) {
            messageHistory = JSON.parse(savedHistory);
        }
    }

    /**
     * Handle provider dropdown change
     */
    function handleProviderChange() {
        config.provider = document.getElementById('apiProvider').value;
        
        // Show/hide relevant config sections
        if (config.provider === 'ollama') {
            document.getElementById('ollamaConfig').style.display = 'block';
            document.getElementById('apiKeyConfig').style.display = 'none';
        } else {
            document.getElementById('ollamaConfig').style.display = 'none';
            document.getElementById('apiKeyConfig').style.display = 'block';
        }
        
        saveConfig();
    }

    /**
     * Save configuration to localStorage
     */
    function saveConfig() {
        // Update config object
        config.apiKey = document.getElementById('apiKey').value;
        config.ollamaUrl = document.getElementById('ollamaUrl').value;
        config.ollamaModel = document.getElementById('ollamaModel').value;
        
        // Save to localStorage
        localStorage.setItem('dnd-solo-api-config', JSON.stringify(config));
        
        // Update connection status
        updateConnectionStatus(false);
    }

    /**
     * Test connection to the API
     */
    async function testConnection() {
        updateConnectionStatus('testing');
        
        try {
            switch (config.provider) {
                case 'claude':
                    if (!config.apiKey) {
                        throw new Error('API key required');
                    }
                    
                    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': config.apiKey,
                            'anthropic-version': '2023-06-01'
                        },
                        body: JSON.stringify({
                            model: "claude-3-sonnet-20240229",
                            max_tokens: 10,
                            messages: [
                                {role: "user", content: "Hello, testing connection. Reply with one word: Connected"}
                            ]
                        })
                    });
                    
                    const claudeData = await claudeResponse.json();
                    if (claudeResponse.ok && claudeData.content && claudeData.content[0].text) {
                        updateConnectionStatus(true);
                    } else {
                        throw new Error(claudeData.error?.message || 'Unknown error');
                    }
                    break;
                    
                case 'openai':
                    if (!config.apiKey) {
                        throw new Error('API key required');
                    }
                    
                    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${config.apiKey}`
                        },
                        body: JSON.stringify({
                            model: "gpt-4",
                            max_tokens: 10,
                            messages: [
                                {role: "user", content: "Hello, testing connection. Reply with one word: Connected"}
                            ]
                        })
                    });
                    
                    const openaiData = await openaiResponse.json();
                    if (openaiResponse.ok && openaiData.choices && openaiData.choices.length > 0) {
                        updateConnectionStatus(true);
                    } else {
                        throw new Error(openaiData.error?.message || 'Unknown error');
                    }
                    break;
                    
                case 'ollama':
                    const ollamaResponse = await fetch(`${config.ollamaUrl}/api/generate`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: config.ollamaModel,
                            prompt: "Hello, testing connection. Reply with one word: Connected",
                            stream: false
                        })
                    });
                    
                    const ollamaData = await ollamaResponse.json();
                    if (ollamaResponse.ok && ollamaData.response) {
                        updateConnectionStatus(true);
                    } else {
                        throw new Error(ollamaData.error || 'Unknown error');
                    }
                    break;
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            updateConnectionStatus(false, error.message);
        }
    }

    /**
     * Update connection status indicator
     */
    function updateConnectionStatus(status, errorMsg = '') {
        const statusElement = document.getElementById('connectionStatus');
        
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
     * @param {string} message - The user's message
     * @param {Object} characterData - Current character data
     * @returns {Promise<string>} - The AI's response
     */
    async function sendMessage(message, characterData = {}) {
        if (!isConnected && config.provider !== 'ollama') {
            await testConnection();
            
            if (!isConnected) {
                return "⚠️ Not connected to AI. Please check your connection settings.";
            }
        }
        
        // Add user message to history
        messageHistory.push({role: "user", content: message});
        
        // Prune history to avoid token limits
        pruneMessageHistory();
        
        // Create system message based on character data
        const systemMessage = createDMSystemMessage(characterData);
        
        try {
            let response;
            
            switch (config.provider) {
                case 'claude':
                    response = await callClaudeAPI(systemMessage, messageHistory);
                    break;
                case 'openai':
                    response = await callOpenAIAPI(systemMessage, messageHistory);
                    break;
                case 'ollama':
                    response = await callOllamaAPI(systemMessage, messageHistory);
                    break;
                default:
                    throw new Error('Invalid provider');
            }
            
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
     * Call Claude API
     */
    async function callClaudeAPI(systemMessage, messages) {
        // Format messages for Claude API
        const formattedMessages = [
            {role: "system", content: systemMessage}
        ];
        
        // Add message history (skip system messages)
        messages.forEach(msg => {
            formattedMessages.push({
                role: msg.role,
                content: msg.content
            });
        });
        
       const claudeResponse = await fetch('https://your-vercel-app-			name.vercel.app/api/claude', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
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
        
        // Update token estimates
        if (claudeData.usage) {
            updateTokenUsage(claudeData.usage.input_tokens, claudeData.usage.output_tokens);
        }
        
        return claudeData.content[0].text;
    }

    /**
     * Call OpenAI API
     */
    async function callOpenAIAPI(systemMessage, messages) {
        // Format messages for OpenAI API
        const formattedMessages = [
            {role: "system", content: systemMessage}
        ];
        
        // Add message history (skip system messages)
        messages.forEach(msg => {
            formattedMessages.push({
                role: msg.role,
                content: msg.content
            });
        });
        
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                max_tokens: config.maxTokens,
                temperature: config.temperature,
                messages: formattedMessages
            })
        });
        
        const openaiData = await openaiResponse.json();
        
        if (!openaiResponse.ok) {
            throw new Error(openaiData.error?.message || 'Unknown error');
        }
        
        // Update token estimates
        if (openaiData.usage) {
            updateTokenUsage(openaiData.usage.prompt_tokens, openaiData.usage.completion_tokens);
        }
        
        return openaiData.choices[0].message.content;
    }

    /**
     * Call Ollama API
     */
    async function callOllamaAPI(systemMessage, messages) {
        // Format all messages into a single prompt for Ollama
        let prompt = `System: ${systemMessage}\n\n`;
        
        messages.forEach(msg => {
            if (msg.role === "user") {
                prompt += `User: ${msg.content}\n\n`;
            } else if (msg.role === "assistant") {
                prompt += `Assistant: ${msg.content}\n\n`;
            }
        });
        
        // Add final prompt marker
        prompt += 'Assistant: ';
        
        const ollamaResponse = await fetch(`${config.ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.ollamaModel,
                prompt: prompt,
                stream: false
            })
        });
        
        const ollamaData = await ollamaResponse.json();
        
        if (!ollamaResponse.ok) {
            throw new Error(ollamaData.error || 'Unknown error');
        }
        
        // No token usage data from Ollama
        
        return ollamaData.response;
    }

    /**
     * Update token usage counters
     */
    function updateTokenUsage(inputTokens, outputTokens) {
        // Update token count
        config.tokenEstimate += inputTokens + outputTokens;
        
        // Calculate cost based on provider
        let cost = 0;
        
        if (config.provider === 'claude') {
            cost = (inputTokens / 1000000) * pricingRates.claude.input + 
                  (outputTokens / 1000000) * pricingRates.claude.output;
        } else if (config.provider === 'openai') {
            cost = (inputTokens / 1000000) * pricingRates.openai.input + 
                  (outputTokens / 1000000) * pricingRates.openai.output;
        }
        
        config.totalSpent += cost;
        
        // Update UI
        updateCostDisplay();
        
        // Save updated config
        localStorage.setItem('dnd-solo-api-config', JSON.stringify(config));
    }

    /**
     * Update cost display
     */
    function updateCostDisplay() {
        const costElement = document.getElementById('costEstimate');
        
        if (costElement) {
            costElement.textContent = `$${config.totalSpent.toFixed(4)} | ~${Math.round(config.tokenEstimate)} tokens`;
        }
    }

    /**
     * Prune message history to avoid token limits
     */
    function pruneMessageHistory() {
        // Simple pruning strategy - keep the last 20 messages
        if (messageHistory.length > 20) {
            messageHistory = messageHistory.slice(-20);
        }
        
        // Advanced pruning would summarize the conversation
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
     * Get configuration
     */
    function getConfig() {
        return {...config};
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
        
        // Create initial prompt for the AI to set up the adventure
        const adventurePrompt = createAdventurePrompt(characterData, options);
        
        // Get the AI's response
        const response = await sendMessage(adventurePrompt, characterData);
        
        return response;
    }

    /**
     * Create an adventure prompt based on options
     */
    function createAdventurePrompt(characterData, options) {
        const name = characterData.name || 'the adventurer';
        const className = characterData.class || 'adventurer';
        const location = options.location || 'a mysterious land';
        const theme = options.theme || 'high fantasy';
        const tone = options.tone || 'balanced';
        
        return `I want to play D&D 5e solo. I'll be playing ${name}, a level ${characterData.level || 1} ${characterData.race || ''} ${className}${characterData.subclass ? ' (' + characterData.subclass + ')' : ''} with a ${characterData.background || 'mysterious'} background.

Please create a ${theme} adventure in ${location} with a ${tone} tone. Start by describing the initial scene and situation to draw me into the world. Give me clear hooks to engage with, but let me decide how to approach them.

Use D&D 5e rules. Tell me when to make ability checks, saving throws, or attack rolls by specifying the type of roll and DC (e.g., "Make a DC 15 Perception check"). I'll roll the dice and tell you the results.

Let's begin!`;
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
