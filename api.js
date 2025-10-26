// API Handler Module
// Handles communication with AI APIs (Ollama, Claude, OpenAI)

const APIModule = (function() {
    let apiProvider = 'ollama';
    let apiKey = '';
    let ollamaUrl = 'http://localhost:11434';

    function init() {
        loadAPISettings();
        attachEventListeners();
    }

    function attachEventListeners() {
        document.getElementById('apiProvider')?.addEventListener('change', (e) => {
            apiProvider = e.target.value;
            saveAPISettings();
        });

        document.getElementById('apiKey')?.addEventListener('change', (e) => {
            apiKey = e.target.value;
            saveAPISettings();
        });
    }

    function saveAPISettings() {
        localStorage.setItem('dnd_api_provider', apiProvider);
        localStorage.setItem('dnd_api_key', apiKey);
    }

    function loadAPISettings() {
        apiProvider = localStorage.getItem('dnd_api_provider') || 'ollama';
        apiKey = localStorage.getItem('dnd_api_key') || '';
        
        if (document.getElementById('apiProvider')) {
            document.getElementById('apiProvider').value = apiProvider;
        }
        if (document.getElementById('apiKey')) {
            document.getElementById('apiKey').value = apiKey;
        }
    }

    async function sendMessage(messages, isInGame = true) {
        const character = window.CharacterModule.getCurrentCharacter();
        const systemPrompt = generateSystemPrompt(character, isInGame);

        switch(apiProvider) {
            case 'ollama':
                return await sendToOllama([
                    { role: 'system', content: systemPrompt },
                    ...messages
                ]);
            case 'claude':
                return await sendToClaude(systemPrompt, messages);
            case 'openai':
                return await sendToOpenAI([
                    { role: 'system', content: systemPrompt },
                    ...messages
                ]);
            default:
                throw new Error('Unknown API provider');
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
        try {
            const response = await fetch(`${ollamaUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3.1:latest',
                    messages: messages,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.message.content;
        } catch (error) {
            throw new Error(`Ollama connection failed: ${error.message}. Make sure Ollama is running locally.`);
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
        sendMessage
    };
})();

window.APIModule = APIModule;
