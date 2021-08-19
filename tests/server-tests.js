import '../loginfirst-server'
import { strict as assert } from 'assert'

import debug_ from 'debug'

const counter = {
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
    return "loggedin"
  },

  aMethod () {
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
    connection = DDP.connect(Meteor.absoluteUrl())
    let { call, subscribe } = connection
    for (const method of ["call", "subscribe"]) {
      connection[method] = cb2async(connection[method].bind(connection))
    }
  })

  describe("Logged-out state", function() {
    it("lets the client call `login()`", async function() {
      const result = await connection.call("login")
      debug(result)
    })

    it("lets the client subscribe to `meteor.loginServiceConfiguration`")
    it("blocks other subscriptions")
    it("blocks other methods")
  })

  describe("Logged-in state", function() {
    it("lets the client call any method")
    it("lets the client subscribe to anything")
  })
})
