# enoki-build
<a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
  <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="Stability"/>
</a>

A simple static-site generator for Enoki sites

## Installation
```
npm i enoki-build
```

## Usage
`TODO`

## CLI
```
usage
  enoki-build [opts] [directories to copy]
options
  --app                   the file where the choo app's exported (./index.js)
  --content               content directory (./content)
  --help, -h              show this help text
  --index                 path of the index.html (./index.html)
  --output, -o            output directory (./public)
  --version, -v           print version
examples
  start build
  $ enoki-build

  start build with different content folder and index
  $ enoki-build --content ../content --index ./random/index.html

  define directories to copy to the output
  $ enoki-build assets ../bundles
```