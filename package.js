Package.describe({
  name: 'epfl:loginfirst',
  version: '0.3.0',
  summary: 'Block all DDP messages until the user has logged in',
  git: 'https://github.com/epfl-idevelop/loginfirst',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@1.8.1', 'METEOR@2.3.2']);
  api.use('modules')
  api.use('ecmascript')
  api.use('underscore')
  api.use('montiapm:meteorx@2.2.0', ['server'])
  api.mainModule('loginfirst-server.js', ['server'])
})

Npm.depends({
  "debug": "4.1.1"
})
