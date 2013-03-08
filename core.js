// This file will conatain all the core logic of jaspect. For now it's a staging designed to work with index.html

var burrito = require('burrito');
var parse = burrito.parse;
var deparse = burrito.deparse;

module.exports = function(sourceTrees){
	var jaspect = {};
  var functionNumber = 0;
  
  jaspect.sourceTrees = sourceTrees;
  
  
  jaspect.after = function(pointcut, context, callback){
    
    var callBackName = parse("f"+ funtionNumber.toString()+"()")[1][0][1];
    var cbDeclaration = "var" + deparse(callBackName) + " = " + callback.toString();
    funtionNumber++;
    
    var ast = sourceTrees[pointcut.file];
    
    ast = tacify(ast);
    
    ast[1].unshift(parse(cbDeclaration)[0]);
    
    if (point.type == "call"){
    	var aspectedAst = instrumentOnCall(callBackName, deparse(context.toString()), "after", ast);
    }
    
    if (point.type == "execute"){
    	var aspectedAst = instrumentOnExecute(callBackName, deparse(context.toString()), "after", ast);
    }
    
    sourceTrees[pointcut.file] = aspectedAst;
    
    /* insertions for this advice will be as follows:

			 after call: 

			 doStuff(1,2,3);
       callback(jp); 
       
       jp.args = list args that were passed in
       jp.sourceLocation = file/line of the advised call
       jp.that = the 'this' context in which the call was made
       jp.pointcut = the pointcut that instrumented the advice

       after execute:

			 ?????????
		*/
    
    
  }
  
  jaspect.before = function (pointcut, callback){
    
    
    
    /* insertions for this advice will be as follows:

			 before call: 

       callback(jp);
			 doStuff(1,2,3);

       jp.args = list args that were passed in
       jp.sourceLocation = file/line of the advised call
       jp.that = the 'this' context in which the call was made
       jp.pointcut = the pointcut that instrumented the advice

       before execute:

			 function dostuff(x,y,z){ callback(jp); return x + y + z;}
			 var dostuff = function(x,y,z){ callback(jp); return x + y + z;} 
 
       jp.args = list args that were passed in
       jp.sourceLocation = file/line of the advised call, basicallly the first line of function def
       jp.that = the 'this' context in the function definition
       jp.pointcut = the pointcut that instrumented the advice

		*/
    

  }
    
  jaspect.around =  function(pointcut, callback){
    
    /* insertions for this advice will be as follows:

			 around call: 

       callback(jp); //doStuff(1,2,3);

			 jp.proceed() = let the function execute and recieve the result
       jp.args = list args that were passed in
       jp.sourceLocation = file/line of the advised call
       jp.that = the 'this' context in which the call was made
       jp.pointcut = the pointcut that instrumented the advice

       around execute:

			 ??????????

		*/

  }
    
  // export the helper functions for tests
  jaspect.privateFunctions = { 
      
      traverse: traverse,
      tacify : tacify
    	
  
  }
    
  return jaspect;
}
  
  
// Helper functions 
  
var tacify = function(ast){

}
    
    
var instrumentOnCall = function(toBeInserted, context, adviceLocation, tree){
  
  var ast = tree;
  
  var inner = function(toBeInserted tree){

    if (typeof tree === 'string'){
        return;
      }
    
    for (var i = 0; i < tree.length; i++){
      
      if(isNodeType(tree[i], "stat") || isNodeType(tree[i], "var")){
     
        call = getCall(tree[i]);
        if (call != false){

          joinPoint = ["object",[["args",["array",call[2]],["that", getCall(call)], ["context", context]]]];
          toBeInserted[2].push(joinPoint);
          if (adviceLocation == "before"){
          	tree.splice(i, 0, toBeInserted);
          } else if(adviceLocation == "after"){
          	tree.splice(i+1, 0, toBeInserted);
            i++;
          }
          

        } else {
          insertAfter(toBeInserted, tree[i]);
        }
      
      }else{
      	insertAfter(toBeInserted, tree[i]);
      }
    }    
  }
    
  inner(toBeInserted, targetNode, tree);
  return ast;
  
}


var getCallContext = function(node){
  if (node[1] == "name"){
    return ["name", "this"];
  }

  return node[1];



}
    
var getCall = function(tree){
   
   var call = false;
   
   var inner = function(tree){

     if (typeof tree === 'string'){
          return;
        }
     
     for (var i = 0; i < tree.length; i++){
        
       if (tree[i] === "call"){
         call = tree;
        }
       
        inner(tree[i]);
      }
   }
   
   inner(tree);
   return call;
   
 
}

var isNodeTypeOf = function(ast, type){
  if (typeof ast === 'string'){
        return false;
      }
  
  if (ast.length == 0){
      return false;
  }

  return ast[0] == type;
}

// foo(bar())
// t1 = bar()
// foo(t1)

var tacifyNested = function(node){

    newCode = "";
    tempVarId = 0;

    while(numberOfCalls(node) > 1){

        newVar = parse("__t"+tempVarId.toString())[1][0][1];
        console.log(newVar);
        call = replaceDeepestCall(node, newVar);
        newCode += "var "+ deparse(newVar) + " = " + deparse(call) + ";";
        tempVarId++;
    }

    newCode += deparse(node)
    return parse(newCode);
}


var numberOfCalls = function(tree){

  callCount = 0;

  var inner = function(tree){

    if (typeof tree === 'string'){
      if (tree == "call"){
          callCount = callCount+1;
      }
      return;
    }

    for (var i = 0; i < tree.length; i++){
      inner(tree[i]);
    }
  }

  inner(tree);
  return callCount;
  
}

var replaceDeepestCall = function(tree, newVar){

  var ast = tree;
  var call = undefined;
  var deepestCall = -1;


  var findDepth = function(tree, depth){
    if (typeof tree === 'string'){
      if (tree == "call"){
          if (depth > deepestCall){
              deepestCall = depth;
          }
      }
      return;
    }

    for (var i = 0; i < tree.length; i++){
      findDepth(tree[i], depth++);
    }
  }

  var replaceCall = function(tree, depth){
    if (typeof tree === 'string'){
      return;
    }

    for (var i = 0; i < tree.length; i++){
      if(isNodeTypeOf(tree[i], "call") && depth === deepestCall){
        call = tree[i];
        tree[i] = newVar;
      }
      replaceCall(tree[i], depth++);
    }
  }
  

  findDepth(tree, 0);
  replaceCall(tree, 0);
  return call;
}
