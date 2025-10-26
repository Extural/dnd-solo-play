// Initiative Tracker Module

const InitiativeModule = (function() {
    let combatants = [];
    let currentTurn = 0;

    function init() {
        attachEventListeners();
    }

    function attachEventListeners() {
        document.getElementById('addCombatantBtn')?.addEventListener('click', addCombatant);
        document.getElementById('nextTurnBtn')?.addEventListener('click', nextTurn);
        document.getElementById('resetInitiativeBtn')?.addEventListener('click', resetInitiative);
    }

    function addCombatant() {
        const name = prompt('Combatant name:');
        const initiative = parseInt(prompt('Initiative roll:')) || 0;

        if (name) {
            combatants.push({ name, initiative });
            combatants.sort((a, b) => b.initiative - a.initiative);
            updateDisplay();
        }
    }

    function nextTurn() {
        if (combatants.length === 0) return;
        currentTurn = (currentTurn + 1) % combatants.length;
        updateDisplay();
    }

    function resetInitiative() {
        combatants = [];
        currentTurn = 0;
        updateDisplay();
    }

    function updateDisplay() {
        const list = document.getElementById('initiativeList');
        if (!list) return;

        list.innerHTML = '';

        combatants.forEach((combatant, index) => {
            const item = document.createElement('li');
            item.className = 'initiative-item';
            if (index === currentTurn) {
                item.classList.add('active');
            }

            item.innerHTML = `
                <span>${combatant.name}</span>
                <span>${combatant.initiative}</span>
            `;

            list.appendChild(item);
        });
    }

    return {
        init
    };
})();

window.InitiativeModule = InitiativeModule;
