var Fiber = Npm.require("fibers"),
    _debug = Npm.require("debug")("loginfirst");

function debug(session/*, args */) {
  if (! _debug.enabled) return;
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift("<Session " + session.id + ">");
  return _debug.apply(_debug, args);
}

/**
 * A fibers-friendly Conditional Variable implementation.
 *
 * @constructor
 */
var CondVar = function() {
  var waiters = [];
  this.wait = function() {
    waiters.push(Fiber.current);
    Fiber.yield();
  };
  this.notifyAll = function() {
    var notifiedCount = waiters.length;
    waiters.forEach(function(f) { f.run() });
    waiters = [];
    return notifiedCount;
  };
};

/**
 * An attribute of things in inside-out pattern
 *
 * Call myattribute.of(thing) to get (or create) the attribute of thing
 *
 * Inside-out means that we don't pollute the thing with extra
 * attributes (instead, we use a WeakMap keyed by things).
 *
 * @param defaultValueMaker Called the first time .of(thing) is called
 *        for a given thing; return the attribute's default value
 * @constructor
 */
var InsideOutAttribute = function (defaultValueMaker) {
  var stash = new WeakMap();
  this.of = function(thing) {
    if (! stash.has(thing)) {
      stash.set(thing, defaultValueMaker(thing));
    }
    return stash.get(thing);
  }
};

LoginFirst.canProcessBeforeLogin = function canProcessBeforeLogin(session, msg) {
  if (msg.msg !== "method") return false;
  return _.contains(LoginFirst.allowedMethodNames, msg.method);
};

var delayedBySession = new InsideOutAttribute(function() {return new CondVar()});

_.each(MeteorX.Session.prototype.protocol_handlers, function(origHandler, handlerName) {
  MeteorX.Session.prototype.protocol_handlers[handlerName] = function(msg, unblock) {
    var delayedCondVar = delayedBySession.of(this);
    while(true) {
      // Fact: in general, condition variables love while loops
      //       (http://stackoverflow.com/questions/7766057)
      // Fact: despite Node being a serious (semaphore-free) runtime, we do have
      //       a (self-inflicted) possibility for spurious wakeups (search
      //       for "spurious wakeup" below)
      // Claim: despite this, origHandler is called exactly once
      // Proof: "return" keyword appears exactly where origHandler is called
      // (and there are no sub-functions, meaning that "return" always mean
      // to return from this wrapper function)
      if (this.userId) return origHandler.call(this, msg, unblock);

      if (LoginFirst.canProcessBeforeLogin(this, msg)) {
        debug(this, "This gets processed without waiting:", msg);
        try {
          return origHandler.call(this, msg, unblock);
        } finally {
          // If origHandler throws, but manages to set the .userId,
          // notifyAll() too.
          // This may cause spurious wakeups, hence the while(true) loop
          var count = delayedCondVar.notifyAll();
          if (count) debug(this, "Unblocked " + count + " waiters");
        }
      } else {
        debug(this, "Not logged in – This will have to wait:", msg);
        unblock();  // i.e. allow caller to pump more messages
        // Note: possibly to thwart a class of TOCTTOU vulnerabilities, Meteor
        // forbids handlers from changing the .userId after they unblock().
        // This means that any auth-impacting, queued client messages will fail.
        delayedCondVar.wait();
      }
    }
  };
});
