import '../loginfirst-server'
import { strict as assert } from 'assert'

import debug_ from 'debug'

const counters = {
  login: 0,
  aMethod: 0,
  reset() {
    this.login = 0
    this.aMethod = 0
  }
}

const serverDebug = debug_('loginfirst:fake-server')
Meteor.methods({
  login () {
    serverDebug("login")
    counters.login += 1
    return "loggedin"
  },

  aMethod () {
    counters.aMethod += 1
    serverDebug("aMethod")
  }
})

function cb2async (f) {
  return async function (/* ... */) {
    const args = [...arguments]
    return new Promise((resolve, reject) => {
      f.call(this,  // The one from above - We are in arrow function
             ...args,
             (error, result) => {
               if (error !== undefined) {
                 reject(error)
               } else {
                 resolve(result)
               }
             })
    })
  }
}

describe("Server-side tests", function() {
  const debug = debug_('loginfirst:tests')

  let connection
  beforeEach(function() {
    counters.reset()

    connection = DDP.connect(Meteor.absoluteUrl())
    let { call, subscribe } = connection
    for (const method of ["call", "subscribe"]) {
      connection[method] = cb2async(connection[method].bind(connection))
    }
  })

  describe("Logged-out state", function() {
    it("lets the client call `login()`", async function() {
      await connection.call("login")
      assert.equal(1, counters.login)
    })

    it("lets the client subscribe to `meteor.loginServiceConfiguration`")
    it("blocks other subscriptions")
    it("blocks other methods", async function() {
      try {
        await connection.call("aMethod")
        assert.fail("Call should have been blocked")
      } catch (error) {
        assert.equal('loginfirst:pleaseLoginFirst', error.reason)
        assert.equal(0, counters.aMethod)
      }
    })
  })

  describe("Logged-in state", function() {
    it("lets the client call any method")
    it("lets the client subscribe to anything")
  })
})
