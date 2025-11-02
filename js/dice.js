/**
 * Dice Module for D&D Solo Play
 * Handles dice rolling functionality
 */

const DiceModule = (() => {
    // Maximum number of dice rolls to display
    const MAX_ROLL_HISTORY = 10;
    
    // Roll history
    let rollHistory = [];
    
    /**
     * Initialize the dice module
     */
    function init() {
        // Set up dice buttons
        const diceButtons = document.querySelectorAll('.dice-btn');
        diceButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', function() {
                    const diceType = this.getAttribute('data-dice');
                    rollDice(diceType);
                });
            }
        });
        
        // Set up clear button
        const clearButton = document.getElementById('clearRolls');
        if (clearButton) {
            clearButton.addEventListener('click', clearRollHistory);
        }
        
        console.log('Dice Module initialized');
    }
    
    /**
     * Roll dice and display results
     */
    function rollDice(diceType) {
        // Get number of dice and modifier
        const diceCount = parseInt(document.getElementById('diceCount')?.value || 1);
        const modifier = parseInt(document.getElementById('diceModifier')?.value || 0);
        
        // Determine max value based on dice type
        let maxValue = 6;
        switch (diceType) {
            case 'd4': maxValue = 4; break;
            case 'd6': maxValue = 6; break;
            case 'd8': maxValue = 8; break;
            case 'd10': maxValue = 10; break;
            case 'd12': maxValue = 12; break;
            case 'd20': maxValue = 20; break;
            case 'd100': maxValue = 100; break;
        }
        
        // Roll the dice
        const rolls = [];
        let total = 0;
        
        for (let i = 0; i < diceCount; i++) {
            const roll = Math.floor(Math.random() * maxValue) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        // Add modifier
        total += modifier;
        
        // Create roll result text
        let rollText = `${diceCount}${diceType}`;
        if (modifier !== 0) {
            rollText += modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
        }
        rollText += ` = ${total}`;
        
        if (diceCount > 1 || modifier !== 0) {
            rollText += ` (${rolls.join(', ')})`;
        }
        
        // Add to roll history
        addRollToHistory(rollText);
        
        // Play dice sound
        playDiceSound();
        
        return total;
    }
    
    /**
     * Add roll to history
     */
    function addRollToHistory(rollText) {
        // Add to front of array
        rollHistory.unshift(rollText);
        
        // Limit size of history
        if (rollHistory.length > MAX_ROLL_HISTORY) {
            rollHistory = rollHistory.slice(0, MAX_ROLL_HISTORY);
        }
        
        // Update display
        updateRollHistoryDisplay();
    }
    
    /**
     * Update roll history display
     */
    function updateRollHistoryDisplay() {
        const rollResultsElement = document.getElementById('rollResults');
        if (!rollResultsElement) return;
        
        rollResultsElement.innerHTML = '';
        
        rollHistory.forEach(rollText => {
            const rollElement = document.createElement('div');
            rollElement.classList.add('roll-result');
            rollElement.textContent = rollText;
            rollResultsElement.appendChild(rollElement);
        });
    }
    
    /**
     * Clear roll history
     */
    function clearRollHistory() {
        rollHistory = [];
        updateRollHistoryDisplay();
    }
    
    /**
     * Play dice rolling sound
     */
    function playDiceSound() {
        // Check if sound is enabled
        const soundEnabled = document.getElementById('soundToggle')?.checked ?? true;
        
        if (soundEnabled) {
            // If you have a sound file, you could play it here
            // For now, just log a message
            console.log('Dice sound played');
        }
    }
    
    /**
     * Roll dice with a specific formula
     * Example: rollFormula('2d6 + 3')
     */
    function rollFormula(formula) {
        // Simple formula parser
        const regex = /(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/i;
        const match = formula.match(regex);
        
        if (match) {
            const count = parseInt(match[1]);
            const sides = parseInt(match[2]);
            const operator = match[3] || '+';
            const modifier = parseInt(match[4] || 0);
            
            // Roll the dice
            let total = 0;
            const rolls = [];
            
            for (let i = 0; i < count; i++) {
                const roll = Math.floor(Math.random() * sides) + 1;
                rolls.push(roll);
                total += roll;
            }
            
            // Apply modifier
            if (operator === '+') {
                total += modifier;
            } else {
                total -= modifier;
            }
            
            // Create roll result text
            let rollText = `${count}d${sides}`;
            if (modifier !== 0) {
                rollText += ` ${operator} ${modifier}`;
            }
            rollText += ` = ${total}`;
            
            if (count > 1 || modifier !== 0) {
                rollText += ` (${rolls.join(', ')})`;
            }
            
            // Add to roll history
            addRollToHistory(rollText);
            
            // Play dice sound
            playDiceSound();
            
            return total;
        }
        
        return null;
    }
    
    // Public API
    return {
        init,
        rollDice,
        rollFormula,
        clearRollHistory
    };
})();

// Export the module
window.DiceModule = DiceModule;
