/*global CanvasShapes*/

CanvasShapes.SceneLayerAbstract = (function () {

    /**
     * Abstract class for layer objects.
     *
     * @throws {CanvasShapes.Error} 8017
     */
    var SceneLayerAbstract = function () {
        throw new CanvasShapes.Error(8017);
    };

    CanvasShapes.Class.extend(
        SceneLayerAbstract.prototype,
        CanvasShapes.SceneLayerInterface.prototype,
    {
        _className: 'CanvasShapes.SceneLayerAbstract',

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         *
         * @throws {CanvasShapes.Error} 1017
         */
        getScene: function () {

            if (!this.scene) {
                throw new CanvasShapes.Error(1017);
            }

            return this.scene;
        },

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         *
         * @throws {CanvasShapes.Error} 1054
         */
        getCanvas: function () {

            if (!this.canvas) {
                throw new CanvasShapes.Erorr(1054);
            }

            return this.canvas;
        },

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         *
         * @throws {CanvasShapes.Error} 1016
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
        getTop: function () {
            if (this.top === undefined || this.top === null) {
                return 0;
            }
            return this.top;
        },

        /**
         * @implements {CanvasShapes.SceneLayerInterface}
         */
        getLeft: function () {
            if (this.left === undefined || this.left === null) {
                return 0;
            }
            return this.left;
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
