/*global _, CanvasShapes*/

CanvasShapes.RenderingAbstract = (function () {

    var RenderingAbstract = function () {
        throw new CanvasShapes.Error(8001);
    };

    CanvasShapes.Class.extend(RenderingAbstract.prototype, CanvasShapes.RenderingInterface.prototype, {

        className: 'CanvasShapes.RenderingAbstract',

        /**
         * Handlers allowing a shape to any info it needs from a scene.
         * @type {object}
         */
        sceneInterfaceHandlers: null,

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
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {
            this.sceneInterfaceHandlers = sceneInterfaceHandlers;
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
