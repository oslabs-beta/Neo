// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  const disposable = vscode.commands.registerCommand(
    'checkSEO.command',
    (uri: vscode.Uri) => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
      } else {
        currentPanel = vscode.window.createWebviewPanel(
          'checkSEO',
          'SEO Scores',
          vscode.ViewColumn.One,
          {
            enableScripts: true,
          }
        );

        currentPanel.webview.html = getWebviewContent();
        currentPanel.onDidDispose(() => {
          currentPanel = undefined;
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

const currDate = performance.now();

function getWebviewContent() {
  return `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
        </style>
    </head>
    <body>
				<div id="root"></div>
        <h1>SEO Scores ${currDate} </h1>
        <p>This ones for the boys.</p>
    </body>
    </html>
  `;
}

// This method is called when your extension is deactivated
export function deactivate() {}
