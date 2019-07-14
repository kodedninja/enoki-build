var nanocontent = require('nanocontent')
var assert = require('assert')
var fs = require('fs')
var decode = require('parse-entities')
var ncp = require('ncp')
var path = require('path')
var rmrf = require('rimraf')
var nanositemap = require('nanositemap')

var PATTERN_STATE = '<!-- @state -->'
var PATTERN_CONTENT = '<!-- @content -->'
var PATTERN_TITLE = '<!-- @title -->'

module.exports = async function (options) {
  var content = nanocontent.readSiteSync(options.contentSrc, { parent: true })

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
  indexHtml = indexHtml.replace(PATTERN_STATE, `<script>window.initialState=${JSON.stringify(state)}</script>`)

  var outputDirExists = fs.existsSync(options.outputPath)
  if (!options.keep) {
    // delete it and remake it
    if (outputDirExists) {
      await rmDir(options.outputPath)
    }
    fs.mkdirSync(options.outputPath)
  } else {
    // ensure it exists
    ensure(options.outputPath)
  }

  // make the content folder for files
  // this way we can use the same href on dat and on the built http
  ensure(options.outputPath + '/content')

  // copy directories
  options.copyDirs.map(async dir => {
    var srcPath = path.resolve(process.cwd(), dir)
    var destPath = `${options.outputPath}/${path.basename(dir)}`
    await copy(srcPath, destPath)
  })

  // walk through all the pages and write them
  Object.keys(content).map(path => {
    var outputPath = options.outputPath + path
    var contentPath = options.outputPath + '/content' + path
    var body = app.toString(path, state)

    var resHtml = indexHtml
      .replace(PATTERN_CONTENT, decode(body))
      .replace(PATTERN_TITLE, app.state.title)

    // ensure the directory exists
    ensure(outputPath)
    ensure(contentPath)

    // write content
    fs.writeFileSync(outputPath + '/index.html', resHtml)
    // copy static files
    Object.keys(content[path].files).map(async filename => {
      var file = content[path].files[filename]
      try {
        await copy(file.source, `${contentPath}/${file.filename}`)
      } catch (err) {
        console.error(err)
      }
    })
  })

  // generate sitemap
  if (options.sitemap) {
    var sm = nanositemap(options.sitemap, Object.keys(content))
    fs.writeFileSync(options.outputPath + '/sitemap.xml', sm)
  }
}

function rmDir (outputPath) {
  return new Promise(function (resolve, reject) {
    rmrf(outputPath, function (err) {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

function copy (srcPath, destPath) {
  return new Promise(function (resolve, reject) {
    ncp(srcPath, destPath, function (err) {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

function ensure (path) {
  !fs.existsSync(path) && fs.mkdirSync(path)
}