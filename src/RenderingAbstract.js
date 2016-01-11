/*global CanvasShapes*/

CanvasShapes.RenderingAbstract = (function () {

    var RenderingAbstract = function () {
        throw new CanvasShapes.Error(8001);
    };

    CanvasShapes.Class.extend(
        RenderingAbstract.prototype,
        CanvasShapes.RenderingInterface.prototype,
    {
        className: 'CanvasShapes.RenderingAbstract',

        /**
         * Handlers allowing a shape to any info it needs from a scene. It's an
         * array to store handlers for each scene shape is on.
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
         * Allows you to specify whether this rendering object coordinates
         * must be rendered relatively or not.
         *
         * @type {boolean}
         */
        relativeRendering: false,

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {

            var sceneInterfaceHandler;

            if (!CanvasShapes._.isArray(this.sceneInterfaceHandlers)) {
                this.sceneInterfaceHandlers = [];
            }

            CanvasShapes._.each(sceneInterfaceHandlers, function (
                sceneInterfaceHandler,
                handlerName
            ) {
                if (
                    !CanvasShapes._
                        .isFunction(this.sceneInterfaceHandlers[handlerName])
                ) {
                    this.sceneInterfaceHandlers[handlerName] =
                        CanvasShapes._.bind(
                            function () {
                                var i,
                                    length = this.sceneInterfaceHandlers.length;

                                for (i = 0; i < length; i++) {
                                    this.sceneInterfaceHandlers[i][handlerName]
                                        .apply(this, arguments);
                                }
                            },
                            this
                        );
                }
            }, this);

            this.sceneInterfaceHandlers.push(sceneInterfaceHandlers);
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
                this.style = new CanvasShapes.Style();
            }
            return this.style;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        setRelativeRendering: function (relativeRendering) {

            if (CanvasShapes._.isBoolean(relativeRendering)) {
                this.relativeRendering = relativeRendering;
                return true;
            }

            return false;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        getRelativeRendering: function () {
            return this.relativeRendering;
        }
    });

    return RenderingAbstract;
}());
