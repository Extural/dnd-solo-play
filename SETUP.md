# 🚀 Quick Setup Guide

## Download & Extract

1. Download all files from the outputs directory
2. Keep the folder structure intact:
   ```
   your-folder/
   ├── index.html
   ├── README.md
   ├── css/
   │   └── styles.css
   ├── js/
   │   ├── app.js
   │   ├── api.js
   │   ├── character.js
   │   ├── chat.js
   │   ├── dice.js
   │   └── initiative.js
   └── data/
       ├── classes.js
       ├── races.js
       └── backgrounds.js
   ```

## Run Locally (3 Methods)

### Method 1: Direct Open (Easiest)
- Simply double-click `index.html`
- Works in any modern browser
- ✅ No server needed
- ❌ Some browsers restrict file:// access

### Method 2: Python Server (Recommended)
```bash
# Navigate to your folder
cd path/to/your-folder

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

### Method 3: Node.js
```bash
# Install serve (one time)
npm install -g serve

# Run server
serve

# Then open: http://localhost:3000
```

## Setup AI (Choose One)

### 🏠 Ollama (Free, Local, Private)
**Best for: Privacy, unlimited use, no costs**

1. Download Ollama: https://ollama.com/download
2. Install and run:
   ```bash
   ollama serve
   ```
3. Pull a model:
   ```bash
   ollama pull llama3.1:latest
   ```
4. In the app:
   - Select "Ollama (Local)"
   - No API key needed!
   - Start playing

**Ollama Models:**
- `llama3.1:latest` (Recommended, 8GB)
- `mistral:latest` (Faster, 4GB)
- `mixtral:latest` (Best quality, 26GB)

### ☁️ Claude (Best Quality)
**Best for: Highest quality responses**

1. Get API key: https://console.anthropic.com/
2. In the app:
   - Select "Claude (Anthropic)"
   - Enter your API key
   - Cost: ~$0.003 per message

### ☁️ OpenAI (GPT)
**Best for: Well-known, reliable**

1. Get API key: https://platform.openai.com/api-keys
2. In the app:
   - Select "OpenAI (GPT)"
   - Enter your API key
   - Cost: ~$0.03 per message

## First Time Use

1. **Open the app** (use any method above)
2. **Select AI provider** (top-right dropdown)
3. **Enter API key** (if using Claude or OpenAI)
4. **Click "Create Character"**
5. **Follow the wizard** (5 easy steps)
6. **Start playing!**

## Testing Your Setup

### Test Ollama Connection:
```bash
# Should show installed models
curl http://localhost:11434/api/tags

# Should see: {"models":[...]}
```

### Test the App:
1. Open `index.html`
2. Select your AI provider
3. Click "Create Character"
4. If wizard opens → ✅ Success!
5. If not → Check browser console (F12)

## Common Issues

**Ollama won't connect:**
```bash
# Make sure it's running
ollama serve

# Or restart it
killall ollama
ollama serve
```

**Files won't load:**
- Use Method 2 or 3 (run a local server)
- Some browsers block file:// for security

**Dropdowns empty:**
- Hard refresh: Ctrl+F5 or Cmd+Shift+R
- Check all files downloaded correctly
- Look at browser console (F12)

**API errors:**
- Verify API key is correct
- Check you have credits
- Try a different model

## Deploy to GitHub Pages

Want it online? Free hosting!

1. Create GitHub account (free)
2. Create new repository
3. Upload ALL files (keep structure)
4. Go to Settings → Pages
5. Select main branch
6. Get your URL: `https://yourusername.github.io/repo-name`

Now anyone can play from anywhere!

## Next Steps

1. ✅ Get setup working
2. ✅ Create your first character
3. ✅ Start an adventure
4. 📖 Read the full README.md for advanced features
5. 🎮 Have fun!

## Need Help?

- Check README.md for detailed info
- Open browser console (F12) for errors
- Verify all files have correct structure
- Try different browser if issues persist

## Pro Tips

- **Save your game regularly!** Export JSON saves
- **Ollama is free** - great for learning/testing
- **Use quick roll buttons** - auto-calculates modifiers
- **Switch modes** - In-game for action, out-of-game for questions

---

**Ready to adventure? Follow the steps above and dive in!** 🎲✨
