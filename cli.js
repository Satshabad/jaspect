// This file will contain the logic that interfaces with core.js to process a js file on the server side.

var fs = require('fs');
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




fs.readFile(files[0], 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  jaspectcore = jaspectcore(parse(data));
  useraspects(jaspectcore);
  console.log(deparse(jaspectcore.sourceTree));

});
