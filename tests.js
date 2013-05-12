var assert = require('assert');
var vm = require('vm');

var heredoc = require('heredoc');

var jaspect = require('./core');
var parser = require('./parser');
var parse = parser.parse;
var deparse = parser.deparse;

var getResultingContext = function (code) {


  var context = vm.createContext({});
  vm.runInContext(code, context);
  return context
 
};

suite("Call", function () {        

  test('should not effect result', function () {
    var jaspecter =  jaspect(parse(heredoc(function () {/*
       var foo = function(x, y){
          return x+y;
        }

        x = foo(4,5);
        
        */})));


    jaspecter.before({type:'call', name:'.*'}, {}, function (jp) {
      
    });

    var newContext = getResultingContext(deparse(jaspecter.sourceTree))
    assert.equal(newContext.x, 9);

  });

  test('should only be called once', function () {
    var jaspecter =  jaspect(parse(heredoc(function () {/*
       var foo = function(x, y){
          return x+y;
        }

        x = foo(4,5);
        
        */})));

    jaspecter.before({type:'call', name:'.*'}, {numberOfCalls:0,}, function (jp) {
      jp.context.numberOfCalls++;
    });

    var newContext = getResultingContext(deparse(jaspecter.sourceTree))
    assert.equal(newContext.__context0.numberOfCalls, 1);

  });

  test('should only be called on regex matches', function () {
    var jaspecter =  jaspect(parse(heredoc(function () {/*
       var foo = function(x, y){
        }

       var bar = function(x, y){
        }

        x = foo(4,5);
        y = bar(4,5);
        
        */})));

    jaspecter.before({type:'call', name:'bar'}, {calledOn:[]}, function (jp) {
      jp.context.calledOn.push(jp.name);
    });

    var newContext = getResultingContext(deparse(jaspecter.sourceTree))
    assert.deepEqual(newContext.__context0.calledOn,['bar'] );

  });


  test('should capture args', function () {
    var jaspecter =  jaspect(parse(heredoc(function () {/*
       var foo = function(x, y){
          return x+y;
        }

        x = foo(4,5);
        
        */})));


    jaspecter.before({type:'call', name:'.*'}, {args:[]}, function (jp) {
      jp.context.args = jp.args;
      
    });

    var newContext = getResultingContext(deparse(jaspecter.sourceTree))
    assert.deepEqual(newContext.__context0.args, [4,5]);
 
  });

  suite("Before", function () {        
   test('should be called only before', function () {
      var jaspecter =  jaspect(parse(heredoc(function () {/*
         var foo = function(x, y){
            state.z = 9;
            return x+y;
          }

          state = {}

          x = foo(4,5);
          
          */})));

      jaspecter.before({type:'call', name:'.*'}, {}, function (jp) {
        state.z = 80 
      });

      var newContext = getResultingContext(deparse(jaspecter.sourceTree))
      assert.equal(newContext.state.z, 9)
   

    });
  });

  suite("After", function () {        
   test('should be called only after', function () {
      var jaspecter =  jaspect(parse(heredoc(function () {/*
         var foo = function(x, y){
            state.z = 9;
            return x+y;
          }

          state = {}

          x = foo(4,5);
          
          */})));

      jaspecter.after({type:'call', name:'.*'}, {}, function (jp) {
        state.z = 80 
      });

      var newContext = getResultingContext(deparse(jaspecter.sourceTree))
      assert.equal(newContext.state.z, 80)
   

    });
  });

});
