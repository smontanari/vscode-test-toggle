const vscode = require('vscode');
const FileToggle = require('./lib/file_toggle');
const CodeDocument = require('./lib/code_document');
const WorkspaceDecorator = require('./lib/workspace_decorator');

const EXTENSION_NAME = 'testToggle';

const activate = (context) => {
  const workspace = WorkspaceDecorator.for(vscode.workspace, EXTENSION_NAME);
  const testNameRegExp = workspace.readConfiguration('testNameRegExp');
  if (!testNameRegExp || testNameRegExp.length === 0) {
    vscode.window.showErrorMessage('Failed to activate testToggle extension\nInvalid "testToggle.testNameRegExp" configuration');
    return;
  }

  const fileToggle = new FileToggle(workspace);

  let disposable = vscode.commands.registerCommand(`extension.${EXTENSION_NAME}`, () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    return fileToggle.fromDocument(new CodeDocument(activeEditor.document, new RegExp(testNameRegExp)))
      .then(vscode.workspace.openTextDocument)
      .then(
        vscode.window.showTextDocument,
        error => vscode.window.setStatusBarMessage(`testToggle error: ${error.message}`)
      );
  });

  context.subscriptions.push(disposable);
};

exports.activate = activate;

exports.deactivate = function() {};
