const { Parser } = require('acorn')
const traverse = require('traverse')
const jsx = require('acorn-jsx')
const JSXParser = Parser.extend(jsx())
const walk = require('acorn-walk')
const stringify = require('safe-stable-stringify')
const blake2b = require('blake2b')

function cleanObject (object) {
  return traverse(object).forEach(function (x) {
    if ({}.toString.call(x) === '[object Function]') {
      x.__isFunction = true
      x.__fn = JSXParser.parse(`(${x.toString()})`, {locations: false, ranges: false})
      x.__fn = traverse(x.__fn).forEach(function (x) {
        if (this.path.indexOf('start') >= 0 ||
           this.path.indexOf('end') >= 0) {
          this.delete()
        }
      })
      return this.update(Object.assign({}, x))
    } else if (x === undefined) {
      return this.update({__undefined: true})
    }
  })
}

function hash (object, key, salt, personal) {
  var output = new Uint8Array(64)
  var string = stringify(object)

  return blake2b(output.length, key, salt, personal).update(Buffer.from(string))
}

module.exports = function raw (object, key, salt, personal) {
  return hash(cleanObject(object), key, salt, personal).digest()
}

module.exports.hash = hash
module.exports.cleanObject = cleanObject
module.exports.hex = function (object, key, salt, personal) {
  return hash(cleanObject(object), key, salt, personal).digest('hex')
}
