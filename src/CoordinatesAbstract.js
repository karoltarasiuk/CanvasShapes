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
        processCoordinates: function (coordinates, layer) {

            var i, multiple,
                ret = [];

            if (
                (_.isArray(coordinates) && coordinates.length > 0) &&
                (_.isArray(coordinates[0]) || _.isObject(coordinates[0]))
            ) {
                multiple = true;
            } else {
                coordinates = [coordinates];
            }

            for (i = 0; i < coordinates.length; i++) {
                if (_.isArray(coordinates[i])) {
                    ret.push(coordinates[i].slice(0));
                } else if (
                    _.isObject(coordinates[i]) &&
                    coordinates[i].is(CanvasShapes.CoordinatesInterface)
                ) {
                    ret.push(coordinates[i].getCentreCoordinates().slice(0));
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
                _.isObject(coordinates) && _.isFunction(coordinates.is) &&
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
        translateOffsetToCoordinates: function (offset) {

            var i,
                ret = [],
                dictionary = ['x', 'y', 'z'];

            if (!_.isObject(offset)) {
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
        validateCoordinatesArray: function (
            coordinates,
            throwException,
            minimumCoordinatesNumber,
            maximumCoordinatesNumber
        ) {
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
                coordinates = this.coordinates,
                j = 0,
                x = 0,
                y = 0,
                z = 0;

            if (
                _.isArray(coordinates) && coordinates.length > 0 &&
                !_.isArray(coordinates[0]) && !_.isObject(coordinates[0])
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
