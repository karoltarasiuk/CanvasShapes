/*global _, CanvasShapes*/

CanvasShapes.Point = (function () {

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
        this.initialize(coordinates, face, size);
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

        initialize: function (coordinates, face, size) {

            this.validateCoordinates(coordinates, true);
            this.coordinates = coordinates;

            if (_.isUndefined(face)) {
                face = Point.DEFAULTS.FACE;
            }

            if (!face) {
                return;
            }

            this.setFace(face, size);
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {
            this.sceneInterfaceHandlers = sceneInterfaceHandlers;
            if (this.face) {
                this.face.setSceneInterfaceHandlers(sceneInterfaceHandlers);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer) {
            if (this.face) {
                this.face.render(layer);
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

            if (_.isUndefined(size)) {
                size = Point.DEFAULTS.SIZE;
            }

            if (_.isString(face)) {
                if (_.contains(Point.FACES, face)) {
                    switch (face) {
                        case Point.FACES.CIRCLE:
                            this.face = new CanvasShapes.Circle(this, size);
                            this.face.setStyle(new CanvasShapes.Style({
                                fill: true
                            }));
                            break;
                    }
                } else {
                    throw new CanvasShapes.Error(1008);
                }
            } else if (
                _.isObject(face) && _.isFunction(face.is) &&
                face.is(CanvasShapes.RenderingInterface)
            ) {
                this.face = face;
            } else {
                throw new CanvasShapes.Error(1026);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        getStyle: function () {
            if (this.face) {
                return this.face.getStyle();
            }
            return null;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        setStyle: function (style, deep) {
            if (this.face) {
                this.face.setStyle(style, deep);
            }
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        getCoordinates: function () {
            return this.coordinates;
        }
    });

    return Point;
}());
