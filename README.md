### Getting Started with Aspects for JavaScript
Aspects are a way to add additional functionality to your JavaScript without modifying the original code.

Let's look at the canonical logging example. Here's some code that you might write:

```
// in myStuff.js

var myMult = function(x, y, z){
    return x * y * z;
}

myMult(myMult(2,3,4),2,3);
```
Now to add a log statement to every call to myMult:

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

Now we need to apply the aspect to the code. This will output a new file with the logging statements:

```
jaspect -j loggingAspect.js myStuff.js
```




If you're using the GitHub for Mac, simply sync your repository and you'll see the new branch.

### Designer Templates
We've crafted some handsome templates for you to use. Go ahead and continue to layouts to browse through them. You can easily go back to edit your page before publishing. After publishing your page, you can revisit the page generator and switch to another theme. Your Page content will be preserved if it remained markdown format.

### Rather Drive Stick?
If you prefer to not use the automatic generator, push a branch named `gh-pages` to your repository to create a page manually. In addition to supporting regular HTML content, GitHub Pages support Jekyll, a simple, blog aware static site generator written by our own Tom Preston-Werner. Jekyll makes it easy to create site-wide headers and footers without having to copy them across every page. It also offers intelligent blog support and other advanced templating features.

### Authors and Contributors
You can @mention a GitHub username to generate a link to their profile. The resulting `<a>` element will link to the contributor's GitHub Profile. For example: In 2007, Chris Wanstrath (@defunkt), PJ Hyett (@pjhyett), and Tom Preston-Werner (@mojombo) founded GitHub.

### Support or Contact
Having trouble with Pages? Check out the documentation at http://help.github.com/pages or contact support@github.com and we’ll help you sort it out.
