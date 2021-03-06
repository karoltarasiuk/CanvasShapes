/*global CanvasShapes*/

CanvasShapes.BezierCurve = (function () {

    var MIN_COORDINATES = 3,
        // in theory this should allow you to draw any N-grade Bezier Curves
        MAX_COORDINATES = undefined;

    /**
     * Class representing a Bezier Curve of n-th degree. Degree depeneds on the
     * number of coordinates passed as an argument. Array of 3 coordinates means
     * that a curve of 1st degree will be created (quadratic). Array of 5
     * coordinates will create a bezier curve of 3rd degree.
     *
     * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
     *
     * @param {[array]} coordinates
     */
    var BezierCurve = function (coordinates) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;

        // checking if passed coordinates are in a correct format
        this.validateCoordinatesArray(
            coordinates,
            true,
            this.MIN_COORDINATES,
            this.MAX_COORDINATES
        );

        this.setCoordinates(coordinates);
    };

    CanvasShapes.Class.extend(
        BezierCurve.prototype,
        CanvasShapes.Shape.prototype,
    {
        _className: 'CanvasShapes.BezierCurve',

        /**
         * Gets the grade of this instance of a Bezier curve.
         *
         * @return {integer}
         */
        getGrade: function () {
            if (!this._grade) {
                this._grade = this.getCoordinates().length - 2;
            }
            return this._grade;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer, continuePath, endPointCoordinates) {

            var i, points, coordinates,
                style = this.getStyle(),
                context = layer.getContext();

            points = this._getRenderingPoints(layer);

            if (!continuePath) {
                context.beginPath();
            }

            if (
                !endPointCoordinates ||
                !this.areCoordinatesEqual([
                    points[0], endPointCoordinates
                ])
            ) {
                context.moveTo(
                    points[0][0],
                    points[0][1]
                );
            }

            for (i = 0; i < points.length; i++) {
                context.lineTo(
                    points[i][0],
                    points[i][1]
                );
            }

            if (!continuePath) {
                style.set(layer, this.getRelativeRendering());
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        getRenderingCoordinates: function (layer) {
            return this._getRenderingPoints(layer);
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         *
         * @throws {CanvasShapes.Error} 1070
         */
        isColliding: function (mouseCoordinates, simulateClosedShape) {

            var i, layer, allowedError, points;

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

            // checking whether bezier curve is a closed shape
            if (this.isShapeClosed() || simulateClosedShape) {

                return CanvasShapes.GeometryTools.isInsidePolygon(
                    [mouseCoordinates.x, mouseCoordinates.y],
                    points, allowedError
                );

            } else {
                for (i = 0; i < points.length - 1; i++) {
                    if (
                        CanvasShapes.GeometryTools.isOnTheSegment(
                            [mouseCoordinates.x, mouseCoordinates.y],
                            [points[i], points[i + 1]],
                            allowedError
                        )
                    ) {
                        return true;
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

            var coordinates = this.getCoordinates(),
                relativeRendering = this.getRelativeRendering(),
                cacheID = layer.getUUID() + '_' + JSON.stringify(coordinates) +
                    '_' + relativeRendering,
                cachedPoints = this.getCache(cacheID);

            // check if there is a cached version of points for this layer
            if (!cachedPoints) {
                coordinates = this.processCoordinates(coordinates, layer);
                cachedPoints = this._generateRenderingPoints(coordinates);
                this.setCache(cacheID, cachedPoints);
            }

            return cachedPoints;
        },

        /**
         * Generates rendering points coordinates for a given curve control
         * points coordinates.
         *
         * @see http://html5tutorial.com/how-to-draw-n-grade-bezier-curve-with-canvas-api/
         *
         * @param  {array} coordinates
         * @return {array}
         */
        _generateRenderingPoints: function (coordinates) {

            var i, t, step,
                temp = [],
                tLength = 0;

            // compute the incremental step
            for (i = 0; i < coordinates.length - 1; i++){
                tLength += CanvasShapes.GeometryTools.segmentLength(
                    coordinates[i],
                    coordinates[i + 1]
                );
            }
            step = 1 / tLength;

            // compute the support coordinates
            for (t = 0; t <= 1; t = t + step) {
                temp.push(this._pointsCoordinates(t, coordinates));
            }

            return temp;
        },

        /**
         * Computes a point's coordinates for a value of t. `points` is an array
         * of initial point coordinates. `t` is a value between 0 and 1.
         *
         * @see http://html5tutorial.com/how-to-draw-n-grade-bezier-curve-with-canvas-api/
         *
         * @param  {float} t
         * @param  {array} points
         *
         * @return {array}
         */
        _pointsCoordinates: function (t, points) {

            var i, bernstein,
                r = [0, 0],
                n = points.length - 1;

            for (i = 0; i <= n; i++) {
                bernstein = CanvasShapes.GeometryTools.bernstein(i, n, t);
                r[0] += points[i][0] * bernstein;
                r[1] += points[i][1] * bernstein;
            }

            return r;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        isShapeOpen: function () {

            var coordinates = this.getCoordinates();

            return !this.areCoordinatesEqual([
                coordinates[0],
                coordinates[coordinates.length - 1]
            ]);
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeContinuous: function () {
            return true;
        }
    });

    return BezierCurve;
}());
