import CONSTANT from 'src/constant'

// compiler.hooks in webpack ^4.0.0

export default {
  afterPlugins(compiler, ...args) {
    return compiler.hooks
      ? compiler.hooks.afterPlugins.tap(CONSTANT.PLUGIN_NAME, ...args)
      : compiler.plugin('after-plugins', ...args)
  },
  emit(compiler, ...args) {
    return compiler.hooks
      ? compiler.hooks.emit.tapAsync(CONSTANT.PLUGIN_NAME, ...args)
      : compiler.plugin('emit', ...args)
  },
  done(compiler, ...args) {
    return compiler.hooks
      ? compiler.hooks.done.tap(CONSTANT.PLUGIN_NAME, ...args)
      : compiler.plugin('done', ...args)
  }
}
