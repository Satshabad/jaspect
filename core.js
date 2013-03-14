// This file will conatain all the core logic of jaspect. For now it's a staging designed to work with index.html

var burrito = require('burrito');
var parse = burrito.parse;
var deparse = burrito.deparse;
var tacify = require('./tacify');

module.exports = function(sourceTree){
  var jaspect = {};
  var functionNumber = 0;
  
  jaspect.sourceTree = tacify(sourceTree);
  
  
  jaspect.after = function(pointcut, context, callback){
    
    instrument(pointcut, context, callback, "after");
    
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
  
  jaspect.before = function (pointcut, context, callback){
    
    instrument(pointcut, context, callback, "before");
    
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

  var instrument =  function(pointcut, context, callback, adviceLocation){
    
    var callBackName = "f"+ functionNumber.toString();
    var cbDeclaration = "var " + callBackName + " = " + callback.toString();
    functionNumber++;
    var callBackInsert = parse(callBackName+"()")[1][0][1];
    
    var ast = jaspect.sourceTree;
    
    
    if (pointcut.type == "call"){
    	var aspectedAst = instrumentOnCall(callBackInsert, adviceLocation, ast, pointcut.name);
    }
    
    if (pointcut.type == "execute"){
    	var aspectedAst = instrumentOnExecute(callBackInsert, adviceLocation, ast, pointcut.name);
    }

    context = parse("var __context__ = "+JSON.stringify(context))[1][0];


    ast[1].unshift(parse(cbDeclaration)[1][0]);
    // Need to only insert this once. Multiple calls to before and after will insert more than 1
    ast[1].unshift(context);
    
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

    
  // export the helper functions for tests
  jaspect.privateFunctions = { 
  }
    
  return jaspect;
}
  
  
// Helper functions 
  

   
var instrumentOnCall = function(toBeInserted, adviceLocation, tree, onName){
  
  var ast = tree;
  
  var inner = function(toBeInserted, tree){

    if (typeof tree === 'string' || tree == null){
        return;
      }
    
    for (var i = 0; i < tree.length; i++){
      if(isNodeTypeOf(tree[i], "stat") || isNodeTypeOf(tree[i], "var")){
        call = getCall(tree[i]);
        if (call != false && new RegExp(onName).exec(deparse(call))){

          joinPoint = ["object",[["args",["array",call[2]]],["that", getCallContext(call)], ["context", ["name", "__context__"]]]];
          var currentInsert = JSON.parse(JSON.stringify(toBeInserted));
          currentInsert[2].push(joinPoint);
          if (adviceLocation == "before"){
            
          	tree.splice(i, 0, currentInsert);
            i++;
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
  if (node[1][0] == "name"){
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
