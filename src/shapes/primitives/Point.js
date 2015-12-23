/*global _, CanvasShapes*/

CanvasShapes.Point = (function () {

    var MIN_COORDINATES = 1,
        MAX_COORDINATES = 1;

    /**
     * Instantiates new Point object placed in specified position with given
     * face. If face is not provided (`undefined`), default will be rendered.
     * If face is passed as `null`, point will have no face.
     *
     * @param {array} coordinates
     * @param {string} face
     * @param {float} size
     */
    var Point = function (coordinates, face, size) {
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this.initialise(coordinates, face, size);
    };

    Point.FACES = {
        NONE: 'none',
        CIRCLE: 'circle'
    };

    Point.DEFAULTS = {
        FACE: Point.FACES.NONE,
        SIZE: 3
    };

    CanvasShapes.Class.extend(Point.prototype, CanvasShapes.Shape.prototype, {

        className: 'CanvasShapes.Point',

        /**
         * Coordinates of a point
         * @type {array}
         */
        coordinates: null,

        /**
         * The way the point will be rendered, can be any shape
         * @type {CanvasShapes.RenderingInterface}
         */
        face: null,

        initialise: function (coordinates, face, size) {

            this.initialiseShapeConstants();

            this.validateCoordinates(coordinates, true);
            this.coordinates = coordinates;

            if (_.isUndefined(face)) {
                face = Point.DEFAULTS.FACE;
            }

            if (face) {
                this.setFace(face, size);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.RenderingAbstract}
         */
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {
            CanvasShapes.Shape.prototype.setSceneInterfaceHandlers.apply(
                this,
                arguments
            );

            if (this.face) {
                this.getFace().setSceneInterfaceHandlers(sceneInterfaceHandlers);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer) {

            var face;

            if (this.face) {
                this.getFace().render(layer);
            }
        },

        /**
         * Overwrites current face of the point. If you just want to clear
         * current face, pass `Point.FACES.NONE` as a `face` parameter.
         * Otherwise pass other valid face string, all ready to use object. For
         * now `size` parameter is only accepted when `circle` is passed as
         * face.
         *
         * @param {[CanvasShapes.RenderingInterface,string]} face
         * @param {float} size [OPTIONAL]
         */
        setFace: function (face, size) {

            if (size === undefined) {
                size = Point.DEFAULTS.SIZE;
            }

            if (_.isString(face)) {
                if (_.contains(Point.FACES, face)) {
                    switch (face) {
                        case Point.FACES.CIRCLE:
                            face = new CanvasShapes.Circle(this.getUUID(), size);
                            face.setStyle(new CanvasShapes.Style(function (context) {
                                context.fill();
                            }));
                            this.face = face.getUUID();
                            break;
                    }
                } else {
                    // string with UUID was passed
                    this.face = face;
                }
            } else if (
                _.isObject(face) && _.isFunction(face.is) &&
                face.is(CanvasShapes.RenderingInterface)
            ) {
                this.face = face.getUUID();
            } else {
                throw new CanvasShapes.Error(1026);
            }
        },

        /**
         * Getter for `face` of the point
         *
         * @return {[null,CanvasShapes.RenderingInterface]}
         */
        getFace: function () {
            return CanvasShapes.Class.getObject(this.face);
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.RenderingAbstract}
         */
        getStyle: function () {
            if (this.face) {
                return this.getFace().getStyle();
            }
            return null;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @overrides {CanvasShapes.RenderingAbstract}
         */
        setStyle: function (style, deep) {

            var face = this.getFace();

            if (face) {
                face.setStyle(style, deep);
            }
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        setCoordinates: function (coordinates) {
            this.coordinates = coordinates;
            if (this.face) {
                this.getFace().setCoordinates([coordinates]);
            }
        },

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        toJSON: function (toString) {

            var obj = {
                    metadata: {
                        className: this.className,
                        UUID: this.getUUID()
                    },
                    data: {
                        coordinates: this.getCoordinates()
                    }
                };

            if (this.face) {
                obj.data.face = this.face;
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

            var point, face;

            if (_.isString(obj)) {
                obj = JSON.parse(obj);
            }

            if (
                !_.isObject(obj.metadata) || !_.isObject(obj.data) ||
                !_.isString(obj.metadata.className) ||
                !_.isString(obj.metadata.UUID) ||
                (obj.data.coordinates && !_.isArray(obj.data.coordinates))
            ) {
                throw new CanvasShapes.Error(1063);
            }

            point = new CanvasShapes.Point(obj.data.coordinates, face);
            CanvasShapes.Class.swapUUID(point.getUUID(), obj.metadata.UUID);

            if (obj.data.face) {
                point.setFace(obj.data.face);
            }

            return point;
        }
    });

    return Point;
}());
