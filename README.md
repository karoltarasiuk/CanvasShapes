#JSONChecker readme

The goal of this library is to provide nice interface for drawing using canvas element. There are few main contepts you need to get familiar with before you start working with this library:

##General concepts

###Scene

When we talk about a scene we talk about whole drawing. Scene in CanvasShapes is basically a `div` element. It can contain many layers - in fact as many as you want.

###Layer

Layer is a representation of the `canvas` itself. It means that you can have multiple `canvas` elements within one scene. It resolves many performance issues you can face, e.g. you don't need to redraw whole scene to perform an animation on one single shape. Instead you should place the shape on a separate layer and redraw only this layer when something changes.

###Coordinates

Anything you draw on the `canvas` should have defined position. Normally `canvas` uses pixels, but CanvasShapes allows you to also take advantage on so-called relative rendering, which accepts percents. It basically means that width and height of your scene are defined as 100%, so if you want to draw something directly in the middle of a scene, its coordinates should be passed as 50%. Using relative rendering you can change the size of your scene at any time (even on resize) and your drawing will fill the whole space.

The only issue you need to take on account is, that relative evaluation of coordinates can actually distort your drawing. So if possible, when changing the size of the drawing, try to preserve the same aspect ratio.

###Styling

Anything you draw will not be visible until you apply styling. Styling is applied after rendering, and being more specific, after closing the path.

##Building

There is a `Makefile` in the root of the repository. Works on Mac or Linux. By default (simply `make`) it builds the library and places it in the `build/` folder.

You can also run `make open` to open simple examples page. It requires Python to be installed.

##Documentation

Under development.

##Examples

In the root of the repository you can find `index.html` file with simple examples. If you're working on Mac or Linux, and have Python installed, you can run `make open` to see it.
