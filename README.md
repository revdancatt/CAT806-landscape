CAT806-landscape
================

~~It's getting cold, I needed something to keep myself warm this evening and since I have Flash turned off I thought WebGL would do the trick.~~

I've updated the code to use fake 3D in 2D rather than real 3D projected into 2D with WebGL.
Mainly because I know what I'm doing in 2D and not so much in 3D yet. I'm pretty sure that
it's all be much faster in Three.js but until then here we go...

http://revdancatt.github.com/CAT806-landscape/

...If you're on Chrome or Safari you should see a nice CSS blur effect going on, this is done by
rendering to 3 stacked transparent canvas elements, which you can see here...

http://revdancatt.github.com/CAT806-landscape/panels.html 

~~You will need a WebGL enabled browser.~~

TO-DO:

1. ~~Shed load of optimisation and cheating to make it run smoother.~~
2. A sky, because that may be nice. 