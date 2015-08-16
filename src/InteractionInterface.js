/*global _, CanvasShapes*/

CanvasShapes.InteractionInterface = (function () {

    /**
     * An interface for any shape providing interaction options, i.e. reacting
     * on mouse and keyboard input.
     */
    var InteractionInterface = function () {
        throw new CanvasShapes.Error(8010);
    };

    CanvasShapes.Class.extend(InteractionInterface.prototype, {

        className: 'CanvasShapes.InteractionInterface',

        /**
         * Collision detection for shapes. Returns `true` when collision is
         * detected.
         *
         * `mouseCoordinates` object must simply contain `x` and `y` properties.
         *
         * @param  {object} mouseCoordinates
         * @return {boolean}
         */
        isColliding: function (mouseCoordinates) {
            throw new CanvasShapes.Error(9042);
        }
    });

    return InteractionInterface;
}());
