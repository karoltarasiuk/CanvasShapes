/*global _, CanvasShapes*/

CanvasShapes.CoordinatesInterface = (function () {

    /**
     * Defines an interface for shapes which has coordinates, i.e.
     * can be positioned on a board.
     */
    var CoordinatesInterface = function () {
        throw new CanvasShapes.Error(8012);
    };

    CanvasShapes.Class.extend(CoordinatesInterface.prototype, {

        className: 'CanvasShapes.CoordinatesInterface',

        /**
         * Normalizes coordinates and returns shallow copy of any coordinates
         * array. If object is passed, the method will try to fetch its
         * coordinates and create a shallow copy too. Method will detect whether
         * passed coordinates are multiple or single.
         *
         * Notice that sometimes normalizing is not
         * what you need, as keeping reference to the parent object can be
         * better when coordinates can change.
         *
         * If `layer` is passed, and its scene has relative rendering turned on,
         * method will accept coordinates values as percentage of real
         * dimensions of the layer/scene, and will convert them to pixel values.
         *
         * Array format is: [x, y, z], `z` is OPTIONAL.
         *
         * @param {[array,CanvasShapes.CoordinatesInterface]} coordinates
         * @param {CanvasShapes.SceneLayerInterface} layer [OPTIONAL]
         *
         * @return {array}
         */
        processCoordinates: function (coordinates, layer) {
            throw new CanvasShapes.Error(9008);
        },

        /**
         * Returns coordinates of the centre of theshape.
         *
         * @return {[array,CanvasShapes.CoordinatesInterface]}
         */
        getCentreCoordinates: function () {
            throw new CanvasShapes.Error(9007);
        },

        /**
         * Returns coordinates of the shape.
         *
         * @return {[array,CanvasShapes.CoordinatesInterface]}
         */
        getCoordinates: function () {
            throw new CanvasShapes.Error(9007);
        },

        /**
         * Allows to set and overwrite existing coordinates. In case of the
         * group it will set the same coordinates for each member.
         *
         * [WARNING] It doesn't do any type or format checking due to
         * performance reasons.
         *
         * @param {array} coordinates
         */
        setCoordinates: function (coordinates) {
            throw new CanvasShapes.Error(9049);
        },

        /**
         * Validates whether coordinates object/array is valid. If
         * `throwException` is `true`, it will throw exception when passed
         * coordinates are not valid, instead of returning `false`.
         *
         * Example `coordinates` parameter value: [0, 0].
         *
         * @param {[array,CanvasShapes.CoordinatesInterface]} coordinates
         * @param {boolean} throwException
         *
         * @return {boolean}
         */
        validateCoordinates: function (coordinates, throwException) {
            throw new CanvasShapes.Error(9013);
        },

        /**
         * Validates whether array of coordinates is valid. If
         * `throwException` is `true`, it will throw exception when passed
         * coordinates are not valid, instead of returning `false`.
         * You can also specify how many coordinates should the array contain.
         *
         * Example `coordinates` parameter value: [[0, 0], [1, 1]]
         *
         * @param {array} coordinates
         * @param {boolean} throwException
         * @param {integer} minimumCoordinatesNumber
         * @param {integer} maximumCoordinatesNumber
         *
         * @return {boolean}
         */
        validateCoordinatesArray: function (
            coordinates,
            throwException,
            minimumCoordinatesNumber,
            maximumCoordinatesNumber
        ) {
            throw new CanvasShapes.Error(9014);
        }
    });

    return CoordinatesInterface;
}());
