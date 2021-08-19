import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

export default LoginFirst = {
  whitelist: {
    subscriptions: ["meteor.loginServiceConfiguration"],
    methods: ["login"]
  }
}

import debug_ from 'debug'
const debug = debug_('loginfirst')

const {sub, unsub, method}  = MeteorX.Session.prototype.protocol_handlers

_.extend(MeteorX.Session.prototype.protocol_handlers, {
  sub (msg) {
    debug(`sub(${msg.name}): validating`)
    if (! (this.userId ||
           _.contains(LoginFirst.whitelist.subscriptions, msg.name))) {
           
      debug(`sub(${msg.name}):  blocked, please login first`)
      this.send({
          msg: 'nosub', id: msg.id,
          error: new Meteor.Error(403, 'loginfirst:pleaseLoginFirst')
      })
      return
    }

    debug(`sub(${msg.name}): : passing to Meteor`)
    sub.call(this, msg)
  },

  method (msg, unblock) {
    debug(`method(${msg.method}): validating`)
    if (! (this.userId ||
           _.contains(LoginFirst.whitelist.methods, msg.method))) {
      debug(`method(${msg.method}): blocked, please login first`)
      this.send({
        msg: 'updated', methods: [msg.id]
      })
      this.send({
          msg: 'result', id: msg.id,
          error: new Meteor.Error(403, 'loginfirst:pleaseLoginFirst')
      })

      return
    }

    debug(`method(${msg.method}): passing to Meteor`)
    method.call(this, msg, unblock)
  }
})

debug('epfl:loginfirst is active on server')
