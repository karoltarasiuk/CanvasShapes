/*global CanvasShapes*/

CanvasShapes.GroupShape = (function () {

    /**
     * A group shape. The difference from a generic Group class is, that it's
     * not really a group - it's treated as a one shape, from rendering, through
     * styling and events handling. All sub-shapes are behaving as one.
     *
     * Filling this shape make sense only when your path is closed, which means
     * that beginning of the first sub-shape should be an end of the last
     * sub-shape. All those shapes
     */
    var GroupShape = function () {
        this.setUUID();
        this._initialise();
    };

    CanvasShapes.Class.extend(
        GroupShape.prototype,
        CanvasShapes.Group.prototype,
    {
        _className: 'CanvasShapes.GroupShape',

        /**
         * The rendering is different as per concept of GroupShape. We need to
         * begin the path here, draw the path for each sub-shape, and then close
         * it here again. After that the style should be applied.
         *
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.Group}
         */
        render: function (layer, continuePath, endPointCoordinates) {

            var coordinates,
                style = this.getStyle(),
                context = layer.getContext();

            if (!continuePath) {
                context.beginPath();
            }

            this.eachShape(function () {

                this.render(layer, true, endPointCoordinates);

                coordinates = this.processCoordinates(
                    this.getCoordinates(), layer
                );

                if (this.areCoordinatesMultiple(coordinates)) {
                    endPointCoordinates = coordinates[coordinates.length - 1];
                } else {
                    endPointCoordinates = coordinates;
                }
            });

            if (!continuePath) {
                style.set(layer, this.getRelativeRendering());
            }
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeOpen: function () {

            var i, coordinates, startCoordinate, endCoordinate,
                isShapeContinuous;

            isShapeContinuous = this.isShapeContinuous();

            // if shape is not continuous, it's automatically open
            if (isShapeContinuous === undefined) {
                return undefined;
            } else if (isShapeContinuous === false) {
                return true;
            }

            // if shape is continuous I need to check equality of starting and
            // ending coodinate from first and last subshapes
            coordinates = this.eachShape(function () {
                return this.getCoordinates();
            }, undefined, true);

            // no sub shapes means the shape is open
            if (coordinates.length === 1) {
                // get first shape
            }

            if (this.areCoordinatesMultiple(coordinates[0])) {
                startCoordinate = coordinates[0][0];
            } else {
                startCoordinate = coordinates[0];
            }

            if (
                this.areCoordinatesMultiple(coordinates[coordinates.length - 1])
            ) {
                endCoordinate = coordinates[coordinates.length - 1]
                    [coordinates[coordinates.length - 1].length - 1];
            } else {
                endCoordinate = coordinates[coordinates.length - 1];
            }

            return !this.areCoordinatesEqual([
                startCoordinate, endCoordinate
            ]);
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeContinuous: function () {

            var i, coordinates, previousCoordinate, firstCoordinate,
                startCoordinate, endCoordinate,
                gapsNumber = 0;

            if (this.getShapesNumber() === 0) {
                return undefined;
            }

            // going through all the shapes which belong to the group
            coordinates = this.eachShape(function () {

                if (this.isShapeContinuous()) {
                    return this.getCoordinates();
                }

                return false;

            }, undefined, true);

            for (i = 0; i < coordinates.length; i++) {
                // sub shape is not continuous
                if (coordinates[i] === false) {
                    return false;
                }

                if (this.areCoordinatesMultiple(coordinates[i])) {
                    startCoordinate = coordinates[i][0];
                    endCoordinate = coordinates[i][coordinates[i].length - 1];
                } else {
                    startCoordinate = coordinates[i];
                    endCoordinate = coordinates[i];
                }

                if (previousCoordinate) {
                    if (!this.areCoordinatesEqual([
                        startCoordinate, previousCoordinate
                    ])) {
                        gapsNumber++;
                    }
                } else {
                    firstCoordinate = startCoordinate;
                }

                previousCoordinate = endCoordinate;
            }

            return gapsNumber === 0 ||
                // one gap alloed when first and last coordinates are equal
                (gapsNumber < 2 && this.areCoordinatesEqual([
                    firstCoordinate, previousCoordinate
                ]));
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        isColliding: function (mouseCoordinates, simulateClosedShape) {

            var i, ret, layer, allowedError,
                polygon = [],
                shapeIsClosed = this.isShapeClosed();

            if (
                !CanvasShapes._.isObject(mouseCoordinates) ||
                !CanvasShapes._.isNumber(mouseCoordinates.x) ||
                !CanvasShapes._.isNumber(mouseCoordinates.y) ||
                !CanvasShapes._.isObject(mouseCoordinates.scene) ||
                !CanvasShapes._.isFunction(mouseCoordinates.scene.is) ||
                !mouseCoordinates.scene.is(CanvasShapes.SceneInterface)
            ) {
                throw new CanvasShapes.Error(1058);
            }

            ret = this.eachShape(function () {
                return this.isColliding(mouseCoordinates);
            });

            for (i = 0; i < ret.length; i++) {
                // if any sub shape is colliding, then group shape is also
                if (ret[i] === true) {
                    return true;
                }
            }

            // if sub shapes are not colliding separately, then we need to go
            // into some smarter solution

            layer = mouseCoordinates.scene.getLayer(this);

            if (!shapeIsClosed) {
                return false;
            }

            ret = this.eachShape(function () {
                return this.getRenderingCoordinates(layer);
            });

            // merging coordinates into polygon
            for (i = 0; i < ret.length; i++) {
                polygon = polygon.concat(ret[i]);
            }
            allowedError = this.calculateAllowedError(layer);

            return CanvasShapes.GeometryTools.isInsidePolygon(
                [mouseCoordinates.x, mouseCoordinates.y],
                polygon, allowedError
            );
        }
    });

    return GroupShape;
}());
