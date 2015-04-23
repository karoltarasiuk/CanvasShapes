/*global _, CanvasShapes, JSONChecker*/

CanvasShapes.SceneInterface = (function () {

    var SceneInterface = function () {
        throw new CanvasShapes.Error(8008);
    };

    CanvasShapes.Class.extend(SceneInterface.prototype, {

        className: 'CanvasShapes.SceneInterface',

        /**
         * Allows to render any number of passed objects.
         */
        render: function () {
            throw new CanvasShapes.Error(9018);
        },

        /**
         * Creates new layer on the scene. `width`, `height`, `left` and `top`,
         * parameters will be passed to CanvasShapes.SceneLayer constructor.
         *
         * @param {integer} width   [OPTIONAL]
         * @param {integer} height  [OPTIONAL]
         * @param {integer} left    [OPTIONAL]
         * @param {integer} top     [OPTIONAL]
         *
         * @return {CanvasShapes.SceneLayer}
         */
        newLayer: function (width, height, left, top) {
            throw new CanvasShapes.Error(9019);
        },

        /**
         * Returns width of the scene.
         *
         * @return {integer}
         */
        getWidth: function () {
            throw new CanvasShapes.Error(9020);
        },

        /**
         * Returns height of the scene.
         *
         * @return {integer}
         */
        getHeight: function () {
            throw new CanvasShapes.Error(9021);
        },

        /**
         * Returns HTML container for this scene.
         *
         * @return {object}
         */
        getDom: function () {
            throw new CanvasShapes.Error(9022);
        },

        /**
         * Allows you to specify whether this scene is rendered relatively, i.e.
         * whether it treats coordinates as pixels, or percents. It will return
         * `true` if the value was successfully set, or `false` otherwise.
         *
         * @param {boolean} relativeRendering
         * @return {boolean}
         */
        setRelativeRendering: function (relativeRendering) {
            throw new CanvasShapes.Error(9023);
        },

        /**
         * Returns current value for relative rendering feature.
         *
         * @return {boolean}
         */
        getRelativeRendering: function () {
            throw new CanvasShapes.Error(9024);
        }
    });

    return SceneInterface;
}());
