// This file shows what the jaspect api could look like.

jaspect = require('jaspect'); // If this being used server side, then this works. Otherwise it should be made avaible with a script tag?

var anyFunctionPointCut = {"file":"myfile.js",
                         
                         "functionName":"*",
                         
                         "args":"*"};
    

var fooPointCut = {"file":"myfile.js",
                         
                         "functionName":"foo",
                         
                         "args":"*"};

jaspect.before(fooPointCut, function(jointPoint){
      
      console.log(jointPoint.params());
      
});


jaspect.around(fooPointCut, function(jointPoint){
      
      console.log(jointPoint.params());
      var result = joinPoint.proceed();
      
  		return result
      
});