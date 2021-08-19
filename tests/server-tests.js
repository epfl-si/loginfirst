import '../loginfirst-server'
import { strict as assert } from 'assert'

import debug_ from 'debug'

const counters = {
  reset() {
    this.login = 0
    this.aMethod = 0
    this.loginServiceConfiguration = 0
  }
}
counters.reset()

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

Meteor.publish({
  "meteor.loginServiceConfiguration": function() {
    counters.loginServiceConfiguration += 1
    this.ready()
    serverDebug("loginServiceConfiguration")
  }
})

function ddp_async (connection, method) {
  const f = connection[method]
  return async function (/* ... */) {
    const args = [...arguments]
    return new Promise((resolve, reject) => {
      f.call(this,  // The one from above - We are in arrow function
             ...args,
             (
               method === "call"
               ?
                 (error, result) => {
                   if (error !== undefined) {
                     reject(error)
                   } else {
                     resolve(result)
                   }
                 }
               :

               method === "subscribe"
               ?
               { onStop: reject, onReady: resolve }
               :

               (() => { throw new Error(`Unknown method ${method}`) })()
            ))
    })
  }
}

describe("Server-side tests", function() {
  const debug = debug_('loginfirst:tests')

  let connection
  beforeEach(function() {
    counters.reset()

    connection = DDP.connect(Meteor.absoluteUrl())
    connection.call = ddp_async(connection, "call")
    connection.subscribe = ddp_async(connection, "subscribe")
  })

  describe("Logged-out state", function() {
    it("lets the client call `login()`", async function() {
      await connection.call("login")
      assert.equal(1, counters.login)
    })

    it("lets the client subscribe to `meteor.loginServiceConfiguration`", async function() {
      await connection.subscribe('meteor.loginServiceConfiguration')
      assert.equal(1, counters.loginServiceConfiguration)
    })

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
