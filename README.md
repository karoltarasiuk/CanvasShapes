#CanvasShapes readme

The goal of this library is to provide nice interface for drawing using canvas element. There are few main contepts you need to get familiar with before you start working with this library:

##General concepts

###Renderer

Renderer is a concept of a drawing manager. It can manage many different drawings at once. But the truth is, is't not advised - for different drawings you should probably create another renderer object. Whole animation loop is also managed from here, but as a static method, to allow you to run it once - for all renderers.

###Scene

When we talk about a scene we talk about whole drawing. Scene in CanvasShapes is basically a `div` element. It can contain many layers - in fact as many as you want.

###Layer

Layer is a representation of the `canvas` itself. It means that you can have multiple `canvas` elements within one scene. It resolves many performance issues you can face, e.g. you don't need to redraw whole scene to perform an animation on one single shape. Instead you should place the shape on a separate layer and redraw only this layer when something changes.

###Coordinates

Anything you draw on the `canvas` should have defined position. Normally `canvas` uses pixels, but CanvasShapes allows you to also take advantage on so-called relative rendering, which accepts percents. It basically means that width and height of your scene are defined as 100%, so if you want to draw something directly in the middle of a scene, its coordinates should be passed as 50%. Using relative rendering you can change the size of your scene at any time (even on resize) and your drawing will fill the whole space.

The only issue you need to take on account is, that relative evaluation of coordinates can actually distort your drawing. So if possible, when changing the size of the drawing, try to preserve the same aspect ratio. But if it's impossible, there is another solution. Relative rendering is set on the shape level, which means, that you can enable it only for those shapes which need it. Others can be rendered traditionally.

###Styling

Anything you draw will not be visible until you apply styling. Styling is applied after rendering, and being more specific, after closing the path. You can take advantage of anything available on a canvas, because style definition is basically a function accepting canvas as its parameter.

##Building

There is a `Makefile` in the root of the repository. Only tested on Mac though, but should also work on Linux. By default (simply `make`) it builds the library and places it in the `build/` folder.

You can also run `make open` to open simple examples page. It requires Python to be installed.

##Testing

To run tests type `make tests`. It will open your default browser with test results. CanvasShapes uses jasmine testing framework.

##Documentation

Visit the [wiki page](https://github.com/karoltarasiuk/CanvasShapes/wiki) to see full documentation. If for some reason it's not finished or even started, don't hesitate to look into the code, as everything is documented there as well.

##Examples

In the root of the repository you can find `index.html` file with simple examples. If you're working on Mac or Linux, and have Python installed, you can run `make open` to see it.
