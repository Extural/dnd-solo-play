/**
 * Character Module for D&D Solo Play
 * Handles character creation and management
 */

const CharacterModule = (() => {
    // Default character data
    const defaultCharacter = {
        name: '',
        race: '',
        class: '',
        subclass: '',
        level: 1,
        background: '',
        hp: 10,
        maxHp: 10,
        ac: 10,
        proficiencyBonus: 2,
        abilities: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        },
        skills: []
    };
    
    // Current character data
    let characterData = {...defaultCharacter};
    
    /**
     * Initialize the character module
     */
    function init() {
        // Load character from localStorage
        const savedCharacter = localStorage.getItem('dnd-solo-character');
        if (savedCharacter) {
            characterData = JSON.parse(savedCharacter);
        }
        
        // Set up event listeners for character form
        const saveCharacterButton = document.getElementById('saveCharacter');
        if (saveCharacterButton) {
            saveCharacterButton.addEventListener('click', saveCharacter);
        }
        
        const loadCharacterButton = document.getElementById('loadCharacter');
        if (loadCharacterButton) {
            loadCharacterButton.addEventListener('click', loadCharacter);
        }
        
        const resetCharacterButton = document.getElementById('resetCharacter');
        if (resetCharacterButton) {
            resetCharacterButton.addEventListener('click', resetCharacter);
        }
        
        // Set up ability score change listeners
        setupAbilityScoreListeners();
        
        // Update character sheet with current data
        updateCharacterSheet();
        
        console.log('Character Module initialized');
    }
    
    /**
     * Set up ability score change listeners
     */
    function setupAbilityScoreListeners() {
        // Ability score inputs
        const abilityInputs = [
            'strengthScore',
            'dexterityScore',
            'constitutionScore',
            'intelligenceScore',
            'wisdomScore',
            'charismaScore'
        ];
        
        abilityInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', updateAbilityModifiers);
            }
        });
    }
    
    /**
     * Update ability modifiers when scores change
     */
    function updateAbilityModifiers() {
        updateModifier('strength');
        updateModifier('dexterity');
        updateModifier('constitution');
        updateModifier('intelligence');
        updateModifier('wisdom');
        updateModifier('charisma');
    }
    
    /**
     * Update a single ability modifier
     */
    function updateModifier(ability) {
        const scoreInput = document.getElementById(ability + 'Score');
        const modSpan = document.getElementById(ability + 'Mod');
        
        if (scoreInput && modSpan) {
            const score = parseInt(scoreInput.value) || 10;
            const mod = Math.floor((score - 10) / 2);
            const modText = mod >= 0 ? '+' + mod : mod.toString();
            
            modSpan.textContent = '(' + modText + ')';
        }
    }
    
    /**
     * Save character data from form
     */
    function saveCharacter() {
        // Get character details
        if (document.getElementById('characterName')) {
            characterData.name = document.getElementById('characterName').value || '';
        }
        if (document.getElementById('characterRace')) {
            characterData.race = document.getElementById('characterRace').value || '';
        }
        if (document.getElementById('characterClass')) {
            characterData.class = document.getElementById('characterClass').value || '';
        }
        if (document.getElementById('characterSubclass')) {
            characterData.subclass = document.getElementById('characterSubclass').value || '';
        }
        if (document.getElementById('characterLevel')) {
            characterData.level = parseInt(document.getElementById('characterLevel').value) || 1;
        }
        if (document.getElementById('characterBackground')) {
            characterData.background = document.getElementById('characterBackground').value || '';
        }
        
        // Get combat stats
        if (document.getElementById('characterHP')) {
            characterData.hp = parseInt(document.getElementById('characterHP').value) || 10;
        }
        if (document.getElementById('characterMaxHP')) {
            characterData.maxHp = parseInt(document.getElementById('characterMaxHP').value) || 10;
        }
        if (document.getElementById('characterAC')) {
            characterData.ac = parseInt(document.getElementById('characterAC').value) || 10;
        }
        
        // Get ability scores
        if (document.getElementById('strengthScore')) {
            characterData.abilities.strength = parseInt(document.getElementById('strengthScore').value) || 10;
        }
        if (document.getElementById('dexterityScore')) {
            characterData.abilities.dexterity = parseInt(document.getElementById('dexterityScore').value) || 10;
        }
        if (document.getElementById('constitutionScore')) {
            characterData.abilities.constitution = parseInt(document.getElementById('constitutionScore').value) || 10;
        }
        if (document.getElementById('intelligenceScore')) {
            characterData.abilities.intelligence = parseInt(document.getElementById('intelligenceScore').value) || 10;
        }
        if (document.getElementById('wisdomScore')) {
            characterData.abilities.wisdom = parseInt(document.getElementById('wisdomScore').value) || 10;
        }
        if (document.getElementById('charismaScore')) {
            characterData.abilities.charisma = parseInt(document.getElementById('charismaScore').value) || 10;
        }
        
        // Get skills
        characterData.skills = [];
        const skillCheckboxes = document.querySelectorAll('.skill-item input[type="checkbox"]');
        skillCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                characterData.skills.push(checkbox.value);
            }
        });
        
        // Calculate proficiency bonus based on level
        characterData.proficiencyBonus = Math.floor((characterData.level - 1) / 4) + 2;
        
        // Save to localStorage
        localStorage.setItem('dnd-solo-character', JSON.stringify(characterData));
        
        // Show success message
        if (window.UIModule) {
            UIModule.addChatMessage('Character saved successfully!', 'system');
        } else {
            alert('Character saved successfully!');
        }
    }
    
    /**
     * Load character from localStorage
     */
    function loadCharacter() {
        const savedCharacter = localStorage.getItem('dnd-solo-character');
        
        if (savedCharacter) {
            characterData = JSON.parse(savedCharacter);
            updateCharacterSheet();
            
            // Show success message
            if (window.UIModule) {
                UIModule.addChatMessage('Character loaded successfully!', 'system');
            } else {
                alert('Character loaded successfully!');
            }
        } else {
            // Show error message
            if (window.UIModule) {
                UIModule.addChatMessage('No saved character found.', 'system');
            } else {
                alert('No saved character found.');
            }
        }
    }
    
    /**
     * Reset character to default values
     */
    function resetCharacter() {
        characterData = {...defaultCharacter};
        updateCharacterSheet();
        
        // Show success message
        if (window.UIModule) {
            UIModule.addChatMessage('Character reset to default values.', 'system');
        } else {
            alert('Character reset to default values.');
        }
    }
    
    /**
     * Update character sheet form with current data
     */
    function updateCharacterSheet() {
        // Update character details
        if (document.getElementById('characterName')) {
            document.getElementById('characterName').value = characterData.name || '';
        }
        if (document.getElementById('characterRace')) {
            document.getElementById('characterRace').value = characterData.race || '';
        }
        if (document.getElementById('characterClass')) {
            document.getElementById('characterClass').value = characterData.class || '';
        }
        if (document.getElementById('characterSubclass')) {
            document.getElementById('characterSubclass').value = characterData.subclass || '';
        }
        if (document.getElementById('characterLevel')) {
            document.getElementById('characterLevel').value = characterData.level || 1;
        }
        if (document.getElementById('characterBackground')) {
            document.getElementById('characterBackground').value = characterData.background || '';
        }
        
        // Update combat stats
        if (document.getElementById('characterHP')) {
            document.getElementById('characterHP').value = characterData.hp || 10;
        }
        if (document.getElementById('characterMaxHP')) {
            document.getElementById('characterMaxHP').value = characterData.maxHp || 10;
        }
        if (document.getElementById('characterAC')) {
            document.getElementById('characterAC').value = characterData.ac || 10;
        }
        
        // Update ability scores
        if (document.getElementById('strengthScore')) {
            document.getElementById('strengthScore').value = characterData.abilities.strength || 10;
        }
        if (document.getElementById('dexterityScore')) {
            document.getElementById('dexterityScore').value = characterData.abilities.dexterity || 10;
        }
        if (document.getElementById('constitutionScore')) {
            document.getElementById('constitutionScore').value = characterData.abilities.constitution || 10;
        }
        if (document.getElementById('intelligenceScore')) {
            document.getElementById('intelligenceScore').value = characterData.abilities.intelligence || 10;
        }
        if (document.getElementById('wisdomScore')) {
            document.getElementById('wisdomScore').value = characterData.abilities.wisdom || 10;
        }
        if (document.getElementById('charismaScore')) {
            document.getElementById('charismaScore').value = characterData.abilities.charisma || 10;
        }
        
        // Update ability modifiers
        updateAbilityModifiers();
        
        // Update skills
        const skillCheckboxes = document.querySelectorAll('.skill-item input[type="checkbox"]');
        skillCheckboxes.forEach(checkbox => {
            checkbox.checked = characterData.skills.includes(checkbox.value);
        });
    }
    
    /**
     * Get current character data
     */
    function getCharacterData() {
        return {...characterData};
    }
    
    // Public API
    return {
        init,
        saveCharacter,
        loadCharacter,
        resetCharacter,
        getCharacterData
    };
})();

// Export the module
window.CharacterModule = CharacterModule;
