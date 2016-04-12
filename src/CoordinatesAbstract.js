/*global CanvasShapes*/

CanvasShapes.CoordinatesAbstract = (function () {

    /**
     * Abstract for shapes which has coordinates, i.e. can be positioned on a
     * board.
     *
     * @throws {CanvasShapes.Error} 8004
     */
    var CoordinatesAbstract = function () {
        throw new CanvasShapes.Error(8004);
    };

    CanvasShapes.Class.extend(
        CoordinatesAbstract.prototype,
        CanvasShapes.CoordinatesInterface.prototype,
    {
        _className: 'CanvasShapes.CoordinatesAbstract',

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        processCoordinates: function (coordinates, layer) {

            var i, multiple,
                ret = [];

            if (this.areCoordinatesMultiple(coordinates)) {
                multiple = true;
            } else {
                coordinates = [coordinates];
            }

            for (i = 0; i < coordinates.length; i++) {
                if (CanvasShapes._.isArray(coordinates[i])) {
                    ret.push(coordinates[i].slice(0));
                } else if (
                    CanvasShapes._.isObject(coordinates[i]) &&
                    coordinates[i].is(CanvasShapes.CoordinatesInterface)
                ) {
                    ret.push(coordinates[i].getCentreCoordinates().slice(0));
                }
            }

            if (
                CanvasShapes._.isObject(layer) &&
                CanvasShapes._.isFunction(layer.is) &&
                layer.is(CanvasShapes.SceneLayerInterface) &&
                this.is(CanvasShapes.RenderingInterface) &&
                this.getRelativeRendering()
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
         *
         * @throws {CanvasShapes.Error} 1011
         */
        validateCoordinates: function (coordinates, throwException) {

            var i,
                valid = false;

            if (CanvasShapes._.isArray(coordinates)) {
                if (coordinates.length > 1) {

                    valid = true;

                    // checking each element in an array whether it's a number
                    for (i = 0; i < coordinates.length; i++) {
                        if (!CanvasShapes._.isNumber(coordinates[i])) {
                            valid = false;
                            break;
                        }
                    }
                }
            } else if (
                CanvasShapes._.isObject(coordinates) &&
                CanvasShapes._.isFunction(coordinates.is) &&
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
         *
         * @throws {CanvasShapes.Error} 1047
         */
        translateOffsetToCoordinates: function (offset) {

            var i,
                ret = [],
                dictionary = ['x', 'y', 'z'];

            if (
                !CanvasShapes._.isObject(offset) ||
                CanvasShapes._.isArray(offset)
            ) {
                throw new CanvasShapes.Error(1047);
            }

            for (i = 0; i < dictionary.length; i++) {
                if (offset[dictionary[i]]) {
                    ret.push(offset[dictionary[i]]);
                } else {
                    ret.push(0);
                }
            }

            return ret;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         *
         * @throws {CanvasShapes.Error} 1049
         */
        translateCoordinates: function (coordinates, offset, multiplier) {

            var i, j,
                newCoordinates = [];

            this.validateCoordinatesArray(coordinates, true);
            offset = this.translateOffsetToCoordinates(offset);

            if (!multiplier) {
                multiplier = 1;
            } else if (!CanvasShapes._.isNumber(multiplier)) {
                throw new CanvasShapes.Error(1049);
            }

            for (i = 0; i < coordinates.length; i++) {
                newCoordinates[i] = [];
                for (j = 0; j < coordinates[i].length; j++) {
                    newCoordinates[i][j] =
                        coordinates[i][j] * multiplier + offset[j];
                }
            }

            return newCoordinates;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         *
         * @throws {CanvasShapes.Error} 1011
         */
        validateCoordinatesArray: function (
            coordinates,
            throwException,
            minimumCoordinatesNumber,
            maximumCoordinatesNumber
        ) {
            var i,
                valid = true;

            if (!CanvasShapes._.isArray(coordinates)) {

                valid = false;

            } else {

                for (i = 0; i < coordinates.length; i++) {
                    if (!this.validateCoordinates(coordinates[i])) {
                        valid = false;
                    }
                }

                if (
                    CanvasShapes._.isNumber(minimumCoordinatesNumber) &&
                    coordinates.length < minimumCoordinatesNumber
                ) {
                    valid = false;
                }

                if (
                    CanvasShapes._.isNumber(maximumCoordinatesNumber) &&
                    coordinates.length > maximumCoordinatesNumber
                ) {
                    valid = false;
                }

                if (coordinates.length < 1) {
                    valid = false;
                }
            }

            if (valid === false && throwException) {
                throw new CanvasShapes.Error(1011);
            }

            return valid;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        getCentreCoordinates: function () {

            var i,
                coordinates = this.getCoordinates(),
                j = 0,
                x = 0,
                y = 0,
                z = 0;

            if (
                CanvasShapes._.isArray(coordinates) && coordinates.length > 0 &&
                !CanvasShapes._.isArray(coordinates[0]) &&
                !CanvasShapes._.isObject(coordinates[0])
            ) {
                coordinates = [coordinates];
            }

            for (i = 0; i < coordinates.length; i++) {
                x += coordinates[i][0];
                y += coordinates[i][1];
                if (coordinates[i].length > 2) {
                    z += coordinates[i][2];
                }
                j++;
            }

            if (j > 0) {
                x /= j;
                y /= j;
                z /= j;
            }

            return [x, y, z];
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        getCoordinates: function () {
            return this._coordinates;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        setCoordinates: function (coordinates) {
            this._coordinates = coordinates;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         *
         * @throws {CanvasShapes.Error} 1011
         */
        areCoordinatesEqual: function (coordinates) {

            var i,
                checkEquality = function (coordinate1, coordinate2) {
                    var i;
                    if (coordinate1.length !== coordinate2.length) {
                        return false;
                    }
                    for (i = 0; i < coordinate1.length; i++) {
                        if (coordinate1[i] !== coordinate2[i]) {
                            return false;
                        }
                    }
                    return true;
                };

            this.validateCoordinatesArray(coordinates);

            for (i = 0; i < coordinates.length - 1; i++) {
                if (!checkEquality(coordinates[i], coordinates[i + 1])) {
                    return false;
                }
            }

            return true;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        areCoordinatesMultiple: function (coordinates) {

            if (
                (CanvasShapes._.isArray(coordinates) &&
                    coordinates.length > 0) &&
                (CanvasShapes._.isArray(coordinates[0]) ||
                    CanvasShapes._.isObject(coordinates[0]))
            ) {
                return true;
            }

            return false;
        }
    });

    return CoordinatesAbstract;
}());
