

var scripts = top.document.getElementsByTagName('script');



var src = burrito('f() && g(h())\nfoo()', function (node) {
    if (node.name === 'call') node.wrap('qqq(%s)');
});

console.log(src);