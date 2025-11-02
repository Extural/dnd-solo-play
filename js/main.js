/**
 * Main script for D&D Solo Play
 * Initializes all modules and sets up event listeners
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    if (window.CharacterModule) CharacterModule.init();
    if (window.DiceModule) DiceModule.init();
    if (window.InitiativeModule) InitiativeModule.init();
    if (window.APIModule) APIModule.init();
    if (window.UIModule) UIModule.init();
    
    // Set up message input
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    // Send message on button click
    sendButton.addEventListener('click', function() {
        sendMessage();
    });
    
    // Send message on Enter key (but allow Shift+Enter for new line)
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
    
    /**
     * Send a message to the AI and display the response
     */
    async function sendMessage() {
        const message = messageInput.value.trim();
        
        if (message === '') return;
        
        // Display user message
        UIModule.addChatMessage(message, 'user');
        
        // Clear input
        messageInput.value = '';
        
        // Show loading indicator
        UIModule.showLoading();
        
        // Get character data
        const characterData = window.CharacterModule ? CharacterModule.getCharacterData() : {};
        
        try {
            // Get AI response
            const response = await APIModule.sendMessage(message, characterData);
            
            // Display AI response
            UIModule.addChatMessage(response, 'ai');
        } catch (error) {
            console.error('Error getting AI response:', error);
            UIModule.addChatMessage('⚠️ Error: ' + error.message, 'system');
        } finally {
            // Hide loading indicator
            UIModule.hideLoading();
        }
    }
    
    // Add welcome message
    setTimeout(function() {
        UIModule.addChatMessage('Welcome to D&D Solo Play! I\'ll be your AI Dungeon Master. Create a character using the Character panel, then tell me what kind of adventure you\'d like to have!', 'system');
    }, 500);
});
