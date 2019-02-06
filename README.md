# vscode-test-toggle

This extensions allows you to quickly toggle between a _source_ file and its _test_ couterpart and vice versa. It works for any programming language and it can adapt to the way you have structured/organised the code in your project.

## Features

- Flexible and configurable filename search pattern using Regular Expression syntax
- Ability to search for source/test files in multiple (configurable) folders

## Why another test switch extension?

The Visual Studio Marketplace already offers a number of extensions with similar functionality. Unfortunately I couldn't find any that would provide the flexibility I need in when working across multiple projects with multiple languages and frameworks.

For instance in a _Rails_ project you may have an `app`, `configuration` and a `lib` folder containing source files and one `spec` folder containing all your unit tests. In _React_ projects it's not unusual to embed test files within the same folder of the source file. Moreover in many languages you can have multiple source/test files with the same basename representing modules/classes belonging to different namespaces, which makes it more difficult to identify the correct counterpart. Those and others are the scenarios this extension is trying to address.

## How it works

Given an open file/document, this extension compiles an ordered list of _candidate folders_ that may contain the corresponding test/source file. It then scans those folders sequentially until it finds (or not) the target document to toggle to.
- The first candidate folder is always the same folder in which the current document lives
- The last candidate folder is always the root of the project
- The presence of other folders depends on the source and test `paths` extension setting

## Extension Settings

This extension provides the following configuration options:

* `testToggle.testNameRegExp`: regular expression used to match a test filename (see `package.json` for the default value)
* `testToggle.paths.source`: list of available _source_ paths to use when searching for source files (default: `[]`)
* `testToggle.paths.test`: list of available _test_ paths to use when searching for test files (default: `[]`)
* `testToggle.excludePattern`: glob expression used to exclude particular paths when searching for files (default: empty string)
* `testToggle.typeMappings`: additional file type mappings to help finding corresponding source/test files with different type/extension.

### Workspace Settings examples
* Changing the `testNameRegExp` to search for test files that have a suffix using uppercase (`Test`) or lowercase (`test`):
```json
{
  "testToggle.testNameRegExp": "(\\.|_|-)+(t|T)est$"
}
```
* Adding source and test paths:
```json
{
  "testToggle.paths.source": ["app", "lib"],
  "testToggle.paths.test": ["spec", "e2e"]
}
```
* Excluding paths from search:
```json
{
  "testToggle.excludePattern": "node_modules/"
}
```
* Using additional type mappings:
```json
{
  "testToggle.typeMappings": {
    "vue": "js",
    "jsx": "js"
  }
}
```

## Release Notes

See the [CHANGELOG](./CHANGELOG.md).
