# all-terrain-hash [![stability][0]][1]
[![npm version][2]][3] [![downloads][8]][9] [![js-standard-style][10]][11]

All Terrain Object Hashing.

Hash any javascript object, functions, undefined, warts and all. This utility takes any javascript object and hashes it in a reproducible deterministic way. Functions are decomposed into an AST, with comments and whitespace discarded. Objects are ordered in a consistent and safe way. It even takes into account the difference between an `undefined` and a `null`.

## Why?
Sometimes you need to know when anything is different. For instance, if you are handling code across distributed services, or doing stuff that git should be responsible for ;)


## Usage
```js
const ath = require('all-terrain-hash')

let exampleObject = {
  "I've got a nice long key name": function withAFunction (a, b, c=3) {
    return "Why, how nice this all is today. I hope we do not get crushed into a hash string."
  },
  "Sure we won't": (world)=>this,
  "question": {"Have you seen my mirror?": {"response": "Why yes, I have, let me get it for you."}}
}
exampleObject.question.response.mirror = exampleObject

ath.hex(exampleObject)
// 'ab1934e351c6a2e99ab84e18eef04bfc2963896e4a75a76a99af84e7a00be6738d9f2f35b9aa322f5f4a1d7f82a037ee082658af08708e2175a4b63539f280f0'

ath(exampleObject)
// Uint8Array 
// Blake2b { digestLength: 64, finalized: false, pointer: 64 }
```

## API
### ath(obj, [key], [salt], [personal])
This takes an ordinary object and will deterministically hash it via blake2b. It returns a Uint8Array by default. All optionals arguments such as key, salt, and personal will be passed to [blake2b](https://github.com/emilbayes/blake2b).

### .hex(obj, [key], [salt], [personal])
This takes an ordinary object and will deterministically hash it via blake2b. Unlike the function above, it returns it as a hex string. All optionals arguments such as key, salt, and personal will be passed to [blake2b](https://github.com/emilbayes/blake2b).

## Installation
```sh
$ npm install all-terrain-hash
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/all-terrain-hash.svg?style=flat-square
[3]: https://npmjs.org/package/all-terrain-hash
[4]: https://img.shields.io/travis/jdvorak/all-terrain-hash/master.svg?style=flat-square
[5]: https://travis-ci.org/jdvorak/all-terrain-hash
[6]: https://img.shields.io/codecov/c/github/jdvorak/all-terrain-hash/master.svg?style=flat-square
[7]: https://codecov.io/github/jdvorak/all-terrain-hash
[8]: http://img.shields.io/npm/dm/all-terrain-hash.svg?style=flat-square
[9]: https://npmjs.org/package/all-terrain-hash
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
