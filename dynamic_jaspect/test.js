// This file will conatain all the core logic of jaspect. For now it's a staging designed to work with index.html

var scripts = top.document.getElementsByTagName('script');

ast = parse('function foo(x, y, z){\n return x + y + z; \n}');

varTest = parse('var x = 5;');
partAdded = createArray(varTest);
trav(ast);
console.log(deparse(ast));



function createArray(tree){

    tree.splice(0,1);
    return traverse(tree).get(["0", "0"]);
}

function trav(tree){

    if (typeof tree === 'string'){
        return;
    }

    for (var i = 0; i < tree.length; i++){

        if (tree[i] === 'defun'){
            tree[3].unshift(partAdded);
        }
        trav(tree[i]);
    }
}