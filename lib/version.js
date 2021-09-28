import fs from 'fs'
import {
  readJsonFile,
  getCurrentTimestamp,
  exitProcess,
  isJson
} from 'lib/utils'
import log from 'lib/log'
import CONSTANT from 'src/constant'

export default class Version {
  constructor({ prefixPath, currentManageVersion }) {
    this.currentVersion = currentManageVersion
    this.prefixPath = prefixPath
    this.versionFilePath = this._getAbsolutePath(CONSTANT.VERSION_FILE.FILE_NAME)
    this.versionMapSource = {}
    this.versionSort = []
    this.setVersionMapSource(this.readVersionMapFile())
  }

  setVersionMapSource(value) {
    const newVal = isJson(value) ? value : {}
    this.versionMapSource = newVal
    this.versionSort = this._sortVersionList(newVal)
  }

  readVersionMapFile() {
    if (fs.existsSync(this.versionFilePath)) {
      return readJsonFile(this.versionFilePath)
    }
    return null
  }

  hasVersionMap() {
    return Object.keys(this.versionMapSource).length
  }

  isExistsVersion() {
    if (!this.hasVersionMap()) {
      return false
    }
    return !!this.versionMapSource[this.currentVersion]
  }

  isExpiredVersion() {
    if (!this.hasVersionMap()) {
      return false
    }
    return this._compareVersion(this._getLatestVersion(), this.currentVersion) === 1
  }

  isLatestVersion() {
    if (!this.hasVersionMap()) {
      return false
    }
    return this._getLatestVersion() === this.currentVersion
  }

  revertVersion(entryFilePath) {
    if (!fs.existsSync(entryFilePath)) {
      log.error(`Can't find entry file: ${entryFilePath}`)
      exitProcess(1)
    }
    const {
      [CONSTANT.VERSION_MAP.ENTRY_FILE_SOURCE]: entryFileSource,
      [CONSTANT.VERSION_MAP.ASSETS_PATHS]: assetsPaths
    } = this.versionMapSource[this.currentVersion]
    if (!this._isExistsAssets(assetsPaths)) {
      log.error('Revert failed: Assets file is missing')
      exitProcess(1)
    }
    fs.writeFileSync(entryFilePath, entryFileSource)
  }

  increaseVersion() {
    const versionList = this.currentVersion.split('.')
    const lastOne = versionList.pop()
    versionList.push((Number(lastOne) + 1).toString())
    this.currentVersion = versionList.join('.')
  }

  clearExpiredVersion(maxAge) {
    const isOnlyOneVersion = () => this.versionSort.length < 2
    if (!this.hasVersionMap()
      || isOnlyOneVersion()
      || typeof maxAge !== 'number'
      || maxAge <= 0) {
      return []
    }
    const lastVersion = this._getLastVersion()
    const latestVersion = this._getLatestVersion()
    const expiredVersionList = []
    const validVersionList = []
    const currentTimeStamp = getCurrentTimestamp()
    Object
      .entries(this.versionMapSource)
      .forEach(([versionKey, { [CONSTANT.VERSION_MAP.COMPILE_TIME]: compileTime }]) => {
        // keep the last version
        if (versionKey !== lastVersion
          && versionKey !== latestVersion
          && compileTime
          && currentTimeStamp - compileTime >= maxAge) {
          expiredVersionList.push(versionKey)
        } else {
          validVersionList.push(versionKey)
        }
      })
    this._clearExpiredVersionAssets(expiredVersionList, validVersionList)
    return expiredVersionList
  }

  _getLastVersion() {
    if (this.versionSort.length < 2) {
      return null
    }
    return this.versionSort.slice(-2, -1)[0]
  }

  _getLatestVersion() {
    return this.versionSort.slice(-1)[0]
  }

  _isExistsAssets(paths) {
    if (!paths || !Array.isArray(paths)) {
      return false
    }
    for (const path of paths) {
      if (!fs.existsSync(this._getAbsolutePath(path))) {
        return false
      }
    }
    return true
  }

  /**
   * Version List sort asc
   * @param versionJson
   * @return {[[version, versionInfo]]}
   * @private
   */
  _sortVersionList(versionJson) {
    return Object
      .keys(versionJson)
      .sort(this._compareVersion)
  }

  /**
   * compare version
   * @param version1
   * @param version2
   * @return {number} mt = 1; lt = -1; same = 0
   * @private
   */
  _compareVersion(version1, version2) {
    const arrayA = version1.split('.')
    const arrayB = version2.split('.')

    let pointer = 0
    while (pointer < arrayA.length && pointer < arrayB.length) {
      const res = arrayA[pointer] - arrayB[pointer]
      if (res === 0) {
        pointer += 1
      } else {
        return res > 0 ? 1 : -1
      }
    }
    // still minor version
    while (pointer < arrayA.length) {
      if (+arrayA[pointer] > 0) {
        return 1
      }
      pointer += 1
    }
    // still minor version
    while (pointer < arrayB.length) {
      if (+arrayB[pointer] > 0) {
        return -1
      }
      pointer += 1
    }
    // same version
    return 0
  }

  _clearExpiredVersionAssets(expiredList, validList) {
    const expiredAssets = Array.from(new Set(
      expiredList
        .map(v => this.versionMapSource[v][CONSTANT.VERSION_MAP.ASSETS_PATHS])
        .flat()
    ))
    const validAssets = Array.from(new Set(
      validList
        .map(v => this.versionMapSource[v][CONSTANT.VERSION_MAP.ASSETS_PATHS])
        .flat()
    ))
    const needClearAssets = expiredAssets.filter(i => !validAssets.includes(i))
    this._clearVersionMapSource(expiredList)
    this._clearAsset(needClearAssets)
  }

  /**
   * clear version field
   * @param version{array | string}
   * @private
   */
  _clearVersionMapSource(version) {
    const versions = Array.isArray(version) ? version : [version]
    const clear = key => {
      delete this.versionMapSource[key]
    }
    versions.forEach(key => clear(key))
  }

  /**
   * clear asset
   * @param assetPath{array | string}
   * @private
   */
  _clearAsset(assetPath) {
    const paths = Array.isArray(assetPath) ? assetPath : [assetPath]
    const clear = path => {
      try {
        fs.unlinkSync(this._getAbsolutePath(path))
      } catch (e) {
        console.log(e)
      }
    }
    paths.forEach(path => clear(path))
  }

  _getAbsolutePath(suffixPath) {
    return `${this.prefixPath}/${suffixPath}`
  }
}
