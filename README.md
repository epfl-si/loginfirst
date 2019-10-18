Ensure that users log in first in a Meteor application.

This works by delaying treatment of incoming DDP messages, until
[`.setUserId()`](http://docs.meteor.com/#/full/method_setUserId) is
called.

# Instructions

If you would like to enforce that your application not work at all for
not logged-in users, proceed as follows:

1. `meteor add epfl:loginfirst`
2. Whitelist the method names that are not delayed, e.g.
   <pre>import LoginFirst from 'meteor/loginfirst'
   LoginFirst.whitelist.methods.append("myInnocuousMethodThatIsSoImportantThatItCannotWaitForTheUserToLogInFirst")
   LoginFirst.whitelist.subscriptions.append("dittoForSubscription")
   </pre>
3. ???
4. Profit!

(Step 3 probably involves, you know, putting some work into your
project — which ought to be easier now that your boss isn't pestering
you anymore about that flash of “sensitive” subscription data being
shown to unauthorized users, which probably includes himself at this
stage of the project, right behind that `alert()` box that tells him
to go pound sand)

# How It Works

The seerver rejects any and all method and subscription calls that are
not whitelisted are rejected immediately (i.e. no server-side [DDP
message
reordering](https://docs.meteor.com/api/methods.html#DDPCommon-MethodInvocation-unblock)
takes place), unless and until the user is logged in.

As far as subscriptions are concerned, the Meteor client-side runtime
does subscribe to a handful of them automagically as soon as the app
starts, and some of your app's widgets probably also do. All of these
subscriptions will get a `nosub` DDP response before login completes —
Which this is harmless, because client-side Meteor already knows to
retry all subscriptions whenever it sees `Meteor.userId` changing (and
that piece of information is sent over DDP *without* clients having to
subscribe to it). Also, the `meteor.loginServiceConfiguration`
subscription is whitelisted, which leavs your app free to display a
login prompt as usual, and then call the `login` method.

If you need to call a Meteor method before the standard `login` method
(which should be fairly unusual), make sure to whitelist it (see
above).
