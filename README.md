<div align=center>
  <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg"></div>

# version-manage-webpack-plugin

> 根据package.json的版本号对打包资源进行管理，实现非覆盖式发布。

---

## 安装

```
npm i --save-dev version-manage-webpack-plugin
```

```
yarn add --dev version-manage-webpack-plugin
```



## 功能

- 版本与资源目录管理。（dist/version-manage.json）
- 旧版本恢复。
- 版本修订号自增加。
- 清除过期版本（记录，资源文件）。
- 控制台打印版本号。

## 用法

```js
const VersionManageWebpackPlugin = require('version-manage-webpack-plugin')

module.exports = {
  //...
  plugins: [
    // 添加到结尾处
    new VersionManageWebpackPlugin()
  ]
}
​```
```

## 参数

|         字段         |    类型     |    默认值    | 描述                                       |
| :------------------: | :---------: | :----------: | :----------------------------------------- |
| **`entryFileName`**  | `{String}`  | `index.html` | Html入口文件                               |
| **`autoIncVersion`** | `{Boolean}` |   `false`    | 版本修订号是否自增加                       |
|     **`indent`**     | `{Number}`  |     `2`      | 代码缩进，修改package.json文件时使用       |
|     **`maxAge`**     | `{Number}`  |     `0`      | 版本最大存储周期（秒）。始终保留上一个版本 |
|      **`log`**       | `{Boolean}` |   `false`    | 访问时，控制台打印当前版本号               |

## 提示

- 通过手动修改package.json版本号恢复旧版本。
- 生产环境构建时使用。
- 关闭脚手架构建前清除打包目录功能。



