// This file will contain the logic that interfaces with core.js to process a js file on the server side.

var fs = require('fs');
var beautify = require('js-beautify').js_beautify;
var burrito = require('burrito');
var parse = burrito.parse;
var deparse = burrito.deparse;
var jaspectcore = require("./core");
var argv = require('optimist')
    .demand(['j']) 
    .argv;

var files = argv._; // this will give us a list of files the user wants to apply their advise to

var jaspectfile = argv.j; // -j will give us the file the user will write conatining the pointcuts and advice

var useraspects = require("./"+jaspectfile);
fs.mkdir('aspects/'); // create dir to save files

// Loop through files given in command line
for(var i = 0; i < files.length; i++){

	// Create new filename
	filename = files[i].substr(files[i].lastIndexOf('/') + 1);
	newname = filename.substr(0, filename.lastIndexOf('.')).concat('_jaspect.js');

	// read file
	var file = fs.readFileSync(files[i], 'utf8');
	data = jaspectcore(parse(file));
	useraspects(data);

	// write to new file
	// Using beautify to make code nicer
	fs.writeFile('aspects/'.concat(newname), beautify(deparse(data.sourceTree)));

}