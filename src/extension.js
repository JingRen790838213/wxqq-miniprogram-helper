// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Generator = require("./generator");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed




/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const fileCreator = new Generator.FileGenerator();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	
	context.subscriptions.push(vscode.commands.registerCommand('wxqq-miniprogram-helper.createWXPage',(uri)=>{
		fileCreator.execute(uri.fsPath,"wxpage");
	}));
	context.subscriptions.push(vscode.commands.registerCommand('wxqq-miniprogram-helper.createWXComponent',(uri)=>{
		fileCreator.execute(uri.fsPath,"wxcomponent");
	}));
	context.subscriptions.push(vscode.commands.registerCommand('wxqq-miniprogram-helper.createQQPage',(uri)=>{
		fileCreator.execute(uri.fsPath,"qqpage");
	}));
	context.subscriptions.push(vscode.commands.registerCommand('wxqq-miniprogram-helper.createQQComponent',(uri)=>{
		fileCreator.execute(uri.fsPath,"qqcomponent");
	}));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
