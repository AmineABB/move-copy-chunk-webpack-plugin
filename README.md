<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>MoveCopyChunk Webpack Plugin</h1>
  <p>This Webpack plugin allows you to move, copy chunks after build emit files</p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D move-copy-chunk-webpack-plugin
```

<h2 align="center">Usage</h2>

**webpack.config.js**
```js
const MoveCopyChunkPlugin = require('move-copy-chunk-webpack-plugin')
const config = {
  ...
  plugins: [
    new MoveCopyChunkPlugin([
      {
        actionType: 'copy',
        pattern: 'myChunkA.*.js',
        to: 'tmp.chunk.dir'
      },
      {
        actionType: 'move',
        pattern: 'myChunkB.*.js',
        to: 'moved.chunk.dir'
      }
    ])
  ]
}
```

### `Configuration`

|Name|Type|Description|
|:--:|:--:|:---------:|
|[`actionType`](#actionType)|`{String}`|The type of action that can be used `move` or `copy`
|[`pattern`](#pattern)|`{String\|RegEx}`|The chunk name to apply the action type, you can use RegEx to match chunk name [minimatch options](https://github.com/isaacs/minimatch)|
|[`to`](#to)|`{String}`|The path to the destination folder.
|[`context`](#context)|`{String}`|Path from where the `to` should be resolved, by default `compiler.options.context`

### `actionType`

**webpack.config.js**
```js
[
  new MoveCopyChunkPlugin([
    {
      actionType: 'copy',
      pattern: 'myChunkA.*.js',
      to: 'copied.chunk.dir'
    },
    {
      actionType: 'move',
      pattern: 'myChunkB.*.js',
      to: 'moved.chunk.dir'
    }
  ])
]
```

### `pattern`

**webpack.config.js**
```js
[
  new MoveCopyChunkPlugin([
    {
      actionType: 'copy',
      pattern: '*.css',
      to: 'myTempDirectory'
    },
    {
      actionType: 'move',
      pattern: 'bundle.*.js',
      to: '/myTempDirectory'
    },
    {
      actionType: 'move',
      pattern: '*chunks.*.js',
      to: 'myChunksDir'
    }
  ])
]
```

### `to`

**webpack.config.js**
```js
[
  new MoveCopyChunkPlugin([
    {
      actionType: 'copy',
      pattern: 'myChunkA.*.js',
      to: 'myTempDirectory'
    },
    {
      actionType: 'move',
      pattern: 'myChunkB.*.js',
      to: '/myTempDirectory'
    }
  ])
]
```

### `context`
```js
[
  new MoveCopyChunkPlugin([
    {
      actionType: 'copy',
      pattern: 'myChunkA.*.js',
      to: 'myTempDirectory',
      context: 'chunks/'
    },
    {
      actionType: 'move',
      pattern: 'myChunkB.*.js',
      to: './src/asyncChunk'
    }
  ])
]
```

### `Optional options`

|Name|Type|Description|
|:--:|:--:|:---------:|
|[`logInfo`](#logInfo)|`{Boolean}`|Enable or disable the log display for the `moved` or `copied` files (by default the value is `true`)

### `logInfo`
```js
[
  new MoveCopyChunkPlugin([
    {
      actionType: 'move',
      pattern: 'myChunkB.*.js',
      to: 'tmp/asyncChunk'
    }],
    { logInfo: false }
  )
]
```
