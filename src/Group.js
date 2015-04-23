/*global _, CanvasShapes*/

CanvasShapes.Group = (function () {

    /**
     * A generic group class. It doesn't get rendered by itself. It only renders
     * its children.
     */
    var Group = function () {
        this.initialize();
    };

    CanvasShapes.Class.extend(
        Group.prototype,
        CanvasShapes.GroupAbstract.prototype,
        CanvasShapes.Shape.prototype,
    {
        className: 'CanvasShapes.Group',

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        setNewLayerHandler: function (newLayerHandler) {

            var i;

            this.newLayerHandler = newLayerHandler;

            for (i = 0; i < this.shapes.length; i++) {
                this.shapes[i].setNewLayerHandler(newLayerHandler);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        setLayer: function (layer) {

            var i;

            this.layer = layer;

            for (i = 0; i < this.shapes.length; i++) {
                this.shapes[i].setLayer(layer);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function () {

            var i;

            for (i = 0; i < this.shapes.length; i++) {
                this.shapes[i].render();
            }
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         *
         * Calculates average coordinate from its children.
         */
        getCoordinates: function () {

            var i, coordinates,
                x = 0,
                y = 0,
                z = 0;

            if (this.shapes.length > 0) {
                for (i = 0; i < this.shapes.length; i++) {
                    coordinates = this.shapes.getCoordinates();
                    x += coordinates[0];
                    y += coordinates[1];
                    if (coordinates.length > 2) {
                        z += coordinates[2];
                    }
                }

                x /= i;
                y /= i;
                z /= i;
            }

            return [x, y, z];
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        setStyle: function (style, deep) {

            var i;

            this.style = style;

            if (deep) {
                for (i = 0; i < this.shapes.length; i++) {
                    this.shapes[i].setStyle(style, deep);
                }
            }
        }
    });

    return Group;
}());
