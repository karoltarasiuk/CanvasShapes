/*global CanvasShapes*/

CanvasShapes.EventInterface = (function () {

    /**
     * Interface for Event class.
     *
     * @throws {CanvasShapes.Error} 8020
     */
    var EventInterface = function () {
        throw new CanvasShapes.Error(8020);
    };

    CanvasShapes.Class.extend(EventInterface.prototype, {

        _className: 'CanvasShapes.EventInterface',

        /**
         * Initialisation method of the new Event object. It accepts native DOM
         * `event`, custom `event` object with `type` property defined, or a
         * `string` containing a custom event type.
         *
         * `target` argument is optional, and is used to overwrite the target
         * from the native DOM event object, or set the target for custom event.
         *
         * @throws {CanvasShapes.Error} 9044
         *
         * @param {[object,string]} event
         * @param {object}          target [OPTIONAL]
         */
        _initialise: function (event, target) {
            throw new CanvasShapes.Error(9044);
        },

        /**
         * Returns the type of the event.
         *
         * @throws {CanvasShapes.Error} 9045
         *
         * @return {string}
         */
        getType: function () {
            throw new CanvasShapes.Error(9045);
        }
    });

    return EventInterface;
}());
