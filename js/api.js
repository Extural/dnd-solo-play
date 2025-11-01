/**
 * API Module - Line-by-Line Debug Version
 * This file contains line numbers for easier debugging
 */

// Line 1
const APIModule = (() => {
    // Line 2
    // Configuration
    // Line 3
    let config = {
        // Line 4
        provider: 'claude', // 'claude', 'openai', or 'ollama'
        // Line 5
        apiKey: '',
        // Line 6
        ollamaUrl: 'http://localhost:11434',
        // Line 7
        ollamaModel: 'llama3.1:latest',
        // Line 8
        maxTokens: 4000,
        // Line 9
        temperature: 0.7,
        // Line 10
        tokenEstimate: 0,
        // Line 11
        totalSpent: 0
        // Line 12
    };
    // Line 13

    // Line 14
    // Token pricing (USD per 1M tokens)
    // Line 15
    const pricingRates = {
        // Line 16
        claude: {
            // Line 17
            input: 3,    // $3 per 1M input tokens
            // Line 18
            output: 15,  // $15 per 1M output tokens
            // Line 19
        },
        // Line 20
        openai: {
            // Line 21
            input: 10,   // $10 per 1M input tokens (GPT-4)
            // Line 22
            output: 30,  // $30 per 1M output tokens (GPT-4)
            // Line 23
        }
        // Line 24
    };
    // Line 25

    // Line 26
    // Message history
    // Line 27
    let messageHistory = [];
    // Line 28
    let isConnected = false;
    // Line 29
    let lastResponse = '';
    // Line 30

    // Line 31
    /**
     * Initialize the API module
     */
    // Line 32
    function init() {
        // Line 33
        // Load configuration from localStorage
        // Line 34
        const savedConfig = localStorage.getItem('dnd-solo-api-config');
        // Line 35
        if (savedConfig) {
            // Line 36
            config = {...config, ...JSON.parse(savedConfig)};
            // Line 37
        }
        // Line 38

        // Line 39
        // Update UI elements
        // Line 40
        document.getElementById('apiProvider').value = config.provider;
        // Line 41
        document.getElementById('apiKey').value = config.apiKey;
        // Line 42
        document.getElementById('ollamaUrl').value = config.ollamaUrl;
        // Line 43
        document.getElementById('ollamaModel').value = config.ollamaModel;
        // Line 44
        
        // Line 45
        // Set up event listeners
        // Line 46
        document.getElementById('apiProvider').addEventListener('change', handleProviderChange);
        // Line 47
        document.getElementById('apiKey').addEventListener('change', saveConfig);
        // Line 48
        document.getElementById('ollamaUrl').addEventListener('change', saveConfig);
        // Line 49
        document.getElementById('ollamaModel').addEventListener('change', saveConfig);
        // Line 50
        document.getElementById('testConnection').addEventListener('click', testConnection);
        // Line 51
        
        // Line 52
        // Show/hide relevant configuration fields
        // Line 53
        handleProviderChange();
        // Line 54
        
        // Line 55
        // Load message history from localStorage
        // Line 56
        const savedHistory = localStorage.getItem('dnd-solo-message-history');
        // Line 57
        if (savedHistory) {
            // Line 58
            messageHistory = JSON.parse(savedHistory);
            // Line 59
        }
        // Line 60
    }
    // Line 61

    // Line 62
    /**
     * Handle provider dropdown change
     */
    // Line 63
    function handleProviderChange() {
        // Line 64
        config.provider = document.getElementById('apiProvider').value;
        // Line 65
        
        // Line 66
        // Show/hide relevant config sections
        // Line 67
        if (config.provider === 'ollama') {
            // Line 68
            document.getElementById('ollamaConfig').style.display = 'block';
            // Line 69
            document.getElementById('apiKeyConfig').style.display = 'none';
            // Line 70
        } else {
            // Line 71
            document.getElementById('ollamaConfig').style.display = 'none';
            // Line 72
            document.getElementById('apiKeyConfig').style.display = 'block';
            // Line 73
        }
        // Line 74
        
        // Line 75
        saveConfig();
        // Line 76
    }
    // Line 77

    // Line 78
    /**
     * Save configuration to localStorage
     */
    // Line 79
    function saveConfig() {
        // Line 80
        // Update config object
        // Line 81
        config.apiKey = document.getElementById('apiKey').value;
        // Line 82
        config.ollamaUrl = document.getElementById('ollamaUrl').value;
        // Line 83
        config.ollamaModel = document.getElementById('ollamaModel').value;
        // Line 84
        
        // Line 85
        // Save to localStorage
        // Line 86
        localStorage.setItem('dnd-solo-api-config', JSON.stringify(config));
        // Line 87
        
        // Line 88
        // Update connection status
        // Line 89
        updateConnectionStatus(false);
        // Line 90
    }
    // Line 91

    // Line 92
    /**
     * Test connection to the API
     */
    // Line 93
    async function testConnection() {
        // Line 94
        updateConnectionStatus('testing');
        // Line 95
        
        // Line 96
        try {
            // Line 97
            switch (config.provider) {
                // Line 98
                case 'claude':
                    // Line 99
                    if (!config.apiKey) {
                        // Line 100
                        throw new Error('API key required');
                        // Line 101
                    }
                    // Line 102
                    
                    // Line 103
                    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
                        // Line 104
                        method: 'POST',
                        // Line 105
                        headers: {
                            // Line 106
                            'Content-Type': 'application/json',
                            // Line 107
                            'x-api-key': config.apiKey,
                            // Line 108
                            'anthropic-version': '2023-06-01'
                            // Line 109
                        },
                        // Line 110
                        body: JSON.stringify({
                            // Line 111
                            model: "claude-3-sonnet-20240229",
                            // Line 112
                            max_tokens: 10,
                            // Line 113
                            messages: [
                                // Line 114
                                {role: "user", content: "Hello, testing connection. Reply with one word: Connected"}
                                // Line 115
                            ]
                            // Line 116
                        })
                        // Line 117
                    });
                    // Line 118
                    
                    // Line 119
                    const claudeData = await claudeResponse.json();
                    // Line 120
                    if (claudeResponse.ok && claudeData.content && claudeData.content[0].text) {
                        // Line 121
                        updateConnectionStatus(true);
                        // Line 122
                    } else {
                        // Line 123
                        throw new Error(claudeData.error?.message || 'Unknown error');
                        // Line 124
                    }
                    // Line 125
                    break;
                    // Line 126
                    
                // Line 127
                case 'openai':
                    // Line 128
                    if (!config.apiKey) {
                        // Line 129
                        throw new Error('API key required');
                        // Line 130
                    }
                    // Line 131
                    
                    // Line 132
                    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                        // Line 133
                        method: 'POST',
                        // Line 134
                        headers: {
                            // Line 135
                            'Content-Type': 'application/json',
                            // Line 136
                            'Authorization': `Bearer ${config.apiKey}`
                            // Line 137
                        },
                        // Line 138
                        body: JSON.stringify({
                            // Line 139
                            model: "gpt-4",
                            // Line 140
                            max_tokens: 10,
                            // Line 141
                            messages: [
                                // Line 142
                                {role: "user", content: "Hello, testing connection. Reply with one word: Connected"}
                                // Line 143
                            ]
                            // Line 144
                        })
                        // Line 145
                    });
                    // Line 146
                    
                    // Line 147
                    const openaiData = await openaiResponse.json();
                    // Line 148
                    if (openaiResponse.ok && openaiData.choices && openaiData.choices.length > 0) {
                        // Line 149
                        updateConnectionStatus(true);
                        // Line 150
                    } else {
                        // Line 151
                        throw new Error(openaiData.error?.message || 'Unknown error');
                        // Line 152
                    }
                    // Line 153
                    break;
                    // Line 154
                    
                // Line 155
                case 'ollama':
                    // Line 156
                    const ollamaResponse = await fetch(`${config.ollamaUrl}/api/generate`, {
                        // Line 157
                        method: 'POST',
                        // Line 158
                        headers: {
                            // Line 159
                            'Content-Type': 'application/json'
                            // Line 160
                        },
                        // Line 161
                        body: JSON.stringify({
                            // Line 162
                            model: config.ollamaModel,
                            // Line 163
                            prompt: "Hello, testing connection. Reply with one word: Connected",
                            // Line 164
                            stream: false
                            // Line 165
                        })
                        // Line 166
                    });
                    // Line 167
                    
                    // Line 168
                    const ollamaData = await ollamaResponse.json();
                    // Line 169
                    if (ollamaResponse.ok && ollamaData.response) {
                        // Line 170
                        updateConnectionStatus(true);
                        // Line 171
                    } else {
                        // Line 172
                        throw new Error(ollamaData.error || 'Unknown error');
                        // Line 173
                    }
                    // Line 174
                    break;
                    // Line 175
            }
            // Line 176
        } catch (error) {
            // Line 177
            console.error('Connection test failed:', error);
            // Line 178
            updateConnectionStatus(false, error.message);
            // Line 179
        }
        // Line 180
    }
    // Line 181

    // Line 182
    /**
     * Update connection status indicator
     */
    // Line 183
    function updateConnectionStatus(status, errorMsg = '') {
        // Line 184
        const statusElement = document.getElementById('connectionStatus');
        // Line 185
        
        // Line 186
        if (status === 'testing') {
            // Line 187
            statusElement.textContent = 'Testing...';
            // Line 188
            statusElement.className = 'status-testing';
            // Line 189
            return;
            // Line 190
        }
        // Line 191
        
        // Line 192
        isConnected = status;
        // Line 193
        
        // Line 194
        if (status) {
            // Line 195
            statusElement.textContent = 'Connected';
            // Line 196
            statusElement.className = 'status-connected';
            // Line 197
        } else {
            // Line 198
            statusElement.textContent = errorMsg || 'Not connected';
            // Line 199
            statusElement.className = 'status-disconnected';
            // Line 200
        }
        // Line 201
    }
    // Line 202

    // Line 203
    /**
     * Send a message to the AI
     * @param {string} message - The user's message
     * @param {Object} characterData - Current character data
     * @returns {Promise<string>} - The AI's response
     */
    // Line 204
    async function sendMessage(message, characterData = {}) {
        // Line 205
        if (!isConnected && config.provider !== 'ollama') {
            // Line 206
            await testConnection();
            // Line 207
            
            // Line 208
            if (!isConnected) {
                // Line 209
                return "⚠️ Not connected to AI. Please check your connection settings.";
                // Line 210
            }
            // Line 211
        }
        // Line 212
        
        // Line 213
        // Add user message to history
        // Line 214
        messageHistory.push({role: "user", content: message});
        // Line 215
        
        // Line 216
        // Prune history to avoid token limits
        // Line 217
        pruneMessageHistory();
        // Line 218
        
        // Line 219
        // Create system message based on character data
        // Line 220
        const systemMessage = createDMSystemMessage(characterData);
        // Line 221
        
        // Line 222
        try {
            // Line 223
            let response;
            // Line 224
            
            // Line 225
            switch (config.provider) {
                // Line 226
                case 'claude':
                    // Line 227
                    response = await callClaudeAPI(systemMessage, messageHistory);
                    // Line 228
                    break;
                    // Line 229
                case 'openai':
                    // Line 230
                    response = await callOpenAIAPI(systemMessage, messageHistory);
                    // Line 231
                    break;
                    // Line 232
                case 'ollama':
                    // Line 233
                    response = await callOllamaAPI(systemMessage, messageHistory);
                    // Line 234
                    break;
                    // Line 235
                default:
                    // Line 236
                    throw new Error('Invalid provider');
                    // Line 237
            }
            // Line 238
            
            // Line 239
            // Add assistant response to history
            // Line 240
            messageHistory.push({role: "assistant", content: response});
            // Line 241
            
            // Line 242
            // Save updated history
            // Line 243
            localStorage.setItem('dnd-solo-message-history', JSON.stringify(messageHistory));
            // Line 244
            
            // Line 245
            lastResponse = response;
            // Line 246
            return response;
            // Line 247
        } catch (error) {
            // Line 248
            console.error('AI request failed:', error);
            // Line 249
            return `⚠️ AI request failed: ${error.message}`;
            // Line 250
        }
        // Line 251
    }
    // Line 252

    // Line 253
    /**
     * Call Claude API
     */
    // Line 254
    async function callClaudeAPI(systemMessage, messages) {
        // Line 255
        // Format messages for Claude API
        // Line 256
        const formattedMessages = [
            // Line 257
            {role: "system", content: systemMessage}
            // Line 258
        ];
        // Line 259
        
        // Line 260
        // Add message history (skip system messages)
        // Line 261
        messages.forEach(msg => {
            // Line 262
            formattedMessages.push({
                // Line 263
                role: msg.role,
                // Line 264
                content: msg.content
                // Line 265
            });
            // Line 266
        });
        // Line 267
        
        // Line 268
        const claudeResponse = await fetch('https://dnd-claude-proxy.vercel.app/api/claude', {
            // Line 269
            method: 'POST',
            // Line 270
            headers: {
                // Line 271
                'Content-Type': 'application/json'
                // Line 272
            },
            // Line 273
            body: JSON.stringify({
                // Line 274
                model: "claude-3-sonnet-20240229",
                // Line 275
                max_tokens: config.maxTokens,
                // Line 276
                temperature: config.temperature,
                // Line 277
                messages: formattedMessages
                // Line 278
            })
            // Line 279
        });
        // Line 280
        
        // Line 281
        const claudeData = await claudeResponse.json();
        // Line 282
        
        // Line 283
        if (!claudeResponse.ok) {
            // Line 284
            throw new Error(claudeData.error?.message || 'Unknown error');
            // Line 285
        }
        // Line 286
        
        // Line 287
        // Update token estimates
        // Line 288
        if (claudeData.usage) {
            // Line 289
            updateTokenUsage(claudeData.usage.input_tokens, claudeData.usage.output_tokens);
            // Line 290
        }
        // Line 291
        
        // Line 292
        return claudeData.content[0].text;
        // Line 293
    }
    // Line 294

    // Line 295
    /**
     * Call OpenAI API
     */
    // Line 296
    async function callOpenAIAPI(systemMessage, messages) {
        // Line 297
        // Format messages for OpenAI API
        // Line 298
        const formattedMessages = [
            // Line 299
            {role: "system", content: systemMessage}
            // Line 300
        ];
        // Line 301
        
        // Line 302 - This is the problematic line!
        // Add message history (skip system messages)
        // Line 303
        messages.forEach(msg => {
            // Line 304
            formattedMessages.push({
                // Line 305
                role: msg.role,
                // Line 306
                content: msg.content
                // Line 307
            });
            // Line 308
        });
        // Line 309
        
        // Line 310
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            // Line 311
            method: 'POST',
            // Line 312
            headers: {
                // Line 313
                'Content-Type': 'application/json',
                // Line 314
                'Authorization': `Bearer ${config.apiKey}`
                // Line 315
            },
            // Line 316
            body: JSON.stringify({
                // Line 317
                model: "gpt-4",
                // Line 318
                max_tokens: config.maxTokens,
                // Line 319
                temperature: config.temperature,
                // Line 320
                messages: formattedMessages
                // Line 321
            })
            // Line 322
        });
        // Line 323
        
        // Line 324
        const openaiData = await openaiResponse.json();
        // Line 325
        
        // Line 326
        if (!openaiResponse.ok) {
            // Line 327
            throw new Error(openaiData.error?.message || 'Unknown error');
            // Line 328
        }
        // Line 329
        
        // Line 330
        // Update token estimates
        // Line 331
        if (openaiData.usage) {
            // Line 332
            updateTokenUsage(openaiData.usage.prompt_tokens, openaiData.usage.completion_tokens);
            // Line 333
        }
        // Line 334
        
        // Line 335
        return openaiData.choices[0].message.content;
        // Line 336
    }