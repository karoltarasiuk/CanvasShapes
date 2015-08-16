/*global _, CanvasShapes*/

CanvasShapes.InteractionAbstract = (function () {

    var InteractionAbstract = function () {
        throw new CanvasShapes.Error(8018);
    };

    CanvasShapes.Class.extend(InteractionAbstract.prototype, CanvasShapes.InteractionInterface.prototype, {

        className: 'CanvasShapes.InteractionAbstract',

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        isColliding: function (mouseCoordinates) {

            var coordinates;

            if (
                !_.isFunction(this.is) ||
                !this.is(CanvasShapes.CoordinatesInterface)
            ) {
                throw new CanvasShapes.Error(1036);
            }

            if (
                !_.isObject(mouseCoordinates) ||
                !_.isNumber(mouseCoordinates.x) ||
                !_.isNumber(mouseCoordinates.y)
            ) {
                throw new CanvasShapes.Error(1037);
            }

            coordinates = this.getCoordinates();

            if (
                coordinates[0] === mouseCoordinates.x &&
                coordinates[1] === mouseCoordinates.y
            ) {
                return true;
            }

            return false;
        }
    });

    return InteractionAbstract;
}());
