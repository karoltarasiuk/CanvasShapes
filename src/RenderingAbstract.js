/*global _, CanvasShapes*/

CanvasShapes.RenderingAbstract = (function () {

    var RenderingAbstract = function () {
        throw new CanvasShapes.Error(8001);
    };

    CanvasShapes.Class.extend(RenderingAbstract.prototype, CanvasShapes.RenderingInterface.prototype, {

        className: 'CanvasShapes.RenderingAbstract',

        /**
         * Handler allowing a shape to obtain new layer when needed.
         * @type {function}
         */
        newLayerHandler: null,

        /**
         * Layer to render the shape on.
         * @type {CanvasShapes.SceneLayer}
         */
        layer: null,

        /**
         * Style object.
         * @type {CanvasObject.StyleInterface}
         */
        style: null,

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        setNewLayerHandler: function (newLayerHandler) {
            this.newLayerHandler = newLayerHandler;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        setLayer: function (layer) {
            this.layer = layer;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        getLayer: function () {

            if (!this.layer) {
                throw new CanvasShapes.Error(1018);
            }

            return this.layer;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        hasScene: function () {

            try {
                this.getScene();
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        getScene: function () {
            return this.getLayer().getScene();
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        setStyle: function (style, deep) {
            this.style = style;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        getStyle: function () {
            if (!this.style) {
                this.style = new CanvasShapes.Style({});
            }
            return this.style;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        numberOfSeparateLayersNeeded: function () {
            return 0;
        }
    });

    return RenderingAbstract;
}());
