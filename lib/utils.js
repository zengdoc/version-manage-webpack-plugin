import fs from 'fs'

/**
 * read json file
 * @param {string} filePath
 * @return {json} fileContent
 */
function readJsonFile(filePath) {
  const json = fs.readFileSync(filePath)
  return JSON.parse(json)
}

/**
 * get current timestamp
 * @return {string} timestamp
 * */
function getCurrentTimestamp() {
  return Math.floor(new Date().valueOf() / 1000)
}

/**
 * Node.js process.exit
 * @param code exit code
 */
function exitProcess(code = 0) {
  process.exit(code)
}

function isJson(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
}

export {
  readJsonFile,
  getCurrentTimestamp,
  exitProcess,
  isJson
}
