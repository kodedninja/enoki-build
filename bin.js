#!/usr/bin/env node

var minimist = require('minimist')
var chalk = require('chalk')
var dedent = require('dedent')
var assert = require('assert')
var path = require('path')
var build = require('.')

var argv = minimist(process.argv.slice(2), {
  alias: {
    'help': 'h',
    'version': 'v',
    'output': 'o',
  },
  default: {
    content: './content',
    app: './index.js',
    output: './public',
    index: './index.html'
  },
  boolean: [
    'help',
    'version'
  ]
})

if (argv.help) {
  console.log(dedent`
    \n${chalk.dim('usage')}
      ${chalk.yellow.bold('build')} [opts] <entry>
    ${chalk.dim('options')}
      --help, -h              show this help text
      --version, -v           print version
    ${chalk.dim('examples')}
      ${chalk.bold('start build')}
      enoki-build

      ${chalk.bold('start build with different content folder')}
      enoki-build --content ../content
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
  copyDirs: argv._
})
