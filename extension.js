const vscode = require('vscode');
const FileToggle = require('./lib/file_toggle');
const CodeDocument = require('./lib/code_document');
const WorkspaceDecorator = require('./lib/workspace_decorator');
const FileExtensions = require('./lib/file_extensions');

const EXTENSION_NAME = 'testToggle';
const ERROR_MSG_TIMEOUT = 5000;

const activate = (context) => {
  const workspace = WorkspaceDecorator.for(vscode.workspace, EXTENSION_NAME);
  const fileToggle = new FileToggle(workspace);
  let disposable = vscode.commands.registerCommand(`extension.${EXTENSION_NAME}`, () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    try {
      const config = workspace.configuration();
      return fileToggle.fromDocument(new CodeDocument(activeEditor.document, new FileExtensions(config), config))
        .then(vscode.workspace.openTextDocument)
        .then(
          vscode.window.showTextDocument,
          error => vscode.window.setStatusBarMessage(`testToggle error: ${error.message}`, ERROR_MSG_TIMEOUT)
        );
    } catch(err) {
      vscode.window.showErrorMessage(`Failed to run testToggle extension\n${err}`);
    }
  });

  context.subscriptions.push(disposable);
};

exports.activate = activate;

exports.deactivate = function() {};
