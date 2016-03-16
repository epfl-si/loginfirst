Package.describe({
  name: 'epfl:loginfirst',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Queue all DDP messages until the user has logged in',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/epfl-sti/loginfirst',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('underscore');
  api.use('meteorhacks:meteorx@1.0.2', ['server']);
  api.addFiles('loginfirst-common.js');
  api.addFiles('loginfirst-server.js', ['server']);
  api.export("LoginFirst");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('epfl:loginfirst');
  api.addFiles('loginfirst-tests.js');
});

Npm.depends({
  "debug": "2.2.0",
  "fibers": "1.0.7",
  "weak-map": "1.0.5"   // Because https://github.com/meteor/meteor/issues/5124
});
