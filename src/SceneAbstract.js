/*global _, CanvasShapes, JSONChecker*/

CanvasShapes.SceneAbstract = (function () {

    var SceneAbstract = function () {
        throw new CanvasShapes.Error(8007);
    };

    CanvasShapes.Class.extend(SceneAbstract.prototype, CanvasShapes.SceneInterface.prototype, {

        className: 'CanvasShapes.SceneAbstract',

        /**
         * DOM element containing whole scene. Must be set on initialisation.
         *
         * @type {object}
         */
        dom: null,

        /**
         * Allows you to specify whether passed for rendering shapes coordinates
         * must be rendered relatively or not. Must be set on initialisation.
         *
         * @type {boolean}
         */
        relativeRendering: null,

        /**
         * Width of the scene. Must be set on initialisation.
         *
         * @type {integer}
         */
        width: null,

        /**
         * Height of the scene. Must be set on initialisation.
         *
         * @type {integer}
         */
        height: null,

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        newLayer: function (width, height, left, top) {
            return new CanvasShapes.SceneLayer(this, width, height, left, top);
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getWidth: function () {
            return this.width;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getHeight: function () {
            return this.height;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getDom: function () {
            return this.dom;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        setRelativeRendering: function (relativeRendering) {

            if (_.isBoolean(relativeRendering)) {
                this.relativeRendering = relativeRendering;
                return true;
            }

            return false;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getRelativeRendering: function () {
            if (this.relativeRendering === null) {
                return CanvasShapes.Config.get('relativeRendering');
            }
            return this.relativeRendering;
        }
    });

    return SceneAbstract;
}());
