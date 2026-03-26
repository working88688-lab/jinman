# vinyl-contents-tostring

[![Build Status][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]

> Convert vinyl content into string

## Install

```
$ npm install vinyl-contents-tostring
```


## Usage

```js
import { callbackify } from 'node:util';
import vfs from 'vinyl-fs';
import map from 'map-stream';
import toString from 'vinyl-contents-tostring';

vfs.src(['./package.json'])
  .pipe(map(
    callbackify(file => toString(file).then(contents => console.log(contents))),
  ));
```

## API

### vinylToString(file, enc)

Returns a promise to the contents of the vinyl file, regardless of stream or buffer files. Optionally, it accepts the encoding of the file

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/github/actions/workflow/status/dotcore64/vinyl-contents-tostring/test.yml?event=push&style=flat-square
[build]: https://github.com/dotcore64/vinyl-contents-tostring/actions

[npm-badge]: https://img.shields.io/npm/v/vinyl-contents-tostring.svg?style=flat-square
[npm]: https://www.npmjs.org/package/vinyl-contents-tostring

[coveralls-badge]: https://img.shields.io/coveralls/dotcore64/vinyl-contents-tostring/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/dotcore64/vinyl-contents-tostring
