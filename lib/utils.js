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

/**
 * Injects the assets into the given html string
 * @param {string} html
 * @param {{
       head: string[],
       body: string[]
     }} assetTags
 * @returns {string}
 */
function injectAssetsIntoHtml (html, assetTags) {
  const htmlRegExp = /(<html[^>]*>)/i
  const headRegExp = /(<\/head\s*>)/i
  const bodyRegExp = /(<\/body\s*>)/i
  const body = Array.isArray(assetTags.body) ? assetTags.body.join('') : ''
  const head = Array.isArray(assetTags.head) ? assetTags.head.join('') : ''

  if (body.length) {
    if (bodyRegExp.test(html)) {
      // Append assets to body element
      html = html.replace(bodyRegExp, match => body + match)
    } else {
      // Append scripts to the end of the file if no <body> element exists:
      html += body
    }
  }

  if (head.length) {
    // Create a head tag if none exists
    if (!headRegExp.test(html)) {
      if (!htmlRegExp.test(html)) {
        html = '<head></head>' + html
      } else {
        html = html.replace(htmlRegExp, match => match + '<head></head>')
      }
    }

    // Append assets to head element
    html = html.replace(headRegExp, match => head + match)
  }

  return html
}

export {
  readJsonFile,
  getCurrentTimestamp,
  exitProcess,
  isJson,
  injectAssetsIntoHtml
}
