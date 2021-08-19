# Version 0.3.0

**Security release**

Versions prior to this one suffer a fatal (and embarrassing) security
flaw that doesn't actually block method calls (i.e. writes) prior to
logging in. Please upgrade as soon as possible.

# Version 0.2.0

Maintenance-only release containing only forward compatibility fixes.

- Support latest Meteor
- Change meteorx package, following upstream change of maintainership

# Version 0.1.0

Rewritten from scratch, massive code simplification.

- Meteor 1.8
- [ECMAScript-style module / `import` system](https://docs.meteor.com/packages/modules.html#Enabling-modules)

Breaking changes:

- `LoginFirst.allowedMethodNames` is now called `LoginFirst.whitelist.methods`

New features:

- There is likewise a `LoginFirst.whitelist.subscriptions`


# Version 0.0.2

... Details lost in the mist of time
