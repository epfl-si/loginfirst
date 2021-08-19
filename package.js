Package.describe({
  name: 'epfl:loginfirst',
  version: '0.3.0',
  summary: 'Block all DDP messages until the user has logged in',
  git: 'https://github.com/epfl-idevelop/loginfirst',
  documentation: 'README.md'
})

function use_runtime_dependencies (api) {
  api.use('ecmascript')
  api.use('underscore')
  api.use('montiapm:meteorx@2.2.0', ['server'])
}

Package.onUse((api) => {
  api.versionsFrom(['METEOR@1.8.1', 'METEOR@2.3.2']);
  api.use('modules')
  use_runtime_dependencies(api)
  api.mainModule('loginfirst-server.js', ['server'])
})

Package.onTest((api) => {
  use_runtime_dependencies(api)
  api.use('meteortesting:mocha')
  api.use('ddp')

  api.mainModule('tests/server-tests.js', ['server'])
})

Npm.depends({
  "debug": "4.1.1"
})
