var parse = require('../')
var tape     = require('tape')
var fs = require('fs')

tape('should parse a Dockerfile', function (t) {

  var dockerFile = fs.readFileSync(__dirname + '/Dockerfile', 'utf8')
  var pojo = parse(dockerFile)
  var wanted = {
    add:[{
      source:'.',
      dest:'/srv/app'
    }, {
      source:'/my/source',
      dest:'/src/dest'
    }],
    expose:[80, 9989],
    volume:['/srv/data', '/srv/data2'],
    run:[
      'cd /srv/app && npm install',
      'cd /srv/app && make build',
      'cd /srv/app && make build2'
    ],
    env:{
      VAR1:'10',
      VAR2:'20',
      VAR3:'30',
      VAR4:'20'
    },
    from:'quarry/monnode',
    workdir:'/srv/app',
    entrypoint:'node index.js'
  }

  t.deepEqual(pojo, wanted)

  t.end()
  
})
