"use strict";
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
let terminal_created = false;
let terminal;
const myCpcConfig = vscode.workspace.getConfiguration("myCpcConfig");
function activate(context) {
    console.log("Extension activated");
    const interpreterPathConfig = myCpcConfig.get("interpreterPath") || "cpc";
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
                terminal.sendText(`${interpreterPathConfig} "${decodedFilePath}"`);
                terminal.show();
            }
        };
        context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
    }
    function registerUpdate(context) {
        const command = 'cpc.update';
        const commandHandler = () => {
            if (!terminal_created) {
                terminal = vscode.window.createTerminal('CPC Config');
                terminal_created = true;
            }
            devMode();
            updateBranch();
            updateRemote();
            terminal.sendText(`${interpreterPathConfig} -u`);
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
function updateBranch() {
    const interpreterPathConfig = myCpcConfig.get("interpreterPath") || "cpc";
    const updateBranchConfig = myCpcConfig.get("updateBranch") || "stable";
    const scriptDir = interpreterPathConfig;
    const isWindows = process.platform.startsWith('win');
    if (!terminal_created) {
        terminal = vscode.window.createTerminal('CPC Config');
        terminal_created = true;
    }
    const cdCommand = isWindows ? `(Get-Command ${interpreterPathConfig} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source | Split-Path -Parent | Split-Path -Parent) | Set-Location` : `cd $(which ${interpreterPathConfig})/../..`;
    terminal.sendText(`${interpreterPathConfig} -c branch ${updateBranchConfig}`);
    terminal.sendText(`${cdCommand}`);
    terminal.sendText(`git checkout ${updateBranchConfig}`);
    terminal.show();
}
function updateRemote() {
    const interpreterPathConfig = myCpcConfig.get("interpreterPath") || "cpc";
    const updateRemoteConfig = myCpcConfig.get("updateRemote") || "github";
    if (!terminal_created) {
        terminal = vscode.window.createTerminal('CPC Config');
        terminal_created = true;
    }
    terminal.sendText(`${interpreterPathConfig} -c remote ${updateRemoteConfig}`);
    terminal.show();
}
function devMode() {
    const interpreterPathConfig = myCpcConfig.get("interpreterPath") || "cpc";
    const devModeConfig = myCpcConfig.get("devMode");
    if (!terminal_created) {
        terminal = vscode.window.createTerminal('CPC Config');
        terminal_created = true;
    }
    terminal.sendText(`${interpreterPathConfig} -c dev ${devModeConfig}`);
    terminal.show();
}
module.exports = {
    activate,
    deactivate
};
