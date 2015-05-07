/*global _, CanvasShapes*/

CanvasShapes.CoordinatesAbstract = (function () {

    /**
     * Abstract for shapes which has coordinates, i.e.
     * can be positioned on a board
     */
    var CoordinatesAbstract = function () {
        throw new CanvasShapes.Error(8004);
    };

    CanvasShapes.Class.extend(
        CoordinatesAbstract.prototype,
        CanvasShapes.CoordinatesInterface.prototype,
    {
        className: 'CanvasShapes.CoordinatesAbstract',

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        processCoordinates: function (coordinates, multiple, layer) {

            var i,
                ret = [];

            if (multiple !== true) {
                coordinates = [coordinates];
            }

            for (i = 0; i < coordinates.length; i++) {
                if (_.isArray(coordinates[i])) {
                    ret.push(coordinates[i].slice(0));
                } else if (
                    _.isObject(coordinates[i]) &&
                    coordinates[i].is(CanvasShapes.CoordinatesInterface)
                ) {
                    ret.push(coordinates[i].getCoordinates().slice(0));
                }
            }

            if (
                layer && layer.is(CanvasShapes.SceneLayerInterface) &&
                layer.getScene().getRelativeRendering()
            ) {
                for (i = 0; i < ret.length; i++) {
                    // it must contain at least x and y coordinates
                    ret[i][0] = ret[i][0] * layer.getWidth() / 100;
                    ret[i][1] = ret[i][1] * layer.getHeight() / 100;
                }
            }

            if (multiple) {
                return ret;
            } else {
                return ret[0];
            }
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        validateCoordinates: function (coordinates, throwException) {

            var i,
                valid = false;

            if (_.isArray(coordinates)) {
                if (coordinates.length > 1) {

                    valid = true;

                    // checking each element in an array whether it's a number
                    for (i = 0; i < coordinates.length; i++) {
                        if (!_.isNumber(coordinates[i])) {
                            valid = false;
                            break;
                        }
                    }
                }
            }
            else if (
                _.isObject(coordinates) &&
                coordinates.is(CanvasShapes.CoordinatesInterface)
            ) {
                valid = true;
            }

            if (valid === false && throwException) {
                throw new CanvasShapes.Error(1011);
            }

            return valid;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        validateCoordinatesArray: function (coordinates, throwException, minimumCoordinatesNumber, maximumCoordinatesNumber) {

            var i,
                valid = true;

            if (!_.isArray(coordinates)) {

                valid = false;

            } else {

                for (i = 0; i < coordinates.length; i++) {
                    if (!this.validateCoordinates(coordinates[i])) {
                        valid = false;
                    }
                }
            }

            if (
                _.isNumber(minimumCoordinatesNumber) &&
                coordinates.length < minimumCoordinatesNumber
            ) {
                valid = false;
            }

            if (
                _.isNumber(maximumCoordinatesNumber) &&
                coordinates.length > maximumCoordinatesNumber
            ) {
                valid = false;
            }

            if (valid === false && throwException) {
                throw new CanvasShapes.Error(1011);
            }

            return valid;
        }
    });

    return CoordinatesAbstract;
}());
