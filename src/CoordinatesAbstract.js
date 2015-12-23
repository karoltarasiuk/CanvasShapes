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
        convertCoordinatesObjects: function (coordinates) {

            var i,
                newCoordinates = [];

            if (_.isArray(coordinates)) {
                for (i = 0; i < coordinates.length; i++) {
                    if (
                        _.isObject(coordinates[i]) &&
                        _.isFunction(coordinates[i].is) &&
                        coordinates[i].is(CanvasShapes.CoordinatesInterface)
                    ) {
                        newCoordinates[i] = coordinates[i].getUUID();
                    } else {
                        newCoordinates[i] = coordinates[i];
                    }
                }
            }

            return newCoordinates;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        areCoordinatesSingle: function (coordinates) {

            if (
                (_.isArray(coordinates) && coordinates.length > 0 &&
                _.isNumber(coordinates[0])) || _.isString(coordinates)
            ) {
                return true;
            }

            return false;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        processCoordinates: function (coordinates, layer) {

            var i, tempCoordinates, single,
                ret = [];

            if (this.areCoordinatesSingle(coordinates)) {
                single = true;
                coordinates = [coordinates];
            }

            for (i = 0; i < coordinates.length; i++) {
                if (_.isArray(coordinates[i])) {
                    ret.push(coordinates[i].slice(0));
                } else if(_.isString(coordinates[i])) {
                    tempCoordinates = CanvasShapes.Class
                        .getObject(coordinates[i]);
                    if (tempCoordinates) {
                        ret.push(tempCoordinates.getCentreCoordinates().slice(0));
                    } else {
                        throw new CanvasShapes.Error(1069);
                    }
                } else {
                    throw new CanvasShapes.Error(1069);
                }
            }

            if (
                _.isObject(layer) && _.isFunction(layer.is) &&
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

            if (single) {
                ret = ret[0];
            }

            return ret;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        translateOffsetToCoordinates: function (offset) {

            var i,
                ret = [],
                dictionary = ['x', 'y', 'z'];

            if (!_.isObject(offset) || _.isArray(offset)) {
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
         */
        translateCoordinates: function (coordinates, offset, multiplier) {

            var i, j, single, tempCoordinates,
                newCoordinates = [];

            if (this.areCoordinatesSingle(coordinates)) {
                tempCoordinates = [coordinates];
                single = true;
            } else {
                tempCoordinates = coordinates;
            }

            this.validateCoordinates(tempCoordinates, true);
            offset = this.translateOffsetToCoordinates(offset);

            if (!multiplier) {
                multiplier = 1;
            } else if (!_.isNumber(multiplier)) {
                throw new CanvasShapes.Error(1049);
            }

            for (i = 0; i < tempCoordinates.length; i++) {
                newCoordinates[i] = [];
                for (j = 0; j < tempCoordinates[i].length; j++) {
                    newCoordinates[i][j] =
                        tempCoordinates[i][j] * multiplier + offset[j];
                }
            }

            if (single) {
                newCoordinates = newCoordinates[0];
            }

            return newCoordinates;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        validateCoordinates: function (
            coordinates,
            throwException,
            minimumCoordinatesNumber,
            maximumCoordinatesNumber
        ) {
            var i, tempCoordinates,
                valid = true;

            if (this.areCoordinatesSingle(coordinates)) {
                tempCoordinates = [coordinates];
            } else {
                tempCoordinates = coordinates;
            }

            if (!_.isArray(tempCoordinates)) {

                valid = false;

            } else {

                for (i = 0; i < tempCoordinates.length; i++) {
                    if (!this._validateSingleCoordinates(tempCoordinates[i])) {
                        valid = false;
                    }
                }

                if (
                    _.isNumber(minimumCoordinatesNumber) &&
                    tempCoordinates.length < minimumCoordinatesNumber
                ) {
                    valid = false;
                }

                if (
                    _.isNumber(maximumCoordinatesNumber) &&
                    tempCoordinates.length > maximumCoordinatesNumber
                ) {
                    valid = false;
                }

                if (tempCoordinates.length < 1) {
                    valid = false;
                }
            }

            if (valid === false && throwException) {
                throw new CanvasShapes.Error(1011);
            }

            return valid;
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
        _validateSingleCoordinates: function (coordinates, throwException) {

            var i, tempObject,
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
            } else if (_.isString(coordinates)) {
                tempObject = CanvasShapes.Class.getObject(coordinates);
                if (
                    _.isObject(tempObject) && _.isFunction(tempObject.is) &&
                    tempObject.is(CanvasShapes.CoordinatesInterface)
                ) {
                    valid = true;
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

            if (this.areCoordinatesSingle(coordinates)) {
                coordinates = [coordinates];
            }

            coordinates = this.processCoordinates(coordinates);

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
            return this.coordinates;
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        setCoordinates: function (coordinates) {
            this.coordinates = coordinates;
        }
    });

    return CoordinatesAbstract;
}());
