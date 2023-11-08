const vscode = require('vscode');

let terminal_created = false;
let terminal;

function activate(context) {
    console.log("Extension activated");
    const interpreterPathConfig = vscode.workspace.getConfiguration("myCpcConfig");
    const interpreterPath = interpreterPathConfig.get("interpreterPath") || "cpc";
    executeCurrentFile(context);
    registerUpdate(context);

    function saveCurrentFile() {
        const { activeTextEditor } = vscode.window;
        if (activeTextEditor) {
            activeTextEditor.document.save();
        }
    }

    function executeCurrentFile(context) {
        const command = 'cpc.run';
        const editor = vscode.window.activeTextEditor;
        const commandHandler = () => {
            if (editor) {
                const filePath = vscode.window.activeTextEditor.document.uri.fsPath;
                const decodedFilePath = decodeURI(filePath);
                if (!terminal_created) {
                    terminal = vscode.window.createTerminal('CPC Interpreter');
                    terminal_created = true;
                }
                saveCurrentFile();
                terminal.sendText(`${interpreterPath} "${decodedFilePath}"`);
                terminal.show();
            }
        };
        context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
    }

    function registerUpdate(context) {
        const command = 'cpc.update';
        const commandHandler = () => {
            if (!terminal_created) {
                terminal = vscode.window.createTerminal('CPC Interpreter');
                terminal_created = true;
            }
            terminal.sendText(`${interpreterPath} -u`);
            terminal.show();
        };

        context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
    }
}

function deactivate() {
    if (terminal) {
        terminal.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};