# 🎲 D&D Solo Play -  Modular Edition

A complete D&D 5e Solo Play application with AI Dungeon Master, now organized into clean, maintainable modules!

## 📁 Project Structure

```
dnd-project/
├── index.html              # Main HTML file (loads all modules)
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── app.js              # Main application controller
│   ├── api.js              # API handlers (Ollama/Claude/OpenAI)
│   ├── character.js        # Character sheet & creation wizard
│   ├── chat.js             # Chat system & dual-mode messaging
│   ├── dice.js             # Dice roller
│   └── initiative.js       # Initiative tracker
└── data/
    ├── classes.js          # D&D 2024 class data (from Chapter 3)
    ├── races.js            # D&D 2024 species/races data
    └── backgrounds.js      # D&D 2024 backgrounds data
```

## ✨ Features

### Core Gameplay
- **AI Dungeon Master** - Choose from:
  - 🏠 Ollama (local, free, private)
  - ☁️ Claude (Anthropic API)
  - ☁️ OpenAI (GPT API)

- **Dual Chat Modes**
  - 🎭 In-Game: Character actions and dialogue
  - 💬 Out-of-Game: DM questions and rule clarifications

### Character System
- **5-Step Character Creator** with D&D 2024 rules
  1. Choose Race, Class, Subclass, Background, Level
  2. Roll Abilities (4d6 drop lowest, reroll 1s & 2s)
  3. Roll Hit Points
  4. Choose Skills
  5. Finalize & Name

- **Complete Character Sheet**
  - All 6 ability scores with modifiers
  - HP, AC, Level tracking
  - Quick roll buttons for all abilities

### Tools
- **Dice Roller** - d4, d6, d8, d10, d12, d20, d100
- **Initiative Tracker** - Combat turn management
- **Save/Load System** - Export/import game state

## 🚀 Quick Start

### Option 1: Local Files (Simplest)
1. Download all files maintaining the folder structure
2. Open `index.html` in your browser
3. Done! No server needed.

### Option 2: Local Server (Recommended for development)
```bash
# Navigate to project folder
cd dnd-project

# Start a simple HTTP server
python -m http.server 8000
# Or: python3 -m http.server 8000
# Or: npx serve

# Open browser to http://localhost:8000
```

### Option 3: GitHub Pages
1. Create a new repository on GitHub
2. Upload all files (maintaining structure)
3. Go to Settings → Pages
4. Select main branch as source
5. Your site will be at: `https://yourusername.github.io/repo-name`

## 🤖 AI Setup

### Using Ollama (Local & Free)
1. **Install Ollama**: https://ollama.com/download
2. **Start Ollama**:
   ```bash
   ollama serve
   ```
3. **Download a model**:
   ```bash
   ollama pull llama3.1:latest
   ```
4. In the app, select "Ollama (Local)" - no API key needed!

### Using Claude (Anthropic)
1. Get API key: https://console.anthropic.com/
2. Select "Claude (Anthropic)" in dropdown
3. Enter your API key
4. Costs: ~$0.003 per message (very cheap!)

### Using OpenAI (GPT)
1. Get API key: https://platform.openai.com/api-keys
2. Select "OpenAI (GPT)" in dropdown
3. Enter your API key
4. Costs: ~$0.03 per message

## 📝 D&D 2024 Rules

