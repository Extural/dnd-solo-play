// Main Application Module
// Initializes all modules and handles save/load

const App = (function() {
    function init() {
        console.log('D&D Solo Play - Initializing...');
        
        // Initialize all modules
        APIModule.init();
        CharacterModule.init();
        ChatModule.init();
        DiceModule.init();
        InitiativeModule.init();

        // Attach save/load handlers
        document.getElementById('saveGameBtn')?.addEventListener('click', saveGame);
        document.getElementById('loadGameBtn')?.addEventListener('click', loadGame);

        console.log('D&D Solo Play - Ready!');
    }

    function saveGame() {
        const gameState = {
            character: CharacterModule.getCurrentCharacter(),
            timestamp: new Date().toISOString()
        };

        const json = JSON.stringify(gameState, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `dnd-save-${Date.now()}.json`;
        a.click();

        ChatModule.addSystemMessage('Game saved!');
    }

    function loadGame() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const gameState = JSON.parse(event.target.result);
                    CharacterModule.loadCharacter(gameState.character);
                    ChatModule.addSystemMessage('Game loaded!');
                } catch (error) {
                    ChatModule.addSystemMessage(`Error loading: ${error.message}`);
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    return {
        init
    };
})();

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
