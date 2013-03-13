// This file shows what the jaspect api could look like.


var myaspects = module.exports = function(jaspect){

  var context = {calls: 0};
  var anyPointCut = {type:"call", name:".*"};
  
  jaspect.before(anyPointCut, context, function(jp){
        
        console.log(jp.args);
        context.calls++;
        
  });
  
  

  
}