This project uses **D&D 2024 (Player's Handbook 2024)** rules:

### Key Differences from 2014
- **Backgrounds** now provide ability score increases (+2/+1 or +1/+1/+1) AND a feat
- **Species** (formerly "Race") provide traits but NO ability scores
- Updated subclass options
- Revised class features

### Included Content
- ✅ All 12 core classes with 4 subclasses each
- ✅ All 9 core species/races
- ✅ 13 backgrounds with feats
- ✅ Character creation rules
- ✅ Ability score rolling (heroic method: 4d6 drop lowest, reroll 1s & 2s)

## 🎮 How to Play

1. **Create Your Character**
   - Click "Create Character"
   - Follow the 5-step wizard
   - Your character appears on the sheet

2. **Start Your Adventure**
   - Choose "In-Game" mode
   - Type what your character does or says
   - AI DM responds with the story

3. **Roll Dice**
   - Use quick roll buttons for ability checks
   - Or use dice roller for any roll
   - Results appear in chat automatically

4. **Combat**
   - Add combatants to initiative tracker
   - Use "Next Turn" to track rounds
   - AI handles enemy actions

5. **Ask Questions**
   - Switch to "Out-of-Game" mode
   - Ask about rules, strategies, etc.
   - AI provides helpful DM guidance

## 🔧 Customization

### Adding New Content

**Add a new class:**
```javascript
// In data/classes.js
newClass: {
    name: "My Class",
    primaryAbility: "Strength",
    hitDie: 10,
    savingThrows: ["Strength", "Constitution"],
    skillChoices: 2,
    skillList: ["Athletics", "Perception"],
    subclasses: [...]
}
```

**Add a new race:**
```javascript
// In data/races.js
newRace: {
    name: "My Race",
    size: "Medium",
    speed: 30,
    traits: ["Trait 1", "Trait 2"]
}
```

### Modifying Styles
- Edit `css/styles.css`
- All colors, fonts, and layouts in one place
- Uses CSS variables for easy theming

### Extending Functionality
- Each module is self-contained
- Add new modules in `js/` folder
- Import in `index.html`
- Initialize in `app.js`

## 📦 File Descriptions

### HTML
- **index.html** - Main page structure, loads all modules

### CSS
- **styles.css** - Complete styling for all components

### JavaScript Modules
- **app.js** - Application initialization, save/load
- **api.js** - Handles AI API calls (Ollama/Claude/OpenAI)
- **character.js** - Character creation wizard, sheet management
- **chat.js** - Dual-mode chat, message handling
- **dice.js** - Dice rolling engine
- **initiative.js** - Combat turn tracker

### Data Files
- **classes.js** - 12 D&D classes + 48 subclasses
- **races.js** - 9 D&D species with traits
- **backgrounds.js** - 13 backgrounds with feats & skills

## 🐛 Troubleshooting

**Ollama not connecting?**
- Make sure Ollama is running: `ollama serve`
- Check it's on port 11434
- Try: http://localhost:11434/api/tags

**Dropdowns not working?**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check browser console for errors
- Ensure all files loaded correctly

**Character not creating?**
- Fill all required fields in each step
- Roll all abilities before proceeding
- Roll HP before finalizing

**API errors?**
- Verify API key is correct
- Check you have credits/quota
- Look at browser console for details

## 🎯 Roadmap

### Phase 2 (Future)
- [ ] Spell management system
- [ ] Equipment & inventory
- [ ] Character advancement (leveling up)
- [ ] Combat automation
- [ ] Adventure imports from files

### Phase 3 (Future)
- [ ] Multiplayer support
- [ ] DM tools for creating adventures
- [ ] Character templates
- [ ] Mobile app version

## 📄 License

This is a personal project for D&D gameplay. D&D and all related content are property of Wizards of the Coast.

## 🤝 Contributing

This is a modular project! Easy to extend:
1. Each module is independent
2. Data files are JSON-like objects
3. Clear separation of concerns
4. Comment your code

## 💡 Tips

- **Save often!** Use the save button to export your game
- **Local Ollama** is free and private
- **Cloud APIs** give better responses but cost money
- **In-game mode** for character actions, **out-of-game** for questions
- **Quick rolls** automatically add modifiers from character sheet

## 🎲 Enjoy Your Adventure!

Your modular D&D Solo Play system is ready. Create epic characters, explore vast worlds, and let the AI DM guide your journey!

---

**Need help?** Check the troubleshooting section or review the inline code comments.
