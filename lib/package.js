import fs from 'fs'
import { readJsonFile } from 'lib/utils'
import CONSTANT from 'src/constant'

export default class Package {
  constructor({ prefixPath, indent }) {
    this.prefixPath = prefixPath
    this.indent = indent
    this.pkgNewVersionFlag = false
    this.pkgFile = readJsonFile(this._getPackageAbsolutePath())
  }

  /**
   * read package.json version
   */
  getPackageVersion() {
    if (!this.pkgFile.version) {
      this.setPkgVersionUpdate()
      return CONSTANT.DEFAULT_VERSION
    }
    return this.pkgFile.version
  }

  setPkgVersionUpdate() {
    this.pkgNewVersionFlag = true
  }

  writePkgVersion(val) {
    if (this.pkgNewVersionFlag) {
      this.writePkg('version', val)
    }
  }

  /**
   * write package.json
   */
  writePkg(field, val) {
    this.pkgFile[field] = val
    const pkgStr = JSON.stringify(this.pkgFile, null, this.indent)
    fs.writeFileSync(this._getPackageAbsolutePath(), pkgStr)
  }

  _getPackageAbsolutePath() {
    return `${this.prefixPath}/package.json`
  }
}
