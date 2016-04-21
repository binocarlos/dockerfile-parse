module.exports = function(dockerFile){

        var arrayFields = ['add', 'expose', 'volume', 'run', 'workdir']
	var arrayFieldMap = {}
	var filters = {
		add:function(val){
			var parts = val.split(' ')
			return {
				source:parts[0],
				dest:parts[1]
			}
		},
		expose:function(val){
			var n = parseInt(val)
			if(isNaN(n)){
				n = val
			}
			return n
		}
	}

	var pojo = {}

	arrayFields.forEach(function(f){
		pojo[f] = []
		arrayFieldMap[f] = true
	})

        dockerFile = dockerFile.replace(/\\\n/g, '')
	var lines = dockerFile.split(/\r?\n/) || []

	lines.forEach(function(line){
		var cmd = null

                if (!line.trim() || line[0] === '#') {
                        return
                }

		line = line.replace(/^\w+ /, function(command){
			cmd = command.replace(/\s+/, '').toLowerCase()
			return ''
		})
		if(!cmd || !cmd.match(/\w/)){
			return
		}
		if(filters[cmd]){
			line = filters[cmd](line)
		}
		if(arrayFieldMap[cmd]){
			pojo[cmd].push(line)
		}
		else if(cmd === 'env') {
			if (!pojo.env) pojo.env = {}
			// you can have a ENV line with multiple vars
			// e.g. ENV VAR2=20 VAR3=30
			var vars = line.split(/[ =]/)
			var isKey=true
			var currentKey=null;
			vars.forEach(function(v){
				if(isKey){
					currentKey = v
				}
				else{
					pojo.env[currentKey] = v
				}
				isKey = !isKey
			})
		}
		else{
			pojo[cmd] = line
		}
	})

	return pojo
}
