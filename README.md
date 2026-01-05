# Between Tokens

A Cursor extension that lets you play a game while waiting for AI responses.

## Demo

![Demo](https://github.com/memsranga/between-tokens/blob/2e5fd29f959e5f82a20b31c513d8f9edb9e07fb8/demo/between-tokens-demo.gif)

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

### 3. Configure Cursor Hooks

This extension uses [Cursor Hooks](https://docs.cursor.com/agent/hooks) to detect when AI prompts are submitted and completed.

Cursor Hooks are a feature introduced in Cursor 1.7 that allow you to intercept and respond to agent lifecycle events. They enable you to run custom commands at specific points during AI interactions, such as before a prompt is submitted, after a file is edited, or when the agent stops.

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

## About Cursor Hooks

[Cursor Hooks](https://docs.cursor.com/agent/hooks) are a powerful feature introduced in Cursor 1.7 that allow developers to intercept and customize AI agent behavior at specific lifecycle events.

### Available Hook Events

| Event | Description |
|-------|-------------|
| `beforeSubmitPrompt` | Triggered before an AI prompt is submitted |
| `afterFileEdit` | Triggered after the agent edits a file |
| `beforeShellExecution` | Triggered before a shell command runs |
| `beforeMCPExecution` | Triggered before an MCP tool is executed |
| `beforeReadFile` | Triggered before a file is read |
| `stop` | Triggered when the agent stops or completes |

### Hook Configuration

Hooks are defined in a `hooks.json` file:
- **Global hooks**: `~/.cursor/hooks.json` (applies to all projects)
- **Project hooks**: `[project]/.cursor/hooks.json` (applies to specific project)

### Documentation

- Official Cursor Hooks Documentation: https://docs.cursor.com/agent/hooks
- Cursor 1.7 Changelog: https://cursor.com/changelog/1-7/
