var nanocontent = require('nanocontent')
var fs = require('fs')
var ncp = promisify(require('ncp'))
var path = require('path')
var nanositemap = require('nanositemap')
var nanocrane = require('nanocrane')

module.exports = async function (options) {
  var content = nanocontent.readSiteSync(options.contentSrc, { parent: true })

  // require choo app and check if it's valid
  var app = require(options.appSrc)
  var indexHtml = fs.readFileSync(options.indexSrc, 'utf8')

  var extendState = {
    content: content,
    site: { loaded: true, p2p: false, preloaded: true }
  }

  // nanocrane builds pages and copies files
  await nanocrane(app, extendState, indexHtml, {
    output: options.outputPath,
    copy: options.copyDirs
  })

  // make the content folder for files
  // this way we can use the same href on dat and on the built http
  ensure(options.outputPath + '/content')

  // walk through all the pages and copy the files
  Object.keys(content).map(function (route) {
    var contentPath = path.join(options.outputPath, 'content', route)

    // ensure path exists
    ensure(contentPath)

    // copy files
    Object.keys(content[route].files).map(async function (filename) {
      var file = content[route].files[filename]
      try {
        await ncp(file.source, `${contentPath}/${file.filename}`)
      } catch (err) {
        console.error(`enoki-build: could not copy ${route}/${filename}`)
      }
    })
  })

  // generate sitemap
  if (options.sitemap) {
    var sm = nanositemap(options.sitemap, Object.keys(content))
    fs.writeFileSync(options.outputPath + '/sitemap.xml', sm)
  }
}

function promisify (fn) {
  return function (...args) {
    return new Promise(function (resolve, reject) {
      fn(...args, function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}

function ensure (path) {
  !fs.existsSync(path) && fs.mkdirSync(path)
}
