/**
 * Simplified API Module for D&D Solo Play
 * Using a mock response for demo purposes
 */

const APIModule = (() => {
    // Configuration
    let config = {
        provider: 'demo',
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
        
        console.log('Demo API Module initialized');
    }

    /**
     * Send a message to the AI
     * In demo mode, this returns predefined responses
     */
    async function sendMessage(message, characterData = {}) {
        // Add user message to history
        messageHistory.push({role: "user", content: message});
        
        // Prune history to avoid token limits
        if (messageHistory.length > 20) {
            messageHistory = messageHistory.slice(-20);
        }
        
        try {
            // Generate a response based on the message content
            const response = generateDemoResponse(message, characterData);
            
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
     * Generate a demo response based on the message content
     */
    function generateDemoResponse(message, characterData) {
        const name = characterData.name || 'adventurer';
        const race = characterData.race || 'human';
        const className = characterData.class || 'fighter';
        
        // Check if the message is about starting an adventure
        if (message.toLowerCase().includes('start') && message.toLowerCase().includes('adventure')) {
            return `Welcome, brave ${name} the ${race} ${className}! 

The small village of Oakbrook sits nestled between the ancient forest of Whispering Pines and the towering Granite Mountains. As you arrive at the village square, you notice an unusual commotion. Villagers gather around a bulletin board where an elderly man in fine robes is posting a notice.

The village elder, Gareth Timbers, spots you and recognizes you as an adventurer by your equipment and bearing. He approaches with a worried expression.

"Thank the gods, an adventurer in our time of need! Strange lights have been seen in the ruins on Barrow Hill, and three children have gone missing. The village council is offering a reward of 100 gold pieces for anyone who can find them and bring them home safely. Will you help us?"

What would you like to do?`;
        }
        
        // Check if it's a greeting
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi ')) {
            return `Greetings, ${name}! How may I assist you in your adventure today?`;
        }
        
        // Check if it mentions combat
        if (message.toLowerCase().includes('attack') || message.toLowerCase().includes('fight') || message.toLowerCase().includes('combat')) {
            return `As you prepare for combat, roll for initiative!

You notice your opponent - a grizzled bandit with a scarred face and a sharp blade. He smirks at you, twirling his dagger. "Another hero thinks they can best me? Let's see what you're made of!"

Make a Dexterity (Initiative) check to determine turn order.`;
        }
        
        // Check if it mentions exploration
        if (message.toLowerCase().includes('explore') || message.toLowerCase().includes('search') || message.toLowerCase().includes('look')) {
            return `You carefully survey your surroundings.

The path ahead splits into three directions. To the north, a narrow trail winds up into the misty mountains. To the east, you see the dense treeline of an ancient forest with twisted oaks and thick underbrush. To the west, the path descends toward what appears to be a small settlement in the valley below.

Make a DC 12 Wisdom (Perception) check if you want to search for any hidden paths or signs of recent activity.`;
        }
        
        // Default response
        return `The world of adventure stretches before you, ${name}. What would you like to do next? You could explore the nearby area, talk to locals for information, or set out on your quest.

Remember, as your Dungeon Master, I'm here to describe the world around you and the consequences of your actions. Just tell me what you want to do, and we'll continue our story together.`;
    }

    /**
     * Create the system message for the DM
     */
    function createDMSystemMessage(characterData) {
        // Create a detailed system prompt for the AI
        let systemMessage = `You are an expert Dungeon Master for a solo D&D 5e adventure. 
Your goal is to provide an immersive, engaging, and balanced game experience.`;

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
        const adventurePrompt = `I want to play D&D 5e solo. Let's start an adventure!`;
        
        // Get the AI's response
        const response = await sendMessage(adventurePrompt, characterData);
        
        return response;
    }

    /**
     * Test connection - always succeeds in demo mode
     */
    function testConnection() {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = 'Connected (Demo Mode)';
            statusElement.className = 'status-connected';
        }
        isConnected = true;
        return true;
    }
    
    /**
     * Update connection status
     */
    function updateConnectionStatus(status) {
        isConnected = true;
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
