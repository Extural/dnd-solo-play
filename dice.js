// Dice Roller Module
// Handles all dice rolling functionality

const DiceModule = (function() {
    function init() {
        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.dice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dice = e.target.dataset.dice;
                if (dice) rollDice(dice);
            });
        });
    }

    function rollDice(notation) {
        const result = parseDiceNotation(notation);
        displayResult(result);
        
        const message = `🎲 Rolled ${notation}: ${result.rolls.join(', ')} = ${result.total}`;
        window.ChatModule?.addRollMessage(message);
    }

    function parseDiceNotation(notation) {
        // Parse notation like "2d6+3" or "1d20"
        const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);
        
        if (!match) {
            return { rolls: [0], total: 0, notation };
        }

        const count = parseInt(match[1]);
        const sides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;

        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(Math.floor(Math.random() * sides) + 1);
        }

        const total = rolls.reduce((a, b) => a + b, 0) + modifier;

        return { rolls, total, modifier, notation };
    }

    function displayResult(result) {
        const resultDiv = document.getElementById('diceResult');
        if (!resultDiv) return;

        let text = `${result.notation}: `;
        text += result.rolls.join(' + ');
        if (result.modifier) {
            text += ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}`;
        }
        text += ` = ${result.total}`;

        resultDiv.textContent = text;
        resultDiv.style.display = 'block';
    }

    return {
        init,
        rollDice
    };
})();

window.DiceModule = DiceModule;
