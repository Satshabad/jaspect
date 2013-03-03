// This file will conatain all the core logic of jaspect. For now it's a staging designed to work with index.html

var scripts = top.document.getElementsByTagName('script');

ast = parse('function foo(x, y, z){\n return x + y + z; \n}');
ast12 = parse('function foo(x, y, z){\n return x + y + z; \n}');
ast13 = parse('function foo(x, y, z){\n return x + y + z; \n}');

// Sticking inside
test1 = parse('baz();');
test2 = parse('red(3);');
varTest = parse('var x = 5;');
fun = parse('function foo(x, y, z){\n return x + y + z; \n}');

// call to baz()
test(ast, test1);

// add call to red(3) to same function
test(ast, test2);

// test variable
test(ast12, varTest);

// function inside function
test(ast13, fun);


function test(tree, adding){

    // first part is to create the Array that will be added to the function
    var partAdded = createArray(adding);

    // next get the indicies of where we will be adding the part
    var indices = getIndex(tree);

    // adding part to parse tree
    tree[indices[0]][indices[1]][indices[2]].unshift(partAdded);
    console.log(deparse(tree));
}

function createArray(tree){

    // Take out the top level
    tree.splice(0,1);

    // return the array
    // https://github.com/substack/js-traverse#getpath
    return traverse(tree).get(["0", "0"]);
}

function getIndex(tree){
    var nodePath;
    var nodeLevel;
    traverse(tree).forEach(function (x) {
        if(x == 'defun'){
            // https://github.com/substack/js-traverse#thispath
            // https://github.com/substack/js-traverse#thislevel
            nodePath = this.path;
            nodeLevel = this.level;
        }
    });

    return [ nodePath[0], nodePath[1], nodeLevel]
}