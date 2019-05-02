var hypha = require('hypha')
var assert = require('assert')
var fs = require('fs')
var decode = require('parse-entities')
var ncp = require('ncp')
var path = require('path')

module.exports = function (options) {
  var content = hypha.readSiteSync(options.contentSrc, { parent: true })

  // require choo app and check if it's valid
  var app = require(options.appSrc)
  assert(typeof app.state === 'object', 'build: you must use a choo app')

  var state = {
    ...app.state,
    content: content,
    site: { loaded: true, p2p: false, preloaded: true }
  }

  var indexHtml = fs.readFileSync(options.indexSrc, 'utf8')
  // rehydration
  indexHtml = indexHtml.replace('<!-- @head -->', `<script>window.initialState=${JSON.stringify(state)}</script>`)

  // copy directories
  options.copyDirs.map(dir => {
    var srcPath = path.resolve(process.cwd(), dir)
    ncp(srcPath, `${options.outputPath}/${dir}`, function (err) {
      if (err) {
        return console.err(err)
      }
    })
  })

  // ensure the directory exists
  !fs.existsSync(options.outputPath) && fs.mkdirSync(options.outputPath)

  // walk through all the pages and write them
  Object.keys(content).map(path => {
    var outputPath = options.outputPath + path
    var body = app.toString(path, state)

    var resHtml = indexHtml.replace('<!-- @content -->', decode(body))

    // ensure the directory exists
    !fs.existsSync(outputPath) && fs.mkdirSync(outputPath)

    fs.writeFileSync(outputPath + '/index.html', resHtml)
  })
}
