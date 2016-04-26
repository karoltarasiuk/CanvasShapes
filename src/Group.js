/*global CanvasShapes*/

CanvasShapes.Group = (function () {

    /**
     * A generic group class. It doesn't get rendered by itself. It only renders
     * its children.
     */
    var Group = function () {
        this.setUUID();
        this._initialise();
    };

    CanvasShapes.Class.extend(
        Group.prototype,
        CanvasShapes.GroupAbstract.prototype,
        CanvasShapes.Shape.prototype,
    {
        _className: 'CanvasShapes.Group',

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.RenderingAbstract}
         */
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {
            CanvasShapes.Shape.prototype.setSceneInterfaceHandlers.apply(
                this,
                arguments
            );

            this.eachShape(function (sceneInterfaceHandlers) {
                this.setSceneInterfaceHandlers(sceneInterfaceHandlers);
            }, [sceneInterfaceHandlers], true);
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer, continuePath, endPointCoordinates) {

            this.eachShape(function () {
                this.render(layer);
            }, [], true);
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         *
         * Calculates average coordinate from its children.
         */
        getCentreCoordinates: function () {

            var coordinates,
                i = 0,
                x = 0,
                y = 0,
                z = 0;

            this.eachShape(function () {
                coordinates = this.getCentreCoordinates();
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
         * @implements {CanvasShapes.CoordinatesInterface}
         *
         * Returns array of coordinates of the children.
         */
        getCoordinates: function () {

            var coordinates = [];

            this.eachShape(function () {
                coordinates.push(this.getCoordinates());
            });

            return coordinates;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         * @overrides {CanvasShapes.CoordinatesAbstract}
         *
         * Sets the same coordinates for each member.
         *
         * [WARNING] If the format of the coordinates can vary for each member,
         * you should instead use `eachShape` method.
         */
        setCoordinates: function (coordinates) {

            this.eachShape(function () {
                this.setCoordinates(coordinates);
            });
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.RenderingAbstract}
         */
        setStyle: function (style, deep) {

            var i;

            this._style = style;

            if (deep) {
                this.eachShape(function (style, deep) {
                    this.setStyle(style, deep);
                }, [style, deep]);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.RenderingAbstract}
         */
        setRelativeRendering: function (relativeRendering, deep) {

            var ret = false;

            if (CanvasShapes._.isBoolean(relativeRendering)) {
                this._relativeRendering = relativeRendering;
                ret = true;

                if (deep) {
                    this.eachShape(function (relativeRendering, deep) {
                        ret = ret && this.setRelativeRendering(
                            relativeRendering, deep
                        );
                    }, [relativeRendering, deep]);
                }
            }

            return ret;
        }
    });

    return Group;
}());
