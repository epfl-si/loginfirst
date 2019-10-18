Package.describe({
  name: 'epfl:loginfirst',
  version: '0.0.2',
  summary: 'Queue all DDP messages until the user has logged in',
  git: 'https://github.com/epfl-idevelop/loginfirst',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.8.1')
  api.use('modules')
  api.use('ecmascript')
  api.use('underscore')
  api.use('lamhieu:meteorx@2.1.1', ['server'])
  api.mainModule('loginfirst-server.js', ['server'])
})

Npm.depends({
  "debug": "4.1.1"
})
