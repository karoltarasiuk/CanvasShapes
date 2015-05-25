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
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {

            this.sceneInterfaceHandlers = sceneInterfaceHandlers;

            this.eachShape(function (sceneInterfaceHandlers) {
                this.setSceneInterfaceHandlers(sceneInterfaceHandlers);
            }, [sceneInterfaceHandlers], true);
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer) {

            this.eachShape(function () {
                this.render(layer);
            }, [], true);
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         *
         * Calculates average coordinate from its children.
         */
        getCoordinates: function () {

            var coordinates,
                i = 0,
                x = 0,
                y = 0,
                z = 0;

            this.eachShape(function () {
                coordinates = this.getCoordinates();
                x += coordinates[0];
                y += coordinates[1];
                if (coordinates.length > 2) {
                    z += coordinates[2];
                }
                i++;
            });

            if (i !== 0) {
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
                this.eachShape(function (style, deep) {
                    this.setStyle(style, deep);
                }, [style, deep]);
            }
        }
    });

    return Group;
}());
