# 📁 Project Structure & Module Guide

Complete breakdown of the modular D&D Solo Play application.

## 🗂️ File Tree

```
dnd-project/
│
├── 📄 index.html           # Main HTML - loads all modules
├── 📖 README.md            # Complete documentation
├── 🚀 SETUP.md             # Quick start guide
├── 📁 PROJECT-STRUCTURE.md # This file
│
├── 📁 css/
│   └── styles.css          # All styling (9.5 KB)
│
├── 📁 js/                  # JavaScript modules
│   ├── app.js              # Application controller (2.1 KB)
│   ├── api.js              # AI API handlers (5.8 KB)
│   ├── character.js        # Character system (12 KB)
│   ├── chat.js             # Chat & messaging (4.5 KB)
│   ├── dice.js             # Dice rolling (1.9 KB)
│   └── initiative.js       # Combat tracker (1.8 KB)
│
└── 📁 data/                # D&D 2024 rules data
    ├── classes.js          # 12 classes + 48 subclasses (11 KB)
    ├── races.js            # 9 species/races (3.4 KB)
    └── backgrounds.js      # 13 backgrounds (4.8 KB)
```

**Total Size:** ~57 KB (extremely lightweight!)

## 📄 Core Files

### index.html (20 KB)
**Purpose:** Main HTML structure

**Contains:**
- Page layout (grid system)
- Character sheet UI
- Chat interface
- Tools panel (dice, initiative)
- Character creation modal (5 steps)
- Script imports for all modules

**Key Sections:**
- Header with API config
- Left panel: Character sheet
- Center: Chat area with mode toggle
- Right panel: Dice roller, initiative, save/load
- Modal: Character creation wizard

**Dependencies:**
- Loads all CSS (styles.css)
- Loads all data files (classes, races, backgrounds)
- Loads all JS modules
- Initializes dropdown population

---

## 🎨 Styling

### css/styles.css (9.5 KB)
**Purpose:** Complete application styling

**Sections:**
1. **Reset & Base** - Universal styles
2. **Layout** - Grid system, responsive design
3. **Header** - Title, API configuration
4. **Panels** - Character sheet, chat, tools
5. **Character Sheet** - Stats, abilities, quick rolls
6. **Chat** - Messages, modes, input area
7. **Tools** - Dice, initiative, buttons
8. **Modal** - Character creation wizard
9. **Responsive** - Mobile/tablet breakpoints

**Features:**
- CSS Grid layout (3-column responsive)
- Custom scrollbars
- Animated buttons
- Modal overlay system
- Dark fantasy theme (blues, gold)

---

## ⚙️ JavaScript Modules

### js/app.js (2.1 KB)
**Purpose:** Application initialization and coordination

**Responsibilities:**
- Initialize all modules on page load
- Handle save/load game state
- Export/import JSON save files

**Functions:**
- `init()` - Start all modules
- `saveGame()` - Export character as JSON
- `loadGame()` - Import saved game

**Used by:** Browser (entry point)
**Uses:** All other modules

---

### js/api.js (5.8 KB)
**Purpose:** AI API communication layer

**Supported APIs:**
1. **Ollama** (local, free)
2. **Claude** (Anthropic)
3. **OpenAI** (GPT)

**Functions:**
- `init()` - Load saved API settings
- `sendMessage(messages, isInGame)` - Route to correct API
- `generateSystemPrompt(character, isInGame)` - Create context
- `sendToOllama()` - Handle Ollama requests
- `sendToClaude()` - Handle Claude requests
- `sendToOpenAI()` - Handle OpenAI requests

**Key Features:**
- Automatic system prompt generation
- Character context injection
- Mode-aware prompting (in-game vs out-of-game)
- LocalStorage for API settings

**Used by:** ChatModule
**Uses:** CharacterModule (for context)

---

### js/character.js (12 KB)
**Purpose:** Character creation and management

**Components:**
1. **Character Data** - Stores current character state
2. **Creation Wizard** - 5-step character creator
3. **Sheet Management** - Update display
4. **Quick Rolls** - Ability check buttons

