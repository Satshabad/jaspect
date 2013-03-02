jaspect = require('jaspect'); // If this being used server side, then this works. gotta figure out something else for when being used on client

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