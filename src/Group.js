/*global _, CanvasShapes*/

CanvasShapes.Group = (function () {

    /**
     * A generic group class. It doesn't get rendered by itself. It only renders
     * its children.
     */
    var Group = function () {
        this.setUUID();
        this.initialise();
    };

    CanvasShapes.Class.extend(
        Group.prototype,
        CanvasShapes.Shape.prototype,
        CanvasShapes.GroupAbstract.prototype,
    {
        className: 'CanvasShapes.Group',

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
         *
         * @return {array}
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

            if (deep !== undefined && !_.isBoolean(deep)) {
                throw new CanvasShapes.Error(1068);
            }

            if (!_.isString(style)) {
                if (
                    !_.isObject(style) || !_.isFunction(style.is) ||
                    !style.is(CanvasShapes.StyleInterface)
                ) {
                    throw new CanvasShapes.Error(1068);
                }

                style = style.getUUID();
            }

            this.style = style;

            if (deep) {
                this.eachShape(function (style, deep) {
                    this.setStyle(style, deep);
                }, [style, deep]);
            }
        },

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        toJSON: function (toString) {

            var coordinates,
                obj = {
                    metadata: {
                        className: this.className,
                        UUID: this.getUUID()
                    },
                    data: {
                        shapes: []
                    }
                };

            for (i = 0; i < this.shapes.length; i++) {
                if (filter.apply(this.shapes[i], args)) {
                    ret.push(this.shapes[i]);
                }
            }

            if (toString === true) {
                obj = JSON.stringify(obj);
            }

            return obj;
        },

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        fromJSON: function (obj) {

            var i, shape, classNameParts, tempObj, classObject;

            if (_.isString(obj)) {
                obj = JSON.parse(obj);
            }

            if (
                !_.isObject(obj.metadata) || !_.isObject(obj.data) ||
                !_.isString(obj.metadata.className) ||
                !_.isString(obj.metadata.UUID) ||
                (obj.data.coordinates && !_.isArray(obj.data.coordinates))
            ) {
                throw new CanvasShapes.Error(1060);
            }

            if (obj.metadata.className === 'CanvasShapes.Shape') {

                shape = new CanvasShapes.Shape(obj.data.coordinates);
                CanvasShapes.Class.swapUUID(shape.getUUID(), obj.metadata.UUID);

                return shape;
            }

            classObject = CanvasShapes.Class.getClass(obj.metadata.className);

            if (!classObject) {
                throw new CanvasShapes.Error(1070);
            }

            if (
                CanvasShapes.Shape.prototype.fromJSON ===
                classObject.prototype.fromJSON
            ) {
                // I don't want to modify original object
                tempObj = _.cloneDeep(obj);
                tempObj.metadata.className = 'CanvasShapes.Shape';
            } else {
                tempObj = obj;
            }

            return classObject.prototype.fromJSON.call(null, tempObj);
        }
    });

    return Group;
}());
