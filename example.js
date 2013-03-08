// This file shows what the jaspect api could look like.


var myaspects = module.exports = function(jaspect){

  var context = {calls: "0"};
  var fooPointCut = {type:"call", name:".*"};
  
  jaspect.before(fooPointCut, context, function(jp){
        
        console.log(jp.args);
        context.calls++;
        
  });
  
  

  
}
