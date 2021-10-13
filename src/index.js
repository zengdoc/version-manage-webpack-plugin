import fs from 'fs'
import {
  getCurrentTimestamp,
  exitProcess
} from 'lib/utils'
import PackageController from 'lib/package'
import VersionController from 'lib/version'
import log from 'lib/log'
import hooks from 'lib/hooks'
import CONSTANT from 'src/constant'

export default class VersionManageWebpackPlugin {
  constructor(userOptions) {
    const defaultOptions = {
      // entry html file name
      entryFileName: 'index.html',
      // allow version increase
      autoIncVersion: false,
      // code indentation
      indent: 2,
      // version expiration time (seconds)
      maxAge: 0,
      // print version log
      log: false
    }
    this.options = Object.assign(defaultOptions, userOptions)
  }

  apply(compiler) {
    // init
    this.outputPath = compiler.options.output.path
    const getAbsolutePath = path => `${this.outputPath}/${path}`
    this.packageController = new PackageController({
      prefixPath: compiler.options.context,
      indent: this.options.indent
    })
    this.versionController = new VersionController({
      prefixPath: this.outputPath,
      currentManageVersion: this.packageController.getPackageVersion()
    })

    // hooks
    // version handling
    hooks.afterPlugins(compiler, () => {
      // version exists
      if (this.versionController.isExistsVersion()) {
        // auto increment version
        if (this.options.autoIncVersion && this.versionController.isLatestVersion()) {
          this.packageController.setPkgVersionUpdate()
          this.versionController.increaseVersion()
        } else {
          // revert version
          this.versionController.revertVersion(getAbsolutePath(this.options.entryFileName))
          log.success(`Successfully revert v${this.versionController.currentVersion}`)
          exitProcess()
        }
      } else if (this.versionController.isExpiredVersion()) {
        log.error(`Unable to revert version because v${this.versionController.currentVersion} has expired`)
        exitProcess(1)
      }
    })
    // general version source
    hooks.emit(compiler, (compilation, callback) => {
      const result = generateVersionMapResult(
        compilation,
        this.options,
        this.versionController.currentVersion
      )
      this.versionController.setVersionMapSource(result)
      callback()
    })
    // general version file
    hooks.done(compiler, () => {
      // print version information on the console
      if (this.options.log) {
        this.versionController.consoleLogVersionInfo(getAbsolutePath(this.options.entryFileName))
      }
      // clear expired version
      clearExpiredVersion(this.versionController, this.options.maxAge)
      // update pkg version
      this.packageController.writePkgVersion(this.versionController.currentVersion)
      // ensure assets integrity
      generateVersionMapFile(this.versionController.versionMapSource)
      log.success(`Successfully compiled v${this.versionController.currentVersion}`)
    })

    function getEntryHtmlSource(compilation, entryFileName) {
      const entryFile = compilation.assets[entryFileName]
      if (!entryFile) {
        log.error(`Can't find entry file ${entryFileName}`)
        exitProcess(1)
      }
      return entryFile.source()
    }
    function getAssetPathCollection(compilation) {
      return Object.keys(compilation.assets)
    }
    function getCurrentVersionMapResult(version, content) {
      return { [version]: content }
    }
    /**
     * general current version result
     * @param compilation
     * @param options
     * @param currentVersion
     * @return {string}
     */
    function generateVersionMapResult(compilation, options, currentVersion) {
      const entryFileSource = getEntryHtmlSource(compilation, options.entryFileName)
      const assetsPaths = getAssetPathCollection(compilation)
      const compileTime = getCurrentTimestamp()
      const currentVersionMapResult = getCurrentVersionMapResult(
        currentVersion,
        {
          [CONSTANT.VERSION_MAP.ENTRY_FILE_SOURCE]: entryFileSource,
          [CONSTANT.VERSION_MAP.ASSETS_PATHS]: assetsPaths,
          [CONSTANT.VERSION_MAP.COMPILE_TIME]: compileTime
        },
      )

      const resultPath = getAbsolutePath(CONSTANT.VERSION_FILE.FILE_NAME)
      let mapSourceStr = ''
      if (fs.existsSync(resultPath)) {
        const mapSource = JSON.parse(fs.readFileSync(resultPath))
        Object.assign(mapSource, currentVersionMapResult)
        mapSourceStr = mapSource
      } else {
        mapSourceStr = currentVersionMapResult
      }
      return mapSourceStr
    }
    /**
     * general version-manage file
     * @param source
     */
    function generateVersionMapFile(source) {
      fs.writeFileSync(getAbsolutePath(CONSTANT.VERSION_FILE.FILE_NAME), JSON.stringify(source))
    }
    function clearExpiredVersion(versionController, maxAge) {
      const expiredVersionList = versionController.clearExpiredVersion(maxAge)
      if (expiredVersionList.length > 0) {
        log.success(`Successfully clear ${expiredVersionList.map(v => `v${v}`).join(', ')}`)
      }
    }
  }
}
