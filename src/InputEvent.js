/*global _, CanvasShapes*/

CanvasShapes.InputEvent = (function () {

    /**
     * Constructor of the new InputEvent object. It accepts native DOM `event`,
     * or a `string` containing a custom event type.
     *
     * `target` argument is optional, and is used to overwrite the target from
     * the native DOM event object, or set the target for custom event.
     *
     * @param {[object,string]} event
     * @param {object}          target [OPTIONAL]
     */
    var InputEvent = function (event, target) {
        this.initialize(event, target);
    };

    CanvasShapes.Class.extend(InputEvent.prototype, CanvasShapes.Event.prototype, {
        //
    });

    // register this category
    CanvasShapes.Event.registerCategory('input', InputEvent, {
        KEYDOWN: 'keydown',
        KEYUP: 'keyup',
        KEYPRESS: 'keypress'
    });

    return InputEvent;
}());
