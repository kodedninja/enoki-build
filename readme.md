# enoki-build
<a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
  <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="Stability"/>
</a>

A simple static-site generator for [Enoki](https://enoki.site/) sites.

## Installation
```
npm i enoki-build
```

## Usage
`enoki-build` was designed to require minimal configuration and to be compatible with any Enoki environment.

Three things are required: 

1. an exported [Choo](https://github.com/choojs/choo/) application using the [`enoki`](https://npmjs.com/package/enoki) module
2. a [`nanocontent`](https://github.com/jondashkyle/nanocontent) structured directory
3. an `index.html` file that provides the base

### 1. The App

For the best experience, I'd recommend using [`@kodedninja/enoki`](https://github.com/kodedninja/enoki), instead of the official package, as this contains optimalizations for pre-rendered sites.

### 3. `index.html`

`enoki-build` doesn't include bundles or does any magic, but only replaces the following:

- `<!-- @content -->` ― with the HTML output of the app
- `<!-- @state -->` ― with a `<script>` setting the `window.initialState`
- `<!-- @title -->` ― with the title of the current page

For a simple static site, don't include the `@head` part and do not load the bundle script.

Example HTML:

```html
<html>
  <head>
    <title><!-- @title --></title>
    <!-- @state -->
  </head>
  <body>
    <!-- @content -->
    <script src="/bundle.js"></script>
  </body>
</html>
```

You can check out my [personal site](https://github.com/kodedninja/hex22.org) as an example.

## CLI
```
usage
  enoki-build [opts] [directories to copy]
options
  --app <path>            the file where the choo app's exported (./index.js)
  --content <path>        content directory (./content)
  --help, -h              show this help text
  --index <path>          path of the index.html (./index.html)
  --output, -o <dir>      output directory (./public)
  --keep                  do not clean output directory
  --sitemap <url>         generate sitemap.xml with base url
  --version, -v           print version
examples
  start build
  $ enoki-build

  start build with different content folder and index
  $ enoki-build --content ../content --index ./random/index.html

  define directories to copy to the output
  $ enoki-build assets ../bundles
```
