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
    workdir:['/srv/app'],
    entrypoint:'node index.js'
  }

  t.deepEqual(pojo, wanted)

  t.end()
  
})

tape('should parse a Dockerfile with line escapes', function (t) {

  var dockerFile = fs.readFileSync(__dirname + '/Dockerfile2', 'utf8')
  var pojo = parse(dockerFile)
  var wanted = {
    add:[],
    cmd:'[bash]',
    expose:[],
    volume:[],
    run:[
      'apt-get update && apt-get install -y     aufs-tools     automake     build-essential     curl     dpkg-sig     libcap-dev     libsqlite3-dev     mercurial     reprepro     ruby1.9.1     ruby1.9.1-dev     s3cmd=1.1.*  && rm -rf /var/lib/apt/lists/*'
    ],
    from:'ubuntu:14.04',
    workdir:['/', '/home'],
  }

  t.deepEqual(pojo, wanted)

  t.end()
  
})
