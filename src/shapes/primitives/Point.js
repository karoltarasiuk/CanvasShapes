/*global CanvasShapes*/

CanvasShapes.Point = (function () {

    var MIN_COORDINATES = 1,
        MAX_COORDINATES = 1;

    /**
     * Instantiates new Point object placed in specified position with given
     * face. If face is not provided (`undefined`), default will be rendered.
     * If face is passed as `null`, point will have no face.
     *
     * `face` determines the way the point will be rendered, can be any shape.
     *
     * @param {array}  coordinates
     * @param {string} face
     * @param {float}  size
     */
    var Point = function (coordinates, face, size) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this._initialise(coordinates, face, size);
    };

    /**
     * Supported faces.
     *
     * @type {object}
     */
    Point.FACES = {
        NONE: 'none',
        CIRCLE: 'circle'
    };

    /**
     * Point defaults.
     *
     * @type {object}
     */
    Point.DEFAULTS = {
        FACE: Point.FACES.NONE,
        SIZE: 3
    };

    CanvasShapes.Class.extend(Point.prototype, CanvasShapes.Shape.prototype, {

        _className: 'CanvasShapes.Point',

        /**
         * Point initialisation method. It validates arguments as well.
         *
         * @param {array}  coordinates
         * @param {object} face
         * @param {object} size
         */
        _initialise: function (coordinates, face, size) {

            this.validateCoordinates(coordinates, true);
            this.setCoordinates(coordinates);

            if (face === undefined) {
                face = Point.DEFAULTS.FACE;
            }

            if (!face) {
                return;
            }

            this.setFace(face, size);
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides  {CanvasShapes.RenderingAbstract}
         */
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {
            CanvasShapes.Shape.prototype.setSceneInterfaceHandlers.apply(
                this,
                arguments
            );

            if (this._face) {
                this._face.setSceneInterfaceHandlers(sceneInterfaceHandlers);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer) {
            if (this._face) {
                this._face.render(layer);
            }
        },

        /**
         * Overwrites current face of the point. If you just want to clear
         * current face, pass `Point.FACES.NONE` as a `face` parameter.
         * Otherwise pass other valid face string, all ready to use object. For
         * now `size` parameter is only accepted when `circle` is passed as
         * face.
         *
         * @throws {CanvasShapes.Error} 1008
         * @throws {CanvasShapes.Error} 1026
         *
         * @param {[CanvasShapes.RenderingInterface,string]} face
         * @param {float} size [OPTIONAL]
         */
        setFace: function (face, size) {

            if (size === undefined) {
                size = Point.DEFAULTS.SIZE;
            }

            if (CanvasShapes._.isString(face)) {
                if (CanvasShapes._.contains(Point.FACES, face)) {
                    switch (face) {
                        case Point.FACES.CIRCLE:
                            this._face = new CanvasShapes.Circle(this, size);
                            this._face.setStyle(
                                new CanvasShapes.Style(function (context) {
                                    context.fill();
                                })
                            );
                            break;
                    }
                } else {
                    throw new CanvasShapes.Error(1008);
                }
            } else if (
                CanvasShapes._.isObject(face) &&
                CanvasShapes._.isFunction(face.is) &&
                face.is(CanvasShapes.RenderingInterface)
            ) {
                this._face = face;
            } else {
                throw new CanvasShapes.Error(1026);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.RenderingAbstract}
         */
        getStyle: function () {
            if (this._face) {
                return this._face.getStyle();
            }
            return null;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.RenderingAbstract}
         */
        setStyle: function (style, deep) {
            if (this._face) {
                this._face.setStyle(style, deep);
            }
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         * @overrides {CanvasShapes.CoordinatesAbstract}
         */
        setCoordinates: function (coordinates) {
            this._coordinates = coordinates;
            if (this._face) {
                this._face.setCoordinates([coordinates]);
            }
        }
    });

    return Point;
}());