**Functions:**
- `init()` - Attach event listeners
- `openCharacterCreator()` - Start wizard
- `showStep(n)` - Navigate wizard steps
- `rollAbility()` - 4d6 drop lowest, reroll 1s/2s
- `rollAllAbilities()` - Roll all 6 at once
- `rollHitPoints()` - Calculate HP by class
- `finalizeCharacter()` - Complete creation
- `updateCharacterSheet()` - Refresh display
- `handleQuickRoll()` - Ability checks with modifiers
- `getCurrentCharacter()` - Get character data
- `loadCharacter()` - Import saved character

**Character Object:**
```javascript
{
    name: string,
    race: string,
    class: string,
    subclass: string,
    level: number,
    background: string,
    abilities: {
        strength: number,
        dexterity: number,
        constitution: number,
        intelligence: number,
        wisdom: number,
        charisma: number
    },
    hp: number,
    maxHp: number,
    ac: number,
    proficiencyBonus: number,
    skills: [string]
}
```

**Used by:** App, Chat, API
**Uses:** Data files (classes, races, backgrounds)

---

### js/chat.js (4.5 KB)
**Purpose:** Chat interface and messaging

**Features:**
1. **Dual Mode System**
   - In-game mode: Character actions
   - Out-of-game mode: DM questions

2. **Message Types**
   - User messages (player input)
   - DM messages (AI responses)
   - System messages (status updates)
   - Roll messages (dice results)

**Functions:**
- `init()` - Setup listeners
- `setMode(inGame)` - Toggle chat mode
- `sendMessage()` - Process user input
- `addUserMessage(text)` - Display user message
- `addDMMessage(text)` - Display AI response
- `addSystemMessage(text)` - Display system info
- `addRollMessage(text)` - Display dice roll
- `clearChat()` - Reset conversation
- `saveChatHistory()` - Store in localStorage
- `loadChatHistory()` - Restore previous session

**Conversation History:**
```javascript
[
    { role: 'user', content: 'I check for traps' },
    { role: 'assistant', content: 'Roll Investigation...' }
]
```

**Used by:** App, Character, Dice
**Uses:** APIModule

---

### js/dice.js (1.9 KB)
**Purpose:** Dice rolling engine

**Supported Dice:**
- d4, d6, d8, d10, d12, d20, d100
- Multiple dice (e.g., "2d6")
- Modifiers (e.g., "1d20+5")

**Functions:**
- `init()` - Attach button listeners
- `rollDice(notation)` - Parse and roll
- `parseDiceNotation(notation)` - Parse "XdY+Z" format
- `displayResult(result)` - Show in UI

**Result Object:**
```javascript
{
    rolls: [4, 6, 3],    // Individual die results
    total: 13,            // Sum of all
    modifier: 0,          // Added modifier
    notation: '3d6'       // Original notation
}
```

**Used by:** App, Chat
**Uses:** ChatModule (to display rolls)

---

### js/initiative.js (1.8 KB)
**Purpose:** Combat turn tracking

**Features:**
- Add combatants with initiative scores
- Automatic sorting (highest first)
- Turn advancement
- Visual active turn indicator

**Functions:**
- `init()` - Setup button listeners
- `addCombatant()` - Prompt for name & initiative
- `nextTurn()` - Advance to next combatant
- `resetInitiative()` - Clear all combatants
- `updateDisplay()` - Refresh UI

**Combatant Object:**
```javascript
{
    name: 'Goblin',
    initiative: 15
}
```

**Used by:** App
**Uses:** None (standalone)

---

## 📊 Data Files

### data/classes.js (11 KB)
**Purpose:** D&D 2024 class definitions

**Structure:**
```javascript
const DND_CLASSES = {
    classId: {
        name: "Class Name",
        primaryAbility: "Ability",
        hitDie: number,
        savingThrows: [ability, ability],
        skillChoices: number,
        skillList: [skills...],
        armorProficiency: [types...],
        weaponProficiency: [types...],
        subclasses: [
            {
                id: "subclass_id",
                name: "Subclass Name",
                description: "Description"
            }
        ]
    }
}
```

