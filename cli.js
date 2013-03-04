// This file will contain the logic that interfaces with core.js to process a js file on the server side.

var fs = require('fs');

var jaspectcore = require("./core");
var argv = require('optimist')
    .demand(['j']) 
    .argv;

var files = argv._; // this will give us a list of files the user wants to apply their advise to

var jaspectfile = argv.j; // -j will give us the file the user will write conatining the pointcuts and advice

console.log(files + jaspectfile);


var jaspectuser = require("./"+jaspectfile);

files.forEach()



fs.readFile('/etc/hosts', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});