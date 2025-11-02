/**
 * UI Module for D&D Solo Play
 * Handles UI interactions and animations
 */

const UIModule = (() => {
    // UI state
    let currentPanel = null;
    
    /**
     * Initialize the UI module
     */
    function init() {
        // Set up panel toggle buttons
        document.getElementById('toggleCharacterSheet').addEventListener('click', () => togglePanel('characterSheet'));
        document.getElementById('toggleDice').addEventListener('click', () => togglePanel('diceRoller'));
        document.getElementById('toggleSettings').addEventListener('click', () => togglePanel('settings'));
        document.getElementById('toggleInitiative').addEventListener('click', () => togglePanel('initiative'));
        
        // Initially show the character sheet
        togglePanel('characterSheet');
        
        // Set up theme handling
        document.getElementById('themeSelector').addEventListener('change', updateTheme);
        document.getElementById('fontSizeSelector').addEventListener('change', updateFontSize);
        
        // Initialize theme from localStorage or default
        initializeTheme();
        
        console.log('UI Module initialized');
    }
    
    /**
     * Toggle panel visibility
     */
    function togglePanel(panelId) {
        // Hide current panel if it exists
        if (currentPanel) {
            document.getElementById(currentPanel).classList.remove('active');
            document.getElementById('toggle' + currentPanel.charAt(0).toUpperCase() + currentPanel.slice(1)).classList.remove('active');
        }
        
        // Show new panel
        document.getElementById(panelId).classList.add('active');
        document.getElementById('toggle' + panelId.charAt(0).toUpperCase() + panelId.slice(1)).classList.add('active');
        
        // Update current panel
        currentPanel = panelId;
    }
    
    /**
     * Initialize theme from localStorage
     */
    function initializeTheme() {
        // Load theme preference
        const savedTheme = localStorage.getItem('dnd-solo-theme') || 'light';
        document.getElementById('themeSelector').value = savedTheme;
        updateTheme();
        
        // Load font size preference
        const savedFontSize = localStorage.getItem('dnd-solo-font-size') || 'medium';
        document.getElementById('fontSizeSelector').value = savedFontSize;
        updateFontSize();
    }
    
    /**
     * Update theme based on selector
     */
    function updateTheme() {
        const theme = document.getElementById('themeSelector').value;
        
        // Remove existing theme classes
        document.body.classList.remove('light-theme', 'dark-theme', 'fantasy-theme');
        
        // Add new theme class
        document.body.classList.add(theme + '-theme');
        
        // Save theme preference
        localStorage.setItem('dnd-solo-theme', theme);
    }
    
    /**
     * Update font size based on selector
     */
    function updateFontSize() {
        const fontSize = document.getElementById('fontSizeSelector').value;
        
        // Remove existing font size classes
        document.body.classList.remove('small-font', 'medium-font', 'large-font');
        
        // Add new font size class
        document.body.classList.add(fontSize + '-font');
        
        // Save font size preference
        localStorage.setItem('dnd-solo-font-size', fontSize);
    }
    
    /**
     * Add a message to the chat
     */
    function addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender + '-message');
        
        // Use markdown to format the message
        const formattedMessage = formatMarkdown(message);
        messageElement.innerHTML = formattedMessage;
        
        // Add to chat
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    /**
     * Simple markdown formatting
     */
    function formatMarkdown(text) {
        // Bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Line breaks
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
    
    /**
     * Show loading indicator
     */
    function showLoading() {
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('loading-indicator');
        loadingElement.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loadingElement);
    }
    
    /**
     * Hide loading indicator
     */
    function hideLoading() {
        const loadingElement = document.querySelector('.loading-indicator');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    // Public API
    return {
        init,
        togglePanel,
        addChatMessage,
        showLoading,
        hideLoading
    };
})();

// Export the module
window.UIModule = UIModule;
