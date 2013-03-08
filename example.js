// This file shows what the jaspect api could look like.


var myaspects = module.exports = function(jaspect){

  var context = {};
  var fooPointCut = {type:"call"};
  
  jaspect.after(fooPointCut, context, function(jp){
        
        console.log(jp.args);
        
  });
  
  

  
}
