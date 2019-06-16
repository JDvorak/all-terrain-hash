const test = require('tape')
const ath = require('./')

test('should output either a hex or an object', function (t) {
  t.plan(2)
  var obj = {}
  t.equal(typeof ath.hex(obj), 'string', 'Output string with .hex')
  t.equal(ath(obj).constructor, Uint8Array, 'Output Uint8Array without')
})

test('should output the same hash no matter order of keys', function (t) {
  t.plan(1)
  var obj1 = {
    a: 2,
    b: 4,
    c: {k: 1, d: 3, m: 'string'},
    f: 0.1111111111
  }
  var obj2 = {
    a: 2,
    f: 0.1111111111,
    c: {m: 'string', k: 1, d: 3},
    b: 4
  }

  t.assert(ath.hex(obj1) === ath.hex(obj2))
})

test('should output the same hash with a nested cycle', function (t) {
  t.plan(1)
  var obj1 = {
    a: 2,
    b: 4,
    c: {k: 1, d: 3, m: 'string'},
    f: 0.1111111111
  }
  var obj2 = {
    a: 2,
    f: 0.1111111111,
    c: {m: 'string', k: 1, d: 3},
    b: 4
  }
  obj2.c.m = obj2
  obj1.c.m = obj1
  t.assert(ath.hex(obj1) === ath.hex(obj2))
})

test('should output a different hash for two different objects', function (t) {
  t.plan(1)
  var obj1 = {
    a: 2,
    b: 4,
    c: {k: 1, d: 3, m: 'string'},
    f: 0.1111111111
  }
  var obj2 = {
    a: 2,
    c: {m: 'string', k: 1, d: 3},
    b: 4
  }
  obj2.c.m = obj2
  obj1.c.m = obj1
  t.assert(ath.hex(obj1) !== ath.hex(obj2))
})

test('should handle cycles', function (t) {
  t.plan(1)
  var obj1 = {
    a: 2,
    b: 4,
    c: {k: 1, d: 3, m: 'string'},
    f: 0.1111111111
  }
  var obj2 = {
    a: 2,
    f: 0.1111111111,
    c: {m: 'string', k: 1, d: 3},
    b: 4
  }
  obj2.c.m = obj2
  obj1.c.m = obj1
  t.assert(ath.hex(obj1) === ath.hex(obj2))
})

test('should strip functions', function (t) {
  t.plan(2)
  var obj1 = {
    a: function (a, b) { // no type of comment should stop anything
      return a
    }
  }
  var parsed = ath.cleanObject(obj1)
  t.equal(parsed.a.__fn.type, 'Program')
  t.equal(parsed.a.__fn.start, undefined, 'strips start end values')
})
test('should be sensitive to functions', function (t) {
  t.plan(2)
  var example = function (a, b) {
    /* comments don't count */
    return a
  }
  var obj1 = {
    a: function (a, b) { // no type of comment should stop anything
      return a
    }
  }
  var obj2 = {
    a: example
  }
  t.equal(ath.hex(obj1), ath.hex(obj2))
  var obj3 = {
    a: function (a, b, c) { return a + b + c }
  }
  t.notEqual(ath.hex(obj3), ath.hex(obj1), 'different functions should has different hashes')
})

test('should be sensitive to keys on functions', function (t) {
  t.plan(2)
  var obj1 = {
    a: function (a, b) { return a }
  }
  obj1.a.nestedKeys = {b: 3, c: 4}
  let hash1 = ath.hex(obj1)
  var obj2 = {
    a: function (a, b) { return a }
  }
  obj2.a.nestedKeys = {b: 3, c: 4}
  let hash2 = ath.hex(obj2)
  t.equal(hash1, hash2, `structurally identical functions should be same hash ...${hash1.slice(-4)} == ...${hash2.slice(-4)}`)
  var obj3 = {
    a: function (a, b) { return a }
  }
  obj3.a.nope = {d: -1}
  let hash3 = ath.hex(obj3)
  t.notEqual(hash3, hash2, `different objects should be different hashes ...${hash3.slice(-4)} <> ...${hash2.slice(-4)}`)
})

test('should be sensitive to functions on functions', function (t) {
  t.plan(2)
  var obj1 = {
    a: function (a, b) { return a }
  }
  obj1.a.nestedKeys = {b: 3, c: function (a, b, c) { return a + b + c }}
  let hash1 = ath.hex(obj1)
  var obj2 = {
    a: function (a, b) { return a }
  }
  obj2.a.nestedKeys = {b: 3, c: function (a, b, c) { return a + b + c }}
  let hash2 = ath.hex(obj2)
  t.equal(hash1, hash2, `structurally identical nested functions should be same hash ...${hash1.slice(-4)} == ...${hash2.slice(-4)}`)
  var obj3 = {
    a: function (a, b) { return a }
  }
  obj3.a.nestedKeys = {b: 3, c: function (a, b) { return b - a }}
  let hash3 = ath.hex(obj3)
  t.notEqual(hash3, hash2, `different nested functions should be different hashes ...${hash3.slice(-4)} <> ...${hash2.slice(-4)}`)
})

test('should pass parameters to blake2b', function (t) {
  t.plan(3)
  var obj = {}
  let hash1 = ath.hex(obj, Buffer.from('my precious key oh my'))
  let hash2 = ath.hex(obj)
  let hash3 = ath.hex(obj, undefined, Buffer.from('salty salt salt!'))
  t.notEqual(hash1, hash2, `different secrets should result in different hashes ...${hash1.slice(-4)} <> ...${hash2.slice(-4)}`)
  t.notEqual(hash1, hash3, `different salts should result in different hashes ...${hash3.slice(-4)} <> ...${hash1.slice(-4)}`)
  t.notEqual(hash2, hash3, `different salts should result in different hashes ...${hash3.slice(-4)} <> ...${hash2.slice(-4)}`)
})
