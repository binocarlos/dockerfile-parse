dockerfile-parse
================

[![Travis](http://img.shields.io/travis/binocarlos/dockerfile-parse.svg?style=flat)](https://travis-ci.org/binocarlos/dockerfile-parse)

Parse a Dockerfile into a POJO

## install

```
$ npm install dockerfile-parse
```

## usage

Take this Dockerfile for example:

```
FROM quarry/monnode
ADD . /srv/app
RUN cd /srv/app && npm install
RUN cd /srv/app && make build
WORKDIR /srv/app
VOLUME /srv/data
ADD /my/source /src/dest
EXPOSE 80
EXPOSE 9989
VOLUME /srv/data2
RUN cd /srv/app && make build2
ENTRYPOINT node index.js
```

Lets parse it into a JavaScript object to see what it says:

```js
var fs = require('fs')
var parse = require('docker')

var dockerFile = fs.readFileSync(__dirname + '/Dockerfile', 'utf8')
var pojo = parse(dockerFile)

console.dir(pojo)

/*

{
	from:'quarry/monnode',
	workdir:'/srv/app',
	entrypoint:'node index.js',
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
	]
}
	
*/
```

## api

### `var pojo = parse(dockerFileString)`

Return a parsed version of the string that is a Dockerfile contents.

The pojo will have array fields for the following statements:

 * add -> {source:'', dest:''}
 * expose
 * volume
 * run

## license

MIT