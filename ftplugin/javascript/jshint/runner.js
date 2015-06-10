var cli = require('jshint/src/cli'),
	unix = require('jshint/src/reporters/unix');

var options = process.argv[2] ? cli.loadConfig(process.argv[2]) : {};

cli.run({
	useStdin: true,
	args: [],
	config: options,
	ignores: [],
	reporter: unix.reporter
}, function() {});