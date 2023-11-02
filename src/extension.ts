const vscode = require('vscode');

function activate(context) {
    console.log("Extension activated");
    const interpreterPathConfig = vscode.workspace.getConfiguration("myCpcConfig");
    const interpreterPath = interpreterPathConfig.get("interpreterPath") || "cpc";
    // console.log(interpreterPathConfig);
    // console.log(interpreterPath);
    executeCurrentFile(context);
    registerUpdate(context);

    function executeCurrentFile(context) {
        const command = 'cpc.run';
        const editor = vscode.window.activeTextEditor;
        const commandHandler = () => {
            if (editor) {
                const filePath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri.fsPath : undefined;
                let fileUri = filePath;
                const decodedFilePath = fileUri ? decodeURI(fileUri) : undefined;
                const terminal = vscode.window.createTerminal('CPC Interpreter');
                terminal.sendText(`${interpreterPath} "${decodedFilePath}"`);
                terminal.show();
            }
        };
        context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
    }

    function registerUpdate(context) {
        const command = 'cpc.update';
        const commandHandler = () => {
            const terminal = vscode.window.createTerminal('CPC Interpreter');
            terminal.sendText(`${interpreterPath} -u`);
            terminal.show();
        };

        context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
    }
}

function deactivate() {

}

module.exports = {
    activate,
    deactivate
};