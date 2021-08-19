Ensure that users log in first in a Meteor application.

This works by delaying treatment of incoming DDP messages, until
[`.setUserId()`](http://docs.meteor.com/#/full/method_setUserId) is
called.

# Instructions

If you would like to enforce that your application not work at all for
not logged-in users, proceed as follows:

1. `meteor add epfl:loginfirst`
2. (optional) Whitelist any Meteor methods and subscriptions that should not be delayed, e.g.
   <pre>import LoginFirst from 'meteor/epfl:loginfirst'
   LoginFirst.whitelist.methods.append("myInnocuousMethodThatIsSoImportantThatItCannotWaitForTheUserToLogInFirst")
   LoginFirst.whitelist.subscriptions.append("dittoForSubscription")
   </pre>
3. ???
4. Profit!

(Step 3 may involve, you know, putting some work into your project)

# How It Works

The server rejects any and all method calls and subscription requests
(unless whitelisted), and rejects them promptly (i.e. no server-side
[DDP message
reordering](https://docs.meteor.com/api/methods.html#DDPCommon-MethodInvocation-unblock)
takes place), unless and until the user is logged in.

As far as subscriptions are concerned, the Meteor client-side runtime
does subscribe to a handful of them automagically as soon as the app
starts, and some of your app's widgets might do same. All of these
subscriptions will get a `nosub` DDP response before login completes —
But that is harmless, because client-side Meteor already knows to retry
all subscriptions whenever the `login` method succeeds¹. Also, the
`meteor.loginServiceConfiguration` subscription is whitelisted by
default, which allows your app to display a login prompt as usual,
prior to calling the `login` method.

If you need to call a DDP *method* before `login` (which should be
fairly unusual), make sure to whitelist it (see above).

¹ [Covered by a test in `meteor/packages/accounts-base/accounts_reconnect_tests.js`](https://github.com/meteor/meteor/blob/dd13980b938873d3550ab6f92cf26d9d6195b724/packages/accounts-base/accounts_reconnect_tests.js#L98)
