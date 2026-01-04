# Between Tokens

A Cursor extension that lets you play a game while waiting for AI responses.

## Installation

### 1. Build the extension

```bash
npm install
npm run compile
npx vsce package
```

This creates a `.vsix` file in the project root.

### 2. Install in Cursor

1. Open Cursor
2. `Cmd+Shift+P` -> "Extensions: Install from VSIX..."
3. Select the generated `.vsix` file

### 3. Configure Cursor hooks

Add the following to `.cursor/hooks.json` in your project (or `~/.cursor/hooks.json` for global):

```json
{
  "version": 1,
  "hooks": {
    "beforeSubmitPrompt": [
      {
        "command": "curl -s http://localhost:3847/start"
      }
    ],
    "stop": [
      {
        "command": "curl -s http://localhost:3847/pause"
      }
    ]
  }
}
```

### 4. Verify hooks are loaded

1. `Cmd+Shift+P` -> "Output: Show Output Channels"
2. Select "Hooks" from the dropdown
3. Look for: `Loaded 2 user hook(s) for steps: beforeSubmitPrompt, stop`

## Usage

- Submit any AI prompt and the game starts automatically
- Game pauses when the AI response completes
- Game resumes on the next prompt
- Press **Space** or **Click** to flap

## Development

```bash
npm install
npm run watch
```

Press `F5` to launch the Extension Development Host.

### Test the game standalone

```bash
npm run play
```

Opens `test-game.html` in your browser with buttons to simulate the Cursor hooks.
