<div align=center>
  <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg"></div>

# version-manage-webpack-plugin

> Manage packaged resources according to the version number of package.json to achieve non-coverage release versions.

English | [简体中文](./README-zh.md)

---

## Features

- Version and resource directory management.（dist/version-manage.json）
- revert the old version.
- The version patch number is incremented.
- Clear outdated versions (records, resource files).
- The console prints the version number.

## Install

```
npm i --save-dev version-manage-webpack-plugin
```

```
yarn add --dev version-manage-webpack-plugin
```

## Usage

```js
const VersionManageWebpackPlugin = require('version-manage-webpack-plugin')

module.exports = {
  //...
  plugins: [
    // add to the end
    new VersionManageWebpackPlugin()
  ]
}
​```
```

## Parameters

|        Field         |    Type     |   Default    | Description                                                  |
| :------------------: | :---------: | :----------: | :----------------------------------------------------------- |
| **`entryFileName`**  | `{String}`  | `index.html` | The file to write the HTML to. Defaults to `index.html`. You can specify a subdirectory here too (eg: `assets/admin.html`). |
| **`autoIncVersion`** | `{Boolean}` |   `false`    | Whether the version patch number is self-incrementing        |
|     **`indent`**     | `{Number}`  |     `2`      | Code indentation, used when modifying the package.json file  |
|     **`maxAge`**     | `{Number}`  |     `0`      | Version maximum storage period (seconds). Always keep the previous version |
|      **`log`**       | `{Boolean}` |   `false`    | When visiting a webpage, the console prints the current version number |

## Tips

- Restore the old version by manually modifying the package.json version number.
- Used for production environment.
- Turn off the ability to clear the package directory before scaffolding builds.



