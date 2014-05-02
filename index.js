module.exports = function(dockerFile){

	var arrayFields = ['add', 'expose', 'volume', 'run']
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

	var lines = dockerFile.split(/\r?\n/) || []

	lines.forEach(function(line){
		var cmd = null
		line = line.replace(/^\w+ /, function(command){
			cmd = command.replace(/\s+/, '').toLowerCase()
			return ''
		})
		if(filters[cmd]){
			line = filters[cmd](line)
		}
		if(arrayFieldMap[cmd]){
			pojo[cmd].push(line)
		}
		else{
			pojo[cmd] = line
		}
	})

	return pojo
}