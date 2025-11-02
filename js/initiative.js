/**
 * Initiative Module for D&D Solo Play
 * Handles combat initiative tracking
 */

const InitiativeModule = (() => {
    // List of combatants with initiative
    let combatants = [];
    let currentTurn = 0;
    let inCombat = false;
    
    /**
     * Initialize the initiative module
     */
    function init() {
        // Set up event listeners
        const addCombatantButton = document.getElementById('addCombatant');
        if (addCombatantButton) {
            addCombatantButton.addEventListener('click', addCombatant);
        }
        
        const nextTurnButton = document.getElementById('nextTurn');
        if (nextTurnButton) {
            nextTurnButton.addEventListener('click', nextTurn);
        }
        
        const resetCombatButton = document.getElementById('resetCombat');
        if (resetCombatButton) {
            resetCombatButton.addEventListener('click', resetCombat);
        }
        
        console.log('Initiative Module initialized');
    }
    
    /**
     * Add a combatant to the initiative order
     */
    function addCombatant() {
        const nameInput = document.getElementById('combatantName');
        const initiativeInput = document.getElementById('initiativeRoll');
        
        if (!nameInput || !initiativeInput) return;
        
        const name = nameInput.value.trim();
        const initiative = parseInt(initiativeInput.value);
        
        if (name === '' || isNaN(initiative)) {
            alert('Please enter a name and initiative roll.');
            return;
        }
        
        // Create combatant object
        const combatant = {
            name: name,
            initiative: initiative,
            isPlayerCharacter: name.toLowerCase() === 'player' || name.toLowerCase() === document.getElementById('characterName')?.value.toLowerCase()
        };
        
        // Add to list
        combatants.push(combatant);
        
        // Sort by initiative (highest first)
        combatants.sort((a, b) => b.initiative - a.initiative);
        
        // Start combat if not already in combat
        if (!inCombat) {
            inCombat = true;
            currentTurn = 0;
        }
        
        // Update display
        updateInitiativeDisplay();
        
        // Clear inputs
        nameInput.value = '';
        initiativeInput.value = '';
    }
    
    /**
     * Move to the next turn
     */
    function nextTurn() {
        if (combatants.length === 0) return;
        
        currentTurn = (currentTurn + 1) % combatants.length;
        updateInitiativeDisplay();
        
        // Announce turn in chat
        if (window.UIModule) {
            UIModule.addChatMessage(`It's now ${combatants[currentTurn].name}'s turn!`, 'system');
        }
    }
    
    /**
     * Reset the combat tracker
     */
    function resetCombat() {
        combatants = [];
        currentTurn = 0;
        inCombat = false;
        updateInitiativeDisplay();
        
        // Announce end of combat in chat
        if (window.UIModule) {
            UIModule.addChatMessage('Combat has ended.', 'system');
        }
    }
    
    /**
     * Remove a specific combatant
     */
    function removeCombatant(index) {
        combatants.splice(index, 1);
        
        // Adjust current turn if needed
        if (combatants.length === 0) {
            inCombat = false;
            currentTurn = 0;
        } else if (index <= currentTurn) {
            currentTurn = Math.max(0, currentTurn - 1);
        }
        
        updateInitiativeDisplay();
    }
    
    /**
     * Update the initiative display
     */
    function updateInitiativeDisplay() {
        const initiativeList = document.getElementById('initiativeList');
        if (!initiativeList) return;
        
        initiativeList.innerHTML = '';
        
        combatants.forEach((combatant, index) => {
            const combatantElement = document.createElement('div');
            combatantElement.classList.add('combatant');
            
            if (index === currentTurn && inCombat) {
                combatantElement.classList.add('active-turn');
            }
            
            if (combatant.isPlayerCharacter) {
                combatantElement.classList.add('player-character');
            }
            
            combatantElement.innerHTML = `
                <div class="initiative-roll">${combatant.initiative}</div>
                <div class="combatant-name">${combatant.name}</div>
                <button class="remove-combatant">×</button>
            `;
            
            const removeButton = combatantElement.querySelector('.remove-combatant');
            removeButton.addEventListener('click', () => removeCombatant(index));
            
            initiativeList.appendChild(combatantElement);
        });
        
        // Update UI based on combat state
        const nextTurnButton = document.getElementById('nextTurn');
        if (nextTurnButton) {
            nextTurnButton.disabled = !inCombat || combatants.length <= 1;
        }
    }
    
    /**
     * Roll initiative for the player character
     */
    function rollPlayerInitiative() {
        // Get character data
        const characterData = window.CharacterModule ? CharacterModule.getCharacterData() : {};
        const dexMod = Math.floor((characterData.abilities?.dexterity || 10) - 10) / 2;
        
        // Roll initiative (d20 + dex mod)
        const initiativeRoll = Math.floor(Math.random() * 20) + 1 + dexMod;
        
        // Add player to combat
        document.getElementById('combatantName').value = characterData.name || 'Player';
        document.getElementById('initiativeRoll').value = initiativeRoll;
        addCombatant();
        
        return initiativeRoll;
    }
    
    // Public API
    return {
        init,
        addCombatant,
        nextTurn,
        resetCombat,
        rollPlayerInitiative
    };
})();

// Export the module
window.InitiativeModule = InitiativeModule;
