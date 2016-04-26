/*global CanvasShapes*/

CanvasShapes.Relation = (function () {

    /**
     * Class representing mathematical relation.
     *
     * The `func` definition should be as follows:
     * ```
     * function (x, time) {
     *     // some calculations
     *     return [];
     * }
     * ```
     * `time` is being passed as a fraction of total animation time. Its value
     * will never be lower than 0 and bigger than 1. Function should return
     * the same base relation when `time` is `undefined` or simply `0`.
     *
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
     * [WARNING] if relative rendering is set to `true`, `func` will only be
     * passed `x` values from within a 0-100 range. It is expected that returned
     * values won't exceed it either. If they do though they simply won't be
     * rendered as will be outside the drawing area.
     *
     * [WARNING] `func` must take care of rounding problems if any can arise.
     * See the implementation of a circle here: /examples/basic.html or here:
     * /examples/shapes/relation/mouseoverout.js
     *
     * @param {function} func
     */
    var Relation = function (func, isOpen, isContinuous) {
        this.setUUID();

        if (!CanvasShapes._.isFunction(func)) {
            throw new CanvasShapes.Error(1072);
        }

        this._func = func;
        this._isOpen = !!isOpen;
        this._isContinuous = !!isContinuous;
    };

    CanvasShapes.Class.extend(
        Relation.prototype,
        CanvasShapes.Shape.prototype,
    {
        _className: 'CanvasShapes.Relation',

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer, continuePath, endPointCoordinates) {

            var h, i, points, moveToDone,
                style = this.getStyle(),
                context = layer.getContext();

            points = this._getRenderingPoints(layer);

            if (!continuePath) {
                context.beginPath();
            }

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

                            if (
                                !endPointCoordinates ||
                                !this.areCoordinatesEqual([
                                    points[h][i], endPointCoordinates
                                ])
                            ) {
                                context.moveTo(
                                    points[h][i][0],
                                    points[h][i][1]
                                );
                                // after first moving endPointCoordinates shuold
                                // be reset, as they only apply to the beginning
                                // of the shape
                                endPointCoordinates = null;
                            }

                            moveToDone = true;
                        }
                    } else {
                        moveToDone = false;
                    }
                }
            }

            if (!continuePath) {
                style.set(layer, this.getRelativeRendering());
            }
        },

        /**
         * Relation can contain multiple functions, and here we only return the
         * first one as it's impossible to guess which one user may be after.
         * Also we don't want to introduce extra parameter, as there is simply
         * no valid context for it.
         *
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        getRenderingCoordinates: function (layer) {
            var points = this._getRenderingPoints(layer);
            if (points.length > 0) {
                return points[0];
            }
            return [];
        },

        /**
         * `animationFunction` format should be the same as passed to
         * constructor of CanvasShapes.Relation.
         *
         * @implements {CanvasShapes.AnimationInterface}
         * @override {CanvasShapes.ShapeAbstract}
         *
         * @param {integer}  totalAnimationTime
         * @param {function} animationFunction [OPTIONAL]
         * @param {function} callback [OPTIONAL]
         */
        move: function (totalAnimationTime, animationFunction, callback) {

            var animationFrame;

            if (!animationFunction) {
                animationFunction = this._func;
            }

            if (
                totalAnimationTime <
                CanvasShapes.Config.get('MIN_ANIMATION_TIME')
            ) {
                this.requestRendering(
                    this,
                    undefined,
                    CanvasShapes._.bind(function (layer) {
                        this._getRenderingPoints(layer, animationFunction, 0);
                    }, this)
                );
                return;
            }

            animationFrame = new CanvasShapes.AnimationFrame(
                this,
                totalAnimationTime,
                function (currentTime) {

                    var ratio = currentTime / this.totalAnimationTime;

                    if (CanvasShapes._.isNaN(ratio) || ratio > 1) {
                        ratio = 1;
                    }

                    this.setBeforeRender(CanvasShapes._.bind(function (
                        ratio, animationFunction, layer
                    ) {
                        this.shape._getRenderingPoints(
                            layer,
                            animationFunction,
                            ratio
                        );
                    }, this, ratio, this.variables.animationFunction));
                },
                callback,
                {
                    animationFunction: animationFunction
                }
            );

            // setting beforeRender hook for the first frame of the animation
            animationFrame.setBeforeRender(CanvasShapes._.bind(function (
                ratio, animationFunction, layer
            ) {
                this.shape._getRenderingPoints(
                    layer,
                    animationFunction,
                    ratio
                );
            }, animationFrame, 0, animationFunction));

            this.animate(animationFrame);
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
         * @param {CanvasShapes.SceneLayerInterface} layer
         * @param {function}                         func [OPTIONAL]
         * @param {float}                            time [OPTIONAL]
         *
         * @return {array}
         */
        _getRenderingPoints: function (layer, func, time) {

            var relativeRendering = this.getRelativeRendering(),
                cachedPoints = this.getCache(
                    layer.getUUID() + '_' + relativeRendering
                );

            // check if there is a cached version of points for this layer
            // or if there is a new custom function passed
            if (!cachedPoints || func) {
                cachedPoints = this._generateRenderingPoints(layer, func, time);
                this.setCache(
                    layer.getUUID() + '_' + relativeRendering,
                    cachedPoints,
                    true
                );
            }

            return cachedPoints;
        },

        /**
         * Generates points for the relation to plot.
         *
         * @throws {CanvasShapes.Error} 1071
         *
         * @param {CanvasShapes.SceneLayerInterface} layer
         * @param {function}                         func [OPTIONAL]
         * @param {float}                            time [OPTIONAL]
         *
         * @return {array}
         */
        _generateRenderingPoints: function (layer, func, time) {

            var i, j, count, width, height, heightRatio, funcArg,
                relativeRendering = this.getRelativeRendering(),
                points = [],
                temp = [],
                testData = [-10, 0, 10];

            if (!func) {
                func = this._func;
            }

            width = layer.getWidth();
            height = layer.getHeight();

            if (relativeRendering) {
                heightRatio = 100 / height;
            } else {
                heightRatio = 1;
            }

            for (i = 0; i <= width; i++) {

                if (relativeRendering) {
                    funcArg = i * 100 / width;
                } else {
                    funcArg = i;
                }

                temp[i] = func(funcArg, time);

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
                        points[j][i] = [i, Math.abs(temp[i][j] / heightRatio - height)];
                    } else {
                        points[j][i] = [i, false];
                    }
                }
            }

            return points;
        },

        /**
         * [WARNING] I'm simply returning values passed to us when constructing
         * the object. It doesn't have to be reliable!
         *
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeOpen: function () {
            return this._isOpen;
        },

        /**
         * [WARNING] I'm simply returning values passed to us when constructing
         * the object. It doesn't have to be reliable!
         *
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeContinuous: function () {
            return this._isContinuous;
        }
    });

    return Relation;
}());
