// API Handler Module
// Handles communication with AI APIs (Ollama, Claude, OpenAI)

const APIModule = (function() {
    let apiProvider = 'ollama';
    let apiKey = '';
    let ollamaUrl = 'http://localhost:11434';
    let ollamaModel = 'llama3.1:latest';
    let isConnected = false;

    function init() {
        loadAPISettings();
        attachEventListeners();
        updateConnectionStatus('disconnected', 'Not Connected');
        toggleModelSelector();
    }

    function attachEventListeners() {
        document.getElementById('apiProvider')?.addEventListener('change', (e) => {
            apiProvider = e.target.value;
            saveAPISettings();
            updateConnectionStatus('disconnected', 'Not Connected');
            toggleModelSelector();
        });

        document.getElementById('apiKey')?.addEventListener('change', (e) => {
            apiKey = e.target.value;
            saveAPISettings();
            updateConnectionStatus('disconnected', 'Not Connected');
        });

        document.getElementById('ollamaModel')?.addEventListener('change', (e) => {
            ollamaModel = e.target.value;
            saveAPISettings();
            updateConnectionStatus('disconnected', 'Model Changed');
        });

        document.getElementById('testConnectionBtn')?.addEventListener('click', testConnection);
    }

    function toggleModelSelector() {
        const modelSelect = document.getElementById('ollamaModel');
        const apiKeyInput = document.getElementById('apiKey');
        
        if (modelSelect && apiKeyInput) {
            if (apiProvider === 'ollama') {
                modelSelect.style.display = 'block';
                apiKeyInput.style.display = 'none';
                loadOllamaModels();
            } else {
                modelSelect.style.display = 'none';
                apiKeyInput.style.display = 'block';
            }
        }
    }

    async function loadOllamaModels() {
        try {
            const response = await fetch(`${ollamaUrl}/api/tags`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                const modelSelect = document.getElementById('ollamaModel');
                
                if (modelSelect && data.models && data.models.length > 0) {
                    modelSelect.innerHTML = '<option value="">Select Ollama Model...</option>';
                    
                    data.models.forEach(model => {
                        const option = document.createElement('option');
                        option.value = model.name;
                        option.textContent = model.name;
                        modelSelect.appendChild(option);
                    });
                    
                    if (ollamaModel && data.models.find(m => m.name === ollamaModel)) {
                        modelSelect.value = ollamaModel;
                    } else if (data.models.length > 0) {
                        modelSelect.value = data.models[0].name;
                        ollamaModel = data.models[0].name;
                        saveAPISettings();
                    }
                }
            }
        } catch (error) {
            console.log('Could not load Ollama models');
        }
    }

    function saveAPISettings() {
        localStorage.setItem('dnd_api_provider', apiProvider);
        localStorage.setItem('dnd_api_key', apiKey);
        localStorage.setItem('dnd_ollama_model', ollamaModel);
    }

    function loadAPISettings() {
        apiProvider = localStorage.getItem('dnd_api_provider') || 'ollama';
        apiKey = localStorage.getItem('dnd_api_key') || '';
        ollamaModel = localStorage.getItem('dnd_ollama_model') || 'llama3.1:latest';
        
        if (document.getElementById('apiProvider')) {
            document.getElementById('apiProvider').value = apiProvider;
        }
        if (document.getElementById('apiKey')) {
            document.getElementById('apiKey').value = apiKey;
        }
        if (document.getElementById('ollamaModel')) {
            document.getElementById('ollamaModel').value = ollamaModel;
        }
    }

    function updateConnectionStatus(status, message) {
        const indicator = document.getElementById('connectionIndicator');
        const statusText = document.getElementById('connectionStatus');
        
        if (indicator) {
            indicator.className = 'connection-indicator ' + status;
        }
        
        if (statusText) {
            statusText.textContent = message;
        }
        
        isConnected = (status === 'connected');
    }

    async function testConnection() {
        const btn = document.getElementById('testConnectionBtn');
        if (btn) btn.disabled = true;
        
        updateConnectionStatus('testing', 'Testing...');

        try {
            switch(apiProvider) {
                case 'ollama':
                    await testOllamaConnection();
                    break;
                case 'claude':
                    await testClaudeConnection();
                    break;
                case 'openai':
                    await testOpenAIConnection();
                    break;
            }
        } catch (error) {
            updateConnectionStatus('disconnected', 'Connection Failed');
            if (window.ChatModule) {
                window.ChatModule.addSystemMessage(`❌ Connection test failed: ${error.message}`);
            }
        } finally {
            if (btn) btn.disabled = false;
        }
    }

    async function testOllamaConnection() {
        if (!ollamaModel) {
            throw new Error('Please select an Ollama model');
        }

        try {
            const response = await fetch(`${ollamaUrl}/api/tags`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Ollama not responding. Start it with: ollama serve');
            }

            const data = await response.json();
            if (!data.models || data.models.length === 0) {
                throw new Error('No models installed. Run: ollama pull llama3.1:latest');
            }

            const modelExists = data.models.find(m => m.name === ollamaModel);
            if (!modelExists) {
                throw new Error(`Model "${ollamaModel}" not found. Run: ollama pull ${ollamaModel}`);
            }

            updateConnectionStatus('connected', `✅ Ollama: ${ollamaModel}`);
            if (window.ChatModule) {
                window.ChatModule.addSystemMessage(`✅ Connected to Ollama with model: ${ollamaModel}`);
            }
        } catch (error) {
            throw error;
        }
    }

    async function testClaudeConnection() {
        if (!apiKey) {
            throw new Error('Claude API key required');
        }

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 10,
                    messages: [{ role: 'user', content: 'hi' }]
                })
            });

            if (response.status === 401) {
                throw new Error('Invalid API key');
            }

            if (response.status === 429) {
                throw new Error('Rate limit exceeded');
            }

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            updateConnectionStatus('connected', '✅ Claude Connected');
            if (window.ChatModule) {
                window.ChatModule.addSystemMessage('✅ Successfully connected to Claude API!');
            }
        } catch (error) {
            throw error;
        }
    }

    async function testOpenAIConnection() {
        if (!apiKey) {
            throw new Error('OpenAI API key required');
        }

        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (response.status === 401) {
                throw new Error('Invalid API key');
            }

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            updateConnectionStatus('connected', '✅ OpenAI Connected');
            if (window.ChatModule) {
                window.ChatModule.addSystemMessage('✅ Successfully connected to OpenAI API!');
            }
        } catch (error) {
            throw error;
        }
    }

    async function sendMessage(messages, isInGame = true) {
        updateConnectionStatus('testing', 'Sending...');
        
        const character = window.CharacterModule.getCurrentCharacter();
        const systemPrompt = generateSystemPrompt(character, isInGame);

        try {
            let response;
            switch(apiProvider) {
                case 'ollama':
                    response = await sendToOllama([
                        { role: 'system', content: systemPrompt },
                        ...messages
                    ]);
                    break;
                case 'claude':
                    response = await sendToClaude(systemPrompt, messages);
                    break;
                case 'openai':
                    response = await sendToOpenAI([
                        { role: 'system', content: systemPrompt },
                        ...messages
                    ]);
                    break;
                default:
                    throw new Error('Unknown API provider');
            }
            
            updateConnectionStatus('connected', '✅ Connected');
            return response;
        } catch (error) {
            updateConnectionStatus('disconnected', 'Connection Failed');
            throw error;
        }
    }

    function generateSystemPrompt(character, isInGame) {
        const basePrompt = `You are an expert Dungeon Master running a D&D 5e solo adventure. `;
        
        const characterInfo = character.name ? `
        
Current Character:
- Name: ${character.name}
- Race: ${character.race}
- Class: ${character.class} ${character.subclass ? `(${character.subclass})` : ''}
- Level: ${character.level}
- HP: ${character.hp}/${character.maxHp}
- AC: ${character.ac}
- Abilities: STR ${character.abilities.strength}, DEX ${character.abilities.dexterity}, CON ${character.abilities.constitution}, INT ${character.abilities.intelligence}, WIS ${character.abilities.wisdom}, CHA ${character.abilities.charisma}
        ` : '';

        const modePrompt = isInGame ? 
            `The player's messages represent their character's actions and dialogue in the game world. Respond as the DM, describing what happens in the world. Call for ability checks when appropriate (e.g., "Roll a Dexterity check to climb the wall").` :
            `The player is asking an out-of-game question. Provide helpful DM guidance, rule clarifications, or meta-game advice. Don't advance the story.`;

        return basePrompt + characterInfo + '\n\n' + modePrompt;
    }

    async function sendToOllama(messages) {
        if (!ollamaModel) {
            throw new Error('Please select an Ollama model');
        }

        try {
            const response = await fetch(`${ollamaUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: ollamaModel,
                    messages: messages,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama error: ${response.statusText}. Make sure model "${ollamaModel}" is installed.`);
            }

            const data = await response.json();
            return data.message.content;
        } catch (error) {
            throw new Error(`Ollama connection failed: ${error.message}. Make sure Ollama is running: ollama serve`);
        }
    }

    async function sendToClaude(systemPrompt, messages) {
        if (!apiKey) {
            throw new Error('Claude API key required');
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                system: systemPrompt,
                messages: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async function sendToOpenAI(messages) {
        if (!apiKey) {
            throw new Error('OpenAI API key required');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    return {
        init,
        sendMessage,
        testConnection
    };
})();

window.APIModule = APIModule;
