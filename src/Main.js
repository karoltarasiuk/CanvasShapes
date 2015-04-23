/*global _*/

var CanvasShapes = {};

/**
 * Initializes a library and returns the object you should start with.
 *
 * @return {CanvasShapes.Renderer}
 */
CanvasShapes.init = function (config) {

    CanvasShapes.Config.set(config);

    return new CanvasShapes.Renderer();
};
