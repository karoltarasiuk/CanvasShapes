/*global _, CanvasShapes*/

CanvasShapes.EventAbstract = (function () {

    /**
     * Abstract Event class. You can't use it directly as it will throw an
     * exception. Use `Event.getInstance` static method instead.
     *
     * This class doesn't have an `Abstract` suffix in its name as its static
     * methods and fields can be used pretty often, so it saves you on typing.
     */
    var EventAbstract = function () {
        throw new CanvasShapes.Error(8019);
    };

    CanvasShapes.Class.extend(EventAbstract.prototype, CanvasShapes.EventInterface.prototype, {

        className: 'CanvasShapes.EventAbstract',

        /**
         * Initialization method of the new Event object. It accepts native DOM
         * `event`, custom `event` object with `type` property defined, or a
         * `string` containing a custom event type.
         *
         * `target` argument is optional, and is used to overwrite the target from
         * the native DOM event object, or set the target for custom event.
         *
         * @param {[object,string]} event
         * @param {object}          target [OPTIONAL]
         */
        initialize: function (event, target) {

            if (_.isString(event)) {
                event = {
                    type: event
                };
            }

            if (!_.isObject(event) || !_.isString(event.type)) {
                throw new CanvasShapes.Error(1035);
            }

            if (
                (target && !CanvasShapes.Tools.isElement(target)) ||
                (_.isObject(event) && event.target &&
                !CanvasShapes.Tools.isElement(event.target))
            ) {
                throw new CanvasShapes.Error(1039);
            }

            this.event = event;
            this.category = CanvasShapes.Event.getCategory(this.event);
            this.target = target ? target : event.target ? event.target : null;
        },

        /**
         * Returns the type of the event.
         *
         * @return {string}
         */
        getType: function () {
            return this.event.type;
        }
    });

    return EventAbstract;
}());
