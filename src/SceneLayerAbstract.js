/*global _, CanvasShapes*/

CanvasShapes.SceneLayerAbstract = (function () {

    var SceneLayerAbstract = function () {
        throw new CanvasShapes.Error(8017);
    };

    CanvasShapes.Class.extend(
        SceneLayerAbstract.prototype,
        CanvasShapes.SceneLayerInterface.prototype,
    {
        className: 'CanvasShapes.SceneLayerAbstract',

        /**
         * Scene the layer is on. Must be set on initialisation.
         *
         * @type {CanvasShapes.SceneInterface}
         */
        scene: null,

        /**
         * 2D context of the layer. Must be set on initialisation.
         *
         * @type {CanvasRenderingContext2D}
         */
        context: null,

        /**
         * Width of the layer. Must be set on initialisation.
         *
         * @type {integer}
         */
        width: null,

        /**
         * Height of the layer. Must be set on initialisation.
         *
         * @type {integer}
         */
        height: null,

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         */
        getScene: function () {

            if (!this.scene) {
                throw new CanvasShapes.Error(1017);
            }

            return this.scene;
        },

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         */
        getContext: function () {

            if (!this.context) {
                throw new CanvasShapes.Error(1016);
            }

            return this.context;
        },

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         */
        getWidth: function () {
            return this.width;
        },

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         */
        getHeight: function () {
            return this.height;
        },

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         */
        clear: function () {
            this.getContext().clearRect(
                0,
                0,
                this.getWidth(),
                this.getHeight()
            );
        }
    });

    return SceneLayerAbstract;
}());
