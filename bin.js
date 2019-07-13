#!/usr/bin/env node

var minimist = require('minimist')
var chalk = require('chalk')
var dedent = require('dedent')
var path = require('path')
var build = require('.')

var argv = minimist(process.argv.slice(2), {
  alias: {
    'help': 'h',
    'version': 'v',
    'output': 'o'
  },
  default: {
    app: './index.js',
    content: './content',
    index: './index.html',
    output: './public',
    sitemap: false
  },
  boolean: [
    'help',
    'version'
  ]
})

if (argv.help) {
  console.log(dedent`
    \n${chalk.dim('usage')}
      ${chalk.green.bold('enoki-build')} [opts] [directories to copy]
    ${chalk.dim('options')}
      --app <path>            the file where the choo app's exported (./index.js)
      --content <path>        content directory (./content)
      --help, -h              show this help text
      --index <path>          path of the index.html (./index.html)
      --output, -o <dir>      output directory (./public)
      --sitemap <url>         generate sitemap.xml with base url
      --version, -v           print version
    ${chalk.dim('examples')}
      ${chalk.bold('start build')}
      $ enoki-build

      ${chalk.bold('start build with different content folder and index')}
      $ enoki-build --content ../content --index ./random/index.html

      ${chalk.bold('define directories to copy to the output')}
      $ enoki-build assets ../bundles
  `, '\n')
  process.exit(0)
}

if (argv.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}

build({
  appSrc: path.resolve(process.cwd(), argv.app),
  contentSrc: path.resolve(process.cwd(), argv.content),
  indexSrc: path.resolve(process.cwd(), argv.index),
  outputPath: path.resolve(process.cwd(), argv.output),
  copyDirs: argv._,
  sitemap: argv.sitemap
})
