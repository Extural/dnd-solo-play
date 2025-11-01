// D&D 2024 Character Classes Data
// Extracted from Player's Handbook 2024 - Chapter 3

const DND_CLASSES = {
    barbarian: {
        name: "Barbarian",
        primaryAbility: "Strength",
        hitDie: 12,
        savingThrows: ["Strength", "Constitution"],
        skillChoices: 2,
        skillList: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
        armorProficiency: ["Light Armor", "Medium Armor", "Shields"],
        weaponProficiency: ["Simple Weapons", "Martial Weapons"],
        subclasses: [
            { id: "berserker", name: "Path of the Berserker", description: "Unleash raw violence" },
            { id: "wild_heart", name: "Path of the Wild Heart", description: "Manifest kinship with animals" },
            { id: "world_tree", name: "Path of the World Tree", description: "Tap into cosmic vitality" },
            { id: "zealot", name: "Path of the Zealot", description: "Rage in union with a god" }
        ]
    },
    
    bard: {
        name: "Bard",
        primaryAbility: "Charisma",
        hitDie: 8,
        savingThrows: ["Dexterity", "Charisma"],
        skillChoices: 3,
        skillList: ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"],
        armorProficiency: ["Light Armor"],
        weaponProficiency: ["Simple Weapons"],
        subclasses: [
            { id: "dance", name: "College of Dance", description: "Harness agility in battle" },
            { id: "glamour", name: "College of Glamour", description: "Weave beguiling Feywild magic" },
            { id: "lore", name: "College of Lore", description: "Collect knowledge and magical secrets" },
            { id: "valor", name: "College of Valor", description: "Wield weapons with spells" }
        ]
    },
    
    cleric: {
        name: "Cleric",
        primaryAbility: "Wisdom",
        hitDie: 8,
        savingThrows: ["Wisdom", "Charisma"],
        skillChoices: 2,
        skillList: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
        armorProficiency: ["Light Armor", "Medium Armor", "Shields"],
        weaponProficiency: ["Simple Weapons"],
        subclasses: [
            { id: "life", name: "Life Domain", description: "Master of healing" },
            { id: "light", name: "Light Domain", description: "Wield searing, warding light" },
            { id: "trickery", name: "Trickery Domain", description: "Bedevil foes with mischief" },
            { id: "war", name: "War Domain", description: "Inspire valor and chastise foes" }
        ]
    },
    
    druid: {
        name: "Druid",
        primaryAbility: "Wisdom",
        hitDie: 8,
        savingThrows: ["Intelligence", "Wisdom"],
        skillChoices: 2,
        skillList: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
        armorProficiency: ["Light Armor", "Medium Armor", "Shields"],
        weaponProficiency: ["Simple Weapons"],
        subclasses: [
            { id: "land", name: "Circle of the Land", description: "Draw on the magic of the environment" },
            { id: "moon", name: "Circle of the Moon", description: "Adopt powerful animal forms" },
            { id: "sea", name: "Circle of the Sea", description: "Channel tides and storms" },
            { id: "stars", name: "Circle of the Stars", description: "Gain powers in a starry form" }
        ]
    },
    
    fighter: {
        name: "Fighter",
        primaryAbility: "Strength or Dexterity",
        hitDie: 10,
        savingThrows: ["Strength", "Constitution"],
        skillChoices: 2,
        skillList: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"],
        armorProficiency: ["Light Armor", "Medium Armor", "Heavy Armor", "Shields"],
        weaponProficiency: ["Simple Weapons", "Martial Weapons"],
        subclasses: [
            { id: "battle_master", name: "Battle Master", description: "Use special combat maneuvers" },
            { id: "champion", name: "Champion", description: "Strive for peak combat prowess" },
            { id: "eldritch_knight", name: "Eldritch Knight", description: "Learn spells to aid in combat" },
            { id: "psi_warrior", name: "Psi Warrior", description: "Augment attacks with psionic power" }
        ]
    },
    
    monk: {
        name: "Monk",
        primaryAbility: "Dexterity and Wisdom",
        hitDie: 8,
        savingThrows: ["Strength", "Dexterity"],
        skillChoices: 2,
        skillList: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
        armorProficiency: [],
        weaponProficiency: ["Simple Weapons"],
        subclasses: [
            { id: "mercy", name: "Warrior of Mercy", description: "Heal or harm with a touch" },
            { id: "shadow", name: "Warrior of Shadow", description: "Employ shadows for subterfuge" },
            { id: "elements", name: "Warrior of the Elements", description: "Wield elemental power" },
            { id: "open_hand", name: "Warrior of the Open Hand", description: "Master unarmed combat" }
        ]
    },
    
    paladin: {
        name: "Paladin",
        primaryAbility: "Strength and Charisma",
        hitDie: 10,
        savingThrows: ["Wisdom", "Charisma"],
        skillChoices: 2,
        skillList: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
        armorProficiency: ["Light Armor", "Medium Armor", "Heavy Armor", "Shields"],
        weaponProficiency: ["Simple Weapons", "Martial Weapons"],
        subclasses: [
            { id: "devotion", name: "Oath of Devotion", description: "Emulate the angels of justice" },
            { id: "glory", name: "Oath of Glory", description: "Reach the heights of heroism" },
            { id: "ancients", name: "Oath of the Ancients", description: "Preserve life, joy, and nature" },
            { id: "vengeance", name: "Oath of Vengeance", description: "Hunt down evildoers" }
        ]
    },
    
    ranger: {
        name: "Ranger",
        primaryAbility: "Dexterity and Wisdom",
        hitDie: 10,
        savingThrows: ["Strength", "Dexterity"],
        skillChoices: 3,
        skillList: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
        armorProficiency: ["Light Armor", "Medium Armor", "Shields"],
        weaponProficiency: ["Simple Weapons", "Martial Weapons"],
        subclasses: [
            { id: "beast_master", name: "Beast Master", description: "Bond with a primal beast" },
            { id: "fey_wanderer", name: "Fey Wanderer", description: "Manifest fey mirth and fury" },
            { id: "gloom_stalker", name: "Gloom Stalker", description: "Hunt foes that lurk in darkness" },
            { id: "hunter", name: "Hunter", description: "Protect nature with martial versatility" }
        ]
    },
    
    rogue: {
        name: "Rogue",
        primaryAbility: "Dexterity",
        hitDie: 8,
        savingThrows: ["Dexterity", "Intelligence"],
        skillChoices: 4,
        skillList: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"],
        armorProficiency: ["Light Armor"],
        weaponProficiency: ["Simple Weapons"],
        subclasses: [
            { id: "arcane_trickster", name: "Arcane Trickster", description: "Enhance stealth with spells" },
            { id: "assassin", name: "Assassin", description: "Deliver ambushes and poison" },
            { id: "soulknife", name: "Soulknife", description: "Strike foes with psi blades" },
            { id: "thief", name: "Thief", description: "Master infiltration and treasure hunting" }
        ]
    },
    
    sorcerer: {
        name: "Sorcerer",
        primaryAbility: "Charisma",
        hitDie: 6,
        savingThrows: ["Constitution", "Charisma"],
        skillChoices: 2,
        skillList: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"],
        armorProficiency: [],
        weaponProficiency: ["Simple Weapons"],
        subclasses: [
            { id: "aberrant", name: "Aberrant Sorcery", description: "Use strange psionic magic" },
            { id: "clockwork", name: "Clockwork Sorcery", description: "Harness cosmic forces of order" },
            { id: "draconic", name: "Draconic Sorcery", description: "Breathe the magic of dragons" },
            { id: "wild_magic", name: "Wild Magic", description: "Unleash chaos magic" }
        ]
    },
    
    warlock: {
        name: "Warlock",
        primaryAbility: "Charisma",
        hitDie: 8,
        savingThrows: ["Wisdom", "Charisma"],
        skillChoices: 2,
        skillList: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"],
        armorProficiency: ["Light Armor"],
        weaponProficiency: ["Simple Weapons"],
        subclasses: [
            { id: "archfey", name: "Archfey Patron", description: "Teleport and wield fey magic" },
            { id: "celestial", name: "Celestial Patron", description: "Heal with heavenly magic" },
            { id: "fiend", name: "Fiend Patron", description: "Call on sinister powers" },
            { id: "great_old_one", name: "Great Old One Patron", description: "Delve into forbidden lore" }
        ]
    },
    
    wizard: {
        name: "Wizard",
        primaryAbility: "Intelligence",
        hitDie: 6,
        savingThrows: ["Intelligence", "Wisdom"],
        skillChoices: 2,
        skillList: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
        armorProficiency: [],
        weaponProficiency: ["Simple Weapons"],
        subclasses: [
            { id: "abjurer", name: "Abjurer", description: "Shield allies and banish foes" },
            { id: "diviner", name: "Diviner", description: "Learn the multiverse's secrets" },
            { id: "evoker", name: "Evoker", description: "Create explosive effects" },
            { id: "illusionist", name: "Illusionist", description: "Weave spells of deception" }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DND_CLASSES;
}
