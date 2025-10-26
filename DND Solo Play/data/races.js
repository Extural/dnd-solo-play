// D&D 2024 Species/Races Data
// Note: In 2024 rules, ability score increases come from BACKGROUNDS, not species

const DND_RACES = {
    human: {
        name: "Human",
        size: "Medium",
        speed: 30,
        traits: [
            "Resourceful: You gain Inspiration whenever you finish a Long Rest",
            "Skillful: You gain proficiency in one skill of your choice",
            "Versatile: You gain an Origin feat of your choice"
        ]
    },
    
    dwarf: {
        name: "Dwarf",
        size: "Medium",
        speed: 30,
        traits: [
            "Darkvision: 120 feet",
            "Dwarven Resilience: Resistance to Poison damage, Advantage on saves vs Poisoned",
            "Dwarven Toughness: Hit Point maximum increases by 1 per level",
            "Stonecunning: Advantage on Investigation and History checks related to stonework"
        ]
    },
    
    elf: {
        name: "Elf",
        size: "Medium",
        speed: 30,
        traits: [
            "Darkvision: 60 feet",
            "Elven Lineage: Choose High Elf, Wood Elf, or Drow heritage",
            "Fey Ancestry: Advantage on saves to avoid or end Charmed condition",
            "Keen Senses: Proficiency in Perception",
            "Trance: Meditate 4 hours instead of sleep"
        ]
    },
    
    halfling: {
        name: "Halfling",
        size: "Small",
        speed: 30,
        traits: [
            "Brave: Advantage on saves to avoid or end Frightened condition",
            "Halfling Nimbleness: Move through space of Medium or larger creatures",
            "Lucky: Reroll 1 on d20 roll (attack, check, save)",
            "Naturally Stealthy: Can Hide behind Medium or larger creature"
        ]
    },
    
    dragonborn: {
        name: "Dragonborn",
        size: "Medium",
        speed: 30,
        traits: [
            "Draconic Ancestry: Choose a dragon type (determines breath weapon and resistance)",
            "Breath Weapon: Exhale destructive energy",
            "Damage Resistance: Resistance to damage type associated with ancestry"
        ]
    },
    
    gnome: {
        name: "Gnome",
        size: "Small",
        speed: 30,
        traits: [
            "Darkvision: 60 feet",
            "Gnome Cunning: Advantage on Intelligence, Wisdom, and Charisma saves vs magic"
        ]
    },
    
    half_elf: {
        name: "Half-Elf",
        size: "Medium",
        speed: 30,
        traits: [
            "Darkvision: 60 feet",
            "Fey Ancestry: Advantage on saves to avoid or end Charmed condition",
            "Versatile: Gain one Origin feat of your choice"
        ]
    },
    
    half_orc: {
        name: "Half-Orc",
        size: "Medium",
        speed: 30,
        traits: [
            "Darkvision: 60 feet",
            "Adrenaline Rush: Dash as Bonus Action, gain temp HP (Prof Bonus times per Long Rest)",
            "Relentless Endurance: Drop to 1 HP instead of 0 (once per Long Rest)"
        ]
    },
    
    tiefling: {
        name: "Tiefling",
        size: "Medium",
        speed: 30,
        traits: [
            "Darkvision: 60 feet",
            "Fiendish Legacy: Choose Abyssal, Chthonic, or Infernal heritage",
            "Otherworldly Presence: Advantage on Intimidation or Persuasion checks (choose one)"
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DND_RACES;
}
