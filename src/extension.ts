const vscode = require('vscode');

function activate(context) {
    console.log("Extension activated");
    const config = vscode.workspace.getConfiguration("CAIE PseudoCode");
    const interpreterPath = config.get("myCpcConfig.interpreterPath") || "cpc";
    executeCurrentFile(context);
    registerUpdate(context);

    function executeCurrentFile(context) {
        const command = 'cpc.run';
        const editor = vscode.window.activeTextEditor;
        const commandHandler = () => {
            if (editor) {
                const document = editor.document;
                const filePath = document.uri.fsPath;
                const terminal = vscode.window.createTerminal('CPC Interpreter');
                terminal.sendText(`${interpreterPath} "${filePath}"`);
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