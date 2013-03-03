// This file will conatain all the core logic of jaspect. For now it's a staging designed to work with index.html

var burrito = require('burrito');
var parse = burrito.parse;

module.exports = function(files){
	jaspect = {};
  
  
  jaspect.files = files;
  
  
  var traverse = function(tree){
  
    if (typeof tree === 'string'){
      return;
    }
    
    for (var i = 0; i < tree.length; i++){
      
      if (tree[i] === 'defun'){
        tree[3].unshift(["stat", ["call", ["name", "bar"], []]]);
      }
      traverse(tree[i]);
    }
  
  }
  

  jaspect.after = function(pointcut, callback){

  }
  
  jaspect.before = function (pointcut, callback){

  }
    
  jaspect.around =  function(pointcut, callback){

  }
    
    
    
  return jaspect;
}

  

