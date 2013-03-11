# Getting Started with Aspects for JavaScript
An aspect of a program is a feature linked to many other parts of the program, but which is not related to the program's primary function.
Jaspect let's you write these aspects separately and then add them in at the last minute.

## The canonical logging example

This some code that you might write:

```
// in myStuff.js

var myMult = function(x, y, z){
    return x * y * z;
}

myMult(myMult(2,3,4),2,3);
```

To log before every call to myMult:

```
// in loggingAspect.js

module.exports = function(jaspect){

  var context = {};
  var multPointCut = {type:"call", name:"myMult"};
  
  jaspect.before(multPointCut, context, function(joinPoint){
        
        console.log("DEBUG " + joinPoint.name + joinPoint.args);
        
  });
}
```

Finally to apply the aspect to your code:

```
jaspect -j loggingAspect.js myStuff.js
```

When the resulting file is run we get the following output:

```
DEBUG myMult 2,3,4
DEBUG myMult myMult(2,3,4), 2, 3
```


## Installation

```
npm install -g jaspect
```

## Definitions

#### Aspect
An aspect of a program is a feature linked to many other parts of the program, but which is not related to the program's primary function.

#### Join Point
A specific point in the control flow of your program.

#### Cut Point
A set of join points.

#### Advice
A piece of code to be executed on all join points in a cut point.

# Documentation

## Point Cuts

## Advice

## Usage

## Limitations

# Contributing


