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
         * @param {boolean} throwException [OPTIONAL]
         *
         * @return {boolean}
         */
        validateCoordinates: function (coordinates, throwException) {
            throw new CanvasShapes.Error(9013);
        },

        /**
         * Converts offset object to coordinates array. Offset object is
         * defined as follows:
         * ```
         * {
         *     x: {float},
         *     y: {float},
         *     z: {float} [OPTIONAL]
         * }
         * ```
         *
         * @param  {object} offset
         * @return {array}
         */
        translateOffsetToCoordinates: function (offset) {
            throw new CanvasShapes.Error(9057);
        },

        /**
         * Translates coordinates by a given offset and multiplier, returning a new
         * set of coordinates. It assumes that coordinates are passed as an array
         * of coordinates. Passing single array of numbers will cause the function
         * to throw an exception. Offset object is defined as follows:
         * ```
         * {
         *     x: {float},
         *     y: {float},
         *     z: {float} [OPTIONAL]
         * }
         * ```
         * Also important thing to notice is that offset is applied after
         * multiplier.
         *
         * @param  {array}  coordinates
         * @param  {object} offset
         * @param  {float} multipler
         *
         * @return {[type]}           [description]
         */
        translateCoordinates: function (coordinates, offset, multiplier) {
            throw new CanvasShapes.Error(9058);
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
         * @param {boolean} throwException [OPTIONAL]
         * @param {integer} minimumCoordinatesNumber [OPTIONAL]
         * @param {integer} maximumCoordinatesNumber [OPTIONAL]
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
