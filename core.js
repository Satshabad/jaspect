// This file will conatain all the core logic of jaspect. For now it's a staging designed to work with index.html

var burrito = require('burrito');
var parse = burrito.parse;
var deparse = burrito.deparse;

module.exports = function(sourceTree){
  var jaspect = {};
  var functionNumber = 0;
  
  jaspect.sourceTree = sourceTree;
  
  
  jaspect.after = function(pointcut, context, callback){
    
    var callBackName = "f"+ functionNumber.toString();
    var cbDeclaration = "var " + callBackName + " = " + callback.toString();
    functionNumber++;
    var callBackInsert = parse(callBackName+"()")[1][0][1];
    
    var ast = jaspect.sourceTree;
    ast = tacify(ast);
    
    
    if (pointcut.type == "call"){
    	var aspectedAst = instrumentOnCall(callBackInsert, parse(JSON.stringify(context))[1][0], "after", ast);
    }
    
    if (pointcut.type == "execute"){
    	var aspectedAst = instrumentOnExecute(callBackInsert, parse(JSON.stringify(context))[1][0], "after", ast);
    }


    ast[1].unshift(parse(cbDeclaration)[1][0]);
    
    jaspect.sourceTree = aspectedAst;
    
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
      tacifyNested: tacifyNested
    	
  
  }
    
  return jaspect;
}
  
  
// Helper functions 
  
var tacify = function(ast){
    return ast;
}
    
    
var instrumentOnCall = function(toBeInserted, context, adviceLocation, tree){
  
  var ast = tree;
  
  var inner = function(toBeInserted, tree){

    if (typeof tree === 'string' || tree == null){
        return;
      }
    
    for (var i = 0; i < tree.length; i++){
      
      if(isNodeTypeOf(tree[i], "stat") || isNodeTypeOf(tree[i], "var")){
        call = getCall(tree[i]);
        if (call != false){

          joinPoint = ["object",[["args",["array",call[2]]],["that", getCallContext(call)], ["context", context]]];

          var currentInsert = JSON.parse(JSON.stringify(toBeInserted));
          currentInsert[2].push(joinPoint);
          if (adviceLocation == "before"){
          	tree.splice(i, 0, currentInsert);
          } else if(adviceLocation == "after"){
          	tree.splice(i+1, 0, currentInsert);
            i++;
          }
          

        } else {
          inner(toBeInserted, tree[i]);
        }
      
      }else{
      	inner(toBeInserted, tree[i]);
      }
    }    
  }
    
  inner(toBeInserted, tree);
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

     if (typeof tree === 'string' || tree == null){
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
  if (typeof ast === 'string' || ast == null){
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
        call = replaceDeepestCall(node, newVar);
        newCode += "var "+ deparse(newVar) + " = " + deparse(call) + ";";
        tempVarId++;
    }

    newCode += deparse(node);
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
