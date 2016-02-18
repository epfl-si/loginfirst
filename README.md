Ensure that users log in first in a Meteor application.

This works by delaying treatment of incoming DDP messages, until
[`.setUserId()`](http://docs.meteor.com/#/full/method_setUserId) is
called.

# Instructions

If you would like to enforce that your application not work at all for
not logged-in users, proceed as follows:
1. `meteor add loginfirst`
2. Whitelist the method names that are not delayed, e.g.
   <pre>LoginFirst.allowedMethodNames = ["<a href="https://github.com/epfl-sti/accounts-tequila">tequila.authenticate</a>"];</pre>
   Obviously, if the client is supposed to provide the credentials you should at least whitelist the method that lets them do just that.
3. ???
4. Profit!

# Gotchas

Some care must be taken to write the client properly, because the
failure mode is not fatal. Specifically:
* while it doesn't have to be the very first thing it does, the client
  would be well-advised to log in at `Meteor.startup()` time;
* and it better deal properly with failures in the authentication method call (if that
  is what it uses).

Failure to follow this advice will cause the client to stay catatonic
(search boxes, buttons etc have no effect) for no obvious reason (to
the user).

