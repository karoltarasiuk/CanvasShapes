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

            if (!_.isArray(coordinates) || coordinates.length < 2) {
                throw new CanvasShapes.Error(1003);
            }

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
        setNewLayerHandler: function (newLayerHandler) {
            this.newLayerHandler = newLayerHandler;
            if (this.face) {
                this.face.setNewLayerHandler(newLayerHandler);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        setLayer: function (layer) {
            this.layer = layer;
            if (this.face) {
                this.face.setLayer(layer);
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function () {
            if (this.face) {
                this.face.render();
            }
        },

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
            } else {
                this.face = face;
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        getStyle: function () {
            if (this.face) {
                this.face.getStyle();
            }
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
