// Character Management Module
// Handles character sheet, character creation wizard, and ability score calculations

const CharacterModule = (function() {
    let currentCharacter = {
        name: '',
        race: '',
        class: '',
        subclass: '',
        level: 1,
        background: '',
        abilities: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        },
        hp: 0,
        maxHp: 0,
        ac: 10,
        proficiencyBonus: 2,
        skills: []
    };

    let currentStep = 1;
    const totalSteps = 5;

    // Initialize character module
    function init() {
        attachEventListeners();
        updateCharacterSheet();
    }

    // Attach event listeners
    function attachEventListeners() {
        // Create Character button
        document.getElementById('createCharacterBtn')?.addEventListener('click', openCharacterCreator);
        
        // Character sheet quick rolls
        document.querySelectorAll('.quick-roll-btn').forEach(btn => {
            btn.addEventListener('click', handleQuickRoll);
        });
        
        // Character sheet input changes
        document.getElementById('charName')?.addEventListener('change', (e) => {
            currentCharacter.name = e.target.value;
        });
        
        // Ability score changes
        ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
            document.getElementById(ability)?.addEventListener('change', (e) => {
                currentCharacter.abilities[ability] = parseInt(e.target.value) || 10;
                updateModifiers();
            });
        });
    }

    // Open character creation wizard
    function openCharacterCreator() {
        currentStep = 1;
        showStep(1);
        document.getElementById('charCreationModal').classList.add('active');
    }

    // Close character creation wizard
    function closeCharacterCreator() {
        document.getElementById('charCreationModal').classList.remove('active');
    }

    // Show specific step in wizard
    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.creation-step').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show current step
        document.getElementById(`step${step}`)?.classList.add('active');
        currentStep = step;
    }

    // Navigate to next step
    function nextStep() {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) {
                showStep(currentStep + 1);
            }
        }
    }

    // Navigate to previous step
    function prevStep() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }

    // Validate current step
    function validateStep(step) {
        switch(step) {
            case 1:
                const race = document.getElementById('creationRace')?.value;
                const cls = document.getElementById('creationClass')?.value;
                const bg = document.getElementById('creationBackground')?.value;
                return race && cls && bg;
            case 2:
                // Check if abilities are rolled
                const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
                return abilities.every(ability => {
                    const value = parseInt(document.getElementById(`rolled${ability.charAt(0).toUpperCase() + ability.slice(1)}`)?.textContent || '0');
                    return value >= 3;
                });
            case 3:
                return parseInt(document.getElementById('rolledHP')?.textContent || '0') > 0;
            default:
                return true;
        }
    }

    // Roll ability score (4d6 drop lowest, reroll 1s and 2s)
    function rollAbility() {
        let dice = [];
        for (let i = 0; i < 4; i++) {
            let roll = Math.floor(Math.random() * 6) + 1;
            // Reroll 1s and 2s (heroic method)
            while (roll <= 2) {
                roll = Math.floor(Math.random() * 6) + 1;
            }
            dice.push(roll);
        }
        
        // Sort and drop lowest
        dice.sort((a, b) => b - a);
        const dropped = dice.pop();
        const total = dice.reduce((a, b) => a + b, 0);
        
        return {
            total,
            dice,
            dropped
        };
    }

    // Roll single ability
    function rollSingleAbility(ability) {
        const result = rollAbility();
        const capitalizedAbility = ability.charAt(0).toUpperCase() + ability.slice(1);
        
        document.getElementById(`rolled${capitalizedAbility}`).textContent = result.total;
        document.getElementById(`rolled${capitalizedAbility}Details`).textContent = 
            `Rolled: ${result.dice.join(', ')} (dropped ${result.dropped})`;
    }

    // Roll all abilities at once
    function rollAllAbilities() {
        ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
            rollSingleAbility(ability);
        });
    }

    // Roll hit points
    function rollHitPoints() {
        const cls = document.getElementById('creationClass')?.value;
        const level = parseInt(document.getElementById('creationLevel')?.value) || 1;
        const con = parseInt(document.getElementById('rolledConstitution')?.textContent) || 10;
        const conMod = Math.floor((con - 10) / 2);
        
        if (!cls) return;
        
        const classData = DND_CLASSES[cls];
        const hitDie = classData.hitDie;
        
        let hp = 0;
        
        // Level 1: Max HP
        if (level === 1) {
            hp = hitDie + conMod;
        } else {
            // Level 1 max
            hp = hitDie + conMod;
            
            // Roll for additional levels
            for (let i = 2; i <= level; i++) {
                const roll = Math.floor(Math.random() * hitDie) + 1;
                hp += roll + conMod;
            }
        }
        
        document.getElementById('rolledHP').textContent = hp;
    }

    // Finalize character creation
    function finalizeCharacter() {
        // Get values from creation wizard
        currentCharacter.race = document.getElementById('creationRace')?.value || '';
        currentCharacter.class = document.getElementById('creationClass')?.value || '';
        currentCharacter.subclass = document.getElementById('creationSubclass')?.value || '';
        currentCharacter.level = parseInt(document.getElementById('creationLevel')?.value) || 1;
        currentCharacter.background = document.getElementById('creationBackground')?.value || '';
        currentCharacter.name = document.getElementById('creationName')?.value || 'Adventurer';
        
        // Get rolled abilities
        ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
            const capitalizedAbility = ability.charAt(0).toUpperCase() + ability.slice(1);
            const value = parseInt(document.getElementById(`rolled${capitalizedAbility}`)?.textContent) || 10;
            currentCharacter.abilities[ability] = value;
        });
        
        // Get HP
        currentCharacter.maxHp = parseInt(document.getElementById('rolledHP')?.textContent) || 1;
        currentCharacter.hp = currentCharacter.maxHp;
        
        // Calculate AC (base 10 + DEX modifier)
        const dexMod = Math.floor((currentCharacter.abilities.dexterity - 10) / 2);
        currentCharacter.ac = 10 + dexMod;
        
        // Calculate proficiency bonus
        currentCharacter.proficiencyBonus = Math.ceil(currentCharacter.level / 4) + 1;
        
        // Get selected skills
        const selectedSkills = [];
        document.querySelectorAll('input[name="creationSkills"]:checked').forEach(checkbox => {
            selectedSkills.push(checkbox.value);
        });
        currentCharacter.skills = selectedSkills;
        
        // Update character sheet
        updateCharacterSheet();
        
        // Close wizard
        closeCharacterCreator();
        
        // Notify user
        if (window.ChatModule) {
            window.ChatModule.addSystemMessage(`Character created: ${currentCharacter.name}, Level ${currentCharacter.level} ${currentCharacter.race} ${currentCharacter.class}`);
        }
    }

    // Update character sheet display
    function updateCharacterSheet() {
        // Update basic info
        document.getElementById('charName').value = currentCharacter.name;
        document.getElementById('charRace').value = currentCharacter.race;
        document.getElementById('charClass').value = currentCharacter.class;
        document.getElementById('charLevel').value = currentCharacter.level;
        
        // Update abilities
        Object.keys(currentCharacter.abilities).forEach(ability => {
            document.getElementById(ability).value = currentCharacter.abilities[ability];
        });
        
        // Update HP and AC
        document.getElementById('hp').value = currentCharacter.hp;
        document.getElementById('maxHp').value = currentCharacter.maxHp;
        document.getElementById('ac').value = currentCharacter.ac;
        
        // Update modifiers
        updateModifiers();
    }

    // Update ability modifiers display
    function updateModifiers() {
        ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
            const score = currentCharacter.abilities[ability];
            const modifier = Math.floor((score - 10) / 2);
            const modText = modifier >= 0 ? `+${modifier}` : modifier;
            
            const modElement = document.getElementById(`${ability}Mod`);
            if (modElement) {
                modElement.textContent = modText;
            }
        });
    }

    // Handle quick roll buttons
    function handleQuickRoll(event) {
        const ability = event.target.dataset.ability;
        if (!ability) return;
        
        const score = currentCharacter.abilities[ability];
        const modifier = Math.floor((score - 10) / 2);
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + modifier;
        
        const abilityName = ability.charAt(0).toUpperCase() + ability.slice(1).substring(0, 3).toUpperCase();
        const message = `🎲 ${abilityName} ${modifier >= 0 ? '+' : ''}${modifier}: ${roll} + ${modifier} = ${total}`;
        
        if (window.ChatModule) {
            window.ChatModule.addRollMessage(message);
        }
    }

    // Get current character
    function getCurrentCharacter() {
        return currentCharacter;
    }

    // Load character from save data
    function loadCharacter(data) {
        currentCharacter = { ...currentCharacter, ...data };
        updateCharacterSheet();
    }

    // Public API
    return {
        init,
        openCharacterCreator,
        closeCharacterCreator,
        nextStep,
        prevStep,
        rollSingleAbility,
        rollAllAbilities,
        rollHitPoints,
        finalizeCharacter,
        getCurrentCharacter,
        loadCharacter,
        updateCharacterSheet
    };
})();

// Make available globally
window.CharacterModule = CharacterModule;
