/**
 * Simplified API Module for D&D Solo Play
 */

const APIModule = (() => {
    // Configuration
    let config = {
        provider: 'claude',
        maxTokens: 4000,
        temperature: 0.7,
        tokenEstimate: 0,
        totalSpent: 0
    };

    // Message history
    let messageHistory = [];
    let isConnected = true;
    let lastResponse = '';

    /**
     * Initialize the API module
     */
    function init() {
        // Load message history from localStorage
        const savedHistory = localStorage.getItem('dnd-solo-message-history');
        if (savedHistory) {
            messageHistory = JSON.parse(savedHistory);
        }
        
        // Update connection status display if it exists
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = 'Connected (Proxy)';
            statusElement.className = 'status-connected';
        }
        
        console.log('API Module initialized with Claude proxy');
    }

    /**
     * Send a message to the AI
     */
    async function sendMessage(message, characterData = {}) {
        // Add user message to history
        messageHistory.push({role: "user", content: message});
        
        // Prune history to avoid token limits
        if (messageHistory.length > 20) {
            messageHistory = messageHistory.slice(-20);
        }
        
        // Create system message based on character data
        const systemMessage = createDMSystemMessage(characterData);
        
        try {
            // Format messages for Claude API
            const formattedMessages = [
                {role: "system", content: systemMessage}
            ];
            
            // Add message history
            messageHistory.forEach(msg => {
                formattedMessages.push({
                    role: msg.role,
                    content: msg.content
                });
            });
            
            // Call the Vercel proxy - UPDATED to newest URL
            const claudeResponse = await fetch('https://dnd-claude-proxy-xe504k5xk-exturals-projects.vercel.app/api/claude', {
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
            
            const response = claudeData.content[0].text;
            
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

    // Functions that need to exist but don't do much in this simplified version
    function testConnection() {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = 'Connected (Proxy)';
            statusElement.className = 'status-connected';
        }
        isConnected = true;
        return true;
    }
    
    function updateConnectionStatus(status) {
        isConnected = true;
    }
    
    function getConfig() {
        return {...config};
    }

    // Public API - must match original
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
