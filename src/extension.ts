import * as vscode from 'vscode';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';

let panel: vscode.WebviewPanel | undefined;
let server: http.Server | undefined;

const PORT = 3847;

export function activate(context: vscode.ExtensionContext) {
    console.log('Between Tokens extension is now active');

    // Start HTTP server for hook communication
    startServer(context);

    // Register commands
    const startCommand = vscode.commands.registerCommand('between-tokens.startGame', () => {
        showGamePanel(context);
        sendMessageToGame({ type: 'start' });
    });

    const pauseCommand = vscode.commands.registerCommand('between-tokens.pauseGame', () => {
        sendMessageToGame({ type: 'pause' });
    });

    context.subscriptions.push(startCommand, pauseCommand);
}

function startServer(context: vscode.ExtensionContext) {
    server = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/plain');

        if (req.url === '/start') {
            showGamePanel(context);
            sendMessageToGame({ type: 'start' });
            res.writeHead(200);
            res.end('Game started');
        } else if (req.url === '/pause') {
            sendMessageToGame({ type: 'pause' });
            res.writeHead(200);
            res.end('Game paused');
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    server.listen(PORT, () => {
        console.log(`Between Tokens server listening on port ${PORT}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is already in use, server may already be running`);
        } else {
            console.error('Server error:', err);
        }
    });
}

function showGamePanel(context: vscode.ExtensionContext) {
    if (panel) {
        panel.reveal(vscode.ViewColumn.One);
        return;
    }

    panel = vscode.window.createWebviewPanel(
        'betweenTokens',
        'Between Tokens',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    const gameHtmlPath = path.join(context.extensionPath, 'src', 'game.html');
    const gameHtml = fs.readFileSync(gameHtmlPath, 'utf8');

    panel.webview.html = gameHtml;

    panel.onDidDispose(() => {
        panel = undefined;
    }, null, context.subscriptions);
}

function sendMessageToGame(message: { type: string }) {
    if (panel) {
        panel.webview.postMessage(message);
    }
}

export function deactivate() {
    if (server) {
        server.close();
        server = undefined;
    }
    if (panel) {
        panel.dispose();
        panel = undefined;
    }
}
