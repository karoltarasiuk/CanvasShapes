/*global CanvasShapes*/

CanvasShapes.Relation = (function () {

    /**
     * Class representing mathematical relation.
     *
     * The `func` definition should be as follows:
     * ```
     * function (x) {
     *     // some calculations
     *     return [];
     * }
     * ```
     * It must return an array of float values. Array of those values should
     * always have the same number of values. For a function it should always be
     * one value. If there is no `y` to be plotted for a given `x`, array should
     * contain a `false`.
     *
     * [WARNING] `x` and `y` coordinates behave exactly as it does in cartesian
     * coordinate system. It may be confusing as canvas element `y` coordinate
     * is reversed and grows to the bottom. So assuming [0, 0] point is a bottom
     * left corner of a canvas.
     *
     * [WARNING] `func` parameter must take relative rendering into account.
     *
     * @param {function} func
     */
    var Relation = function (func) {
        this.setUUID();

        if (!CanvasShapes._.isFunction(func)) {
            throw new CanvasShapes.Error(1072);
        }

        this._func = func;
    };

    CanvasShapes.Class.extend(
        Relation.prototype,
        CanvasShapes.Shape.prototype,
    {
        _className: 'CanvasShapes.Relation',

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer) {

            var h, i, points, coordinates, moveToDone,
                style = this.getStyle(),
                context = layer.getContext();

            points = this._getRenderingPoints(layer);

            context.beginPath();

            for (h = 0; h < points.length; h++) {
                // we need to start drawing another function
                moveToDone = false;

                for (i = 0; i < points[h].length; i++) {
                    if (points[h][i][1] !== false) {
                        if (moveToDone) {
                            context.lineTo(
                                points[h][i][0],
                                points[h][i][1]
                            );
                        } else {
                            context.moveTo(
                                points[h][i][0],
                                points[h][i][1]
                            );
                            moveToDone = true;
                        }
                    } else {
                        moveToDone = false;
                    }
                }
            }

            style.set(layer, this.getRelativeRendering());
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         *
         * @throws {CanvasShapes.Error} 1070
         */
        isColliding: function (mouseCoordinates) {

            var h, i, layer, allowedError, points;

            if (
                !CanvasShapes._.isObject(mouseCoordinates) ||
                !CanvasShapes._.isNumber(mouseCoordinates.x) ||
                !CanvasShapes._.isNumber(mouseCoordinates.y) ||
                !CanvasShapes._.isObject(mouseCoordinates.scene) ||
                !CanvasShapes._.isFunction(mouseCoordinates.scene.is) ||
                !mouseCoordinates.scene.is(CanvasShapes.SceneInterface)
            ) {
                throw new CanvasShapes.Error(1070);
            }

            layer = mouseCoordinates.scene.getLayer(this);
            allowedError = this.calculateAllowedError(layer);
            points = this._getRenderingPoints(layer);

            for (h = 0; h < points.length; h++) {
                for (i = 0; i < points[h].length - 1; i++) {
                    // check whether the segment exists
                    if (
                        points[h][i][1] !== false &&
                        points[h][i + 1][1] !== false
                    ) {
                        if (
                            CanvasShapes.GeometryTools.isOnTheSegment(
                                [mouseCoordinates.x, mouseCoordinates.y],
                                [points[h][i], points[h][i + 1]],
                                allowedError
                            )
                        ) {
                            return true;
                        }
                    } else {
                        // or whether it's only one point to match against
                        // passed mouse coordinates
                        if (
                            points[h][i][1] !== false &&
                            (CanvasShapes.Tools.isValueWithinInterval(
                                mouseCoordinates.x,
                                points[h][i][0] - allowedError,
                                points[h][i][0] + allowedError
                            ) &&
                            CanvasShapes.Tools.isValueWithinInterval(
                                mouseCoordinates.y,
                                points[h][i][1] - allowedError,
                                points[h][i][1] + allowedError
                            ))
                        ) {
                            return true;
                        }
                        if (
                            points[h][i + 1][1] !== false &&
                            (CanvasShapes.Tools.isValueWithinInterval(
                                mouseCoordinates.x,
                                points[h][i + 1][0] - allowedError,
                                points[h][i + 1][0] + allowedError
                            ) &&
                            CanvasShapes.Tools.isValueWithinInterval(
                                mouseCoordinates.y,
                                points[h][i + 1][1] - allowedError,
                                points[h][i + 1][1] + allowedError
                            ))
                        ) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        /**
         * It returns generated rendering points. Rendering points must be
         * generated per layer. Therefore it's good to cache them to avoid
         * re-calculating whenever they're needeed.
         *
         * @param  {CanvasShapes.SceneLayerInterface} layer
         * @return {array}
         */
        _getRenderingPoints: function (layer) {

            if (!CanvasShapes._.isObject(this._points)) {
                this._points = {};
            }

            // check if there is a cached version of points for this layer
            if (!this._points[layer.getUUID()]) {
                this._points[layer.getUUID()] =
                    this._generateRenderingPoints(layer);
            }

            return this._points[layer.getUUID()];
        },

        /**
         * Generates points for the relation to plot.
         *
         * @throws {CanvasShapes.Error} 1071
         *
         * @param  {CanvasShapes.SceneLayerInterface} layer
         * @return {array}
         */
        _generateRenderingPoints: function (layer) {

            var i, j, count, width, height,
                points = [],
                temp = [],
                testData = [-10, 0, 10];
// RELATIVE RENDERING!!!
// // RELATIVE RENDERING!!!
// // RELATIVE RENDERING!!!
            width = layer.getWidth();
            height = layer.getHeight();

            for (i = 0; i <= width; i++) {
                temp[i] = this._func(i);
                if (count && temp[i].length !== count) {
                    throw new CanvasShapes.Error(1071);
                } else {
                    count = temp[i].length;
                }
                if (!CanvasShapes._.isArray(temp[i])) {
                    throw new CanvasShapes.Error(1071);
                }
                for (j = 0; j < temp[i].length; j++) {
                    if (
                        !CanvasShapes._.isNumber(temp[i][j]) &&
                        temp[i][j] !== false
                    ) {
                        throw new CanvasShapes.Error(1071);
                    }
                }
            }

            // creating an array for each function within relation
            for (i = 0; i < count; i++) {
                points[i] = [];
            }

            // populating points
            for (i = 0; i < temp.length; i++) {
                for (j = 0; j < temp[i].length; j++) {
                    // notice height deduction to align rendering with
                    // cartesian coordinate system
                    if (temp[i][j] !== false) {
                        points[j][i] = [i, Math.abs(temp[i][j] - height)];
                    } else {
                        points[j][i] = [i, false];
                    }
                }
            }

            return points;
        }
    });

    return Relation;
}());