**Contains:**
- 12 core classes
- 48 subclasses (4 per class)
- Proficiencies
- Skill options
- Hit dice

**Used by:** Character module, index.html

---

### data/races.js (3.4 KB)
**Purpose:** D&D 2024 species/races

**Structure:**
```javascript
const DND_RACES = {
    raceId: {
        name: "Race Name",
        size: "Medium" | "Small",
        speed: number,
        traits: [
            "Trait description",
            "Another trait"
        ]
    }
}
```

**Contains:**
- 9 core species
- Size and speed
- Racial traits
- NO ability scores (2024 rules)

**Used by:** Character module, index.html

---

### data/backgrounds.js (4.8 KB)
**Purpose:** D&D 2024 backgrounds

**Structure:**
```javascript
const DND_BACKGROUNDS = {
    backgroundId: {
        name: "Background Name",
        description: "Description",
        skillProficiencies: [skill, skill],
        toolProficiency: "Tool",
        feat: "Feat Name",
        abilityScoreIncrease: "Instructions"
    }
}
```

**Contains:**
- 13 backgrounds
- Skill proficiencies (2)
- Tool proficiency (1)
- Free feat
- Ability score options

**Important:** In 2024 rules, backgrounds provide:
- +2 to one ability, +1 to another
- OR +1 to three abilities
- Plus a free feat!

**Used by:** Character module, index.html

---

## 🔄 Module Dependencies

```
app.js
├── api.js
│   └── character.js (for context)
├── character.js
│   ├── data/classes.js
│   ├── data/races.js
│   └── data/backgrounds.js
├── chat.js
│   └── api.js
├── dice.js
│   └── chat.js (for display)
└── initiative.js
    └── (standalone)
```

**Key Relationships:**
1. **app.js** coordinates everything
2. **character.js** is central (used by API and Chat)
3. **api.js** bridges chat and AI services
4. **Data files** are referenced by character.js
5. **dice.js** and **initiative.js** are relatively independent

---

## 🔌 Communication Flow

### Character Creation:
```
User → index.html (wizard) → character.js → data files → character object
```

### Sending a Message:
```
User → chat.js → api.js → AI Service
                ↓
           character.js (context)
```

### AI Response:
```
AI Service → api.js → chat.js → Display
                           ↓
                      chat history
```

### Quick Roll:
```
User → character.js → dice result
         ↓
      chat.js (display)
```

---

## 🎯 Adding New Features

### Add a New Class:
1. Open `data/classes.js`
2. Add new entry to `DND_CLASSES`
3. Include all required fields
4. Refresh browser - appears in dropdown automatically!

### Add a New Module:
1. Create `js/new-module.js`
2. Use IIFE pattern (see existing modules)
3. Export public API
4. Import in `index.html`
5. Initialize in `app.js`

### Modify Styling:
1. Open `css/styles.css`
2. Find relevant section (well-commented)
3. Make changes
4. Hard refresh browser (Ctrl+F5)

---

## 📦 Packaging for Distribution

### For Users:
- Zip entire folder
- Keep structure intact
- Include README.md and SETUP.md

### For GitHub:
- Push all files
- Maintain directory structure
- Enable GitHub Pages
- Users can clone or download

### For Hosting:
- Upload to any static host
- No backend needed
- No build process required
- Just serve the files!

---

## 💡 Design Principles

1. **Modularity** - Each file does one thing well
2. **Independence** - Minimal dependencies
3. **Clarity** - Well-commented, self-documenting
4. **Extensibility** - Easy to add features
5. **Simplicity** - No build tools, no frameworks
6. **Performance** - Lightweight, fast loading

---

## 🚀 Performance Stats

- **Total Size:** 57 KB (minified would be ~30 KB)
- **HTTP Requests:** 11 files
- **Load Time:** < 100ms on localhost
- **Runtime:** Instant (no compilation)

---

This modular structure makes the codebase:
✅ Easy to understand
✅ Easy to modify
✅ Easy to extend
✅ Easy to debug
✅ Easy to maintain

Happy coding! 🎲
