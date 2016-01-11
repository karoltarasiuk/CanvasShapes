/*global CanvasShapes*/

CanvasShapes.EventInterface = (function () {

    /**
     * Interface for Event class.
     */
    var EventInterface = function () {
        throw new CanvasShapes.Error(8020);
    };

    CanvasShapes.Class.extend(EventInterface.prototype, {

        className: 'CanvasShapes.EventInterface',

        /**
         * Initialisation method of the new Event object. It accepts native DOM
         * `event`, custom `event` object with `type` property defined, or a
         * `string` containing a custom event type.
         *
         * `target` argument is optional, and is used to overwrite the target
         * from the native DOM event object, or set the target for custom event.
         *
         * @param {[object,string]} event
         * @param {object}          target [OPTIONAL]
         */
        initialise: function (event, target) {
            throw new CanvasShapes.Error(9044);
        },

        /**
         * Returns the type of the event.
         *
         * @return {string}
         */
        getType: function () {
            throw new CanvasShapes.Error(9045);
        }
    });

    return EventInterface;
}());
