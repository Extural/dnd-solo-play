// D&D 2024 Backgrounds Data
// IMPORTANT: In 2024 rules, backgrounds provide ability score increases (+2/+1 or +1/+1/+1) and a feat

const DND_BACKGROUNDS = {
    acolyte: {
        name: "Acolyte",
        description: "Devoted to a temple, shrine, or religious order",
        skillProficiencies: ["Insight", "Religion"],
        toolProficiency: "Calligrapher's Supplies",
        feat: "Magic Initiate (Cleric)",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    criminal: {
        name: "Criminal",
        description: "Experience in breaking the law",
        skillProficiencies: ["Sleight of Hand", "Stealth"],
        toolProficiency: "Thieves' Tools",
        feat: "Alert",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    entertainer: {
        name: "Entertainer",
        description: "Performer who thrives in the spotlight",
        skillProficiencies: ["Acrobatics", "Performance"],
        toolProficiency: "Musical Instrument",
        feat: "Musician",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    folk_hero: {
        name: "Folk Hero",
        description: "Champion of the common people",
        skillProficiencies: ["Animal Handling", "Survival"],
        toolProficiency: "Artisan's Tools",
        feat: "Tough",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    guild_artisan: {
        name: "Guild Artisan",
        description: "Member of a trade guild",
        skillProficiencies: ["Insight", "Persuasion"],
        toolProficiency: "Artisan's Tools",
        feat: "Crafter",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    hermit: {
        name: "Hermit",
        description: "Lived in isolation seeking enlightenment",
        skillProficiencies: ["Medicine", "Religion"],
        toolProficiency: "Herbalism Kit",
        feat: "Healer",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    noble: {
        name: "Noble",
        description: "Born into privilege and power",
        skillProficiencies: ["History", "Persuasion"],
        toolProficiency: "Gaming Set",
        feat: "Skilled",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    sage: {
        name: "Sage",
        description: "Scholar seeking knowledge",
        skillProficiencies: ["Arcana", "History"],
        toolProficiency: "Calligrapher's Supplies",
        feat: "Magic Initiate (Wizard)",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    sailor: {
        name: "Sailor",
        description: "Experienced aboard ships",
        skillProficiencies: ["Athletics", "Perception"],
        toolProficiency: "Navigator's Tools",
        feat: "Tavern Brawler",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    soldier: {
        name: "Soldier",
        description: "Trained in the art of war",
        skillProficiencies: ["Athletics", "Intimidation"],
        toolProficiency: "Gaming Set",
        feat: "Savage Attacker",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    urchin: {
        name: "Urchin",
        description: "Survived on the streets",
        skillProficiencies: ["Sleight of Hand", "Stealth"],
        toolProficiency: "Thieves' Tools",
        feat: "Lucky",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    charlatan: {
        name: "Charlatan",
        description: "Master of deception and trickery",
        skillProficiencies: ["Deception", "Sleight of Hand"],
        toolProficiency: "Forgery Kit",
        feat: "Skilled",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    },
    
    outlander: {
        name: "Outlander",
        description: "Grew up in the wilds",
        skillProficiencies: ["Athletics", "Survival"],
        toolProficiency: "Musical Instrument",
        feat: "Athlete",
        abilityScoreIncrease: "Choose +2 to one ability and +1 to another, OR +1 to three different abilities"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DND_BACKGROUNDS;
}
