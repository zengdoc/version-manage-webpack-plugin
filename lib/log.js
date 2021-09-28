import chalk from 'chalk'
import CONSTANT from 'src/constant'

export default {
  success(msg) {
    console.log(chalk.green(`[${CONSTANT.PLUGIN_NAME}] ${msg}`))
  },
  error(msg) {
    console.log(chalk.red(`[${CONSTANT.PLUGIN_NAME}] ${msg}`))
  }
}
