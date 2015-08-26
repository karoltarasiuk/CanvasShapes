/*global _, CanvasShapes*/

CanvasShapes.InteractionInterface = (function () {

    /**
     * An interface for any shape providing interaction options, i.e. reacting
     * on mouse and keyboard input. It's also used by a scene which is actually
     * a hub for all the events.
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
        },

        /**
         * Attaches an event handler to this interactive object instance. It
         * prevents you from adding the same handler for the second time.
         * `context` should default to `this`.
         *
         * The handler should be ready to accept 1 argument which is
         * `CanvasShapes.EventAbstract` object.
         *
         * Returns boolean with the result of attaching.
         *
         * @param  {string}   eventType
         * @param  {function} handler
         * @param  {object}   context
         */
        on: function (eventType, handler, context) {
            throw new CanvasShapes.Error(9038);
        },

        /**
         * Allows you to detach the event handler from the scene.
         *
         * When `handlerOrType` is a string it will detach all the handlers,
         * matching passed type.
         *
         * If it's a function, it will detach only the same handler (comparison
         * operator here is `===`). If the second argument is passed, it will
         * remove only the handler of the specified type.
         *
         * If you pass `context` it will disable this particular event or
         * event-handler pair specifically for this object (context).
         *
         * Assuming, valid use cases are:
         * `instance.off('some-event-type')`
         * `instance.off('some-event-type', contextObject)`
         * `instance.off(someHandlerFunction)`
         * `instance.off(someHandlerFunction, 'some-event-type')`
         * `instance.off(someHandlerFunction, 'some-event-type', contextObject)`
         *
         * @param {[string,function]} handlerOrType
         * @param {string}            eventTypeOrContext [OPTIONAL]
         * @param {context}           context [OPTIONAL]
         */
        off: function (handlerOrType, eventTypeOrContext, context) {
            throw new CanvasShapes.Error(9039);
        },

        /**
         * Its job is to trigger all the handlers attached using `on()` method
         * of the passed `type`. `type` attribute must exist within passed
         * `event` argument, or `event` must be a `string` containing a type.
         *
         * It also possible (and very handy for custom events) to pass ready to
         * use CanvasShapes.EventAbstract object. This way any event can be triggered.
         *
         * If the `context` is passed the event will be dispatched only for the
         * matching context object.
         *
         * @param {[Event,object,string,CanvasShapes.EventAbstract]}  event
         * @param {object}                                            context
         */
        dispatch: function (event, context) {
            throw new CanvasShapes.Error(9040);
        }
    });

    return InteractionInterface;
}());
