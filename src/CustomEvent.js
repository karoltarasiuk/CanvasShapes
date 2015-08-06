/*global _, CanvasShapes*/

CanvasShapes.CustomEvent = (function () {

    /**
     * Constructor of the new CustomEvent object. It accepts native DOM `event`,
     * or a `string` containing a custom event type.
     *
     * `target` argument is optional, and is used to overwrite the target from
     * the native DOM event object, or set the target for custom event.
     *
     * @param {[object,string]} event
     * @param {object}          target [OPTIONAL]
     */
    var CustomEvent = function (event, target) {
        this.initialize(event, target);
    };

    CanvasShapes.Class.extend(CustomEvent.prototype, CanvasShapes.Event.prototype, {
        //
    });

    // register this category
    CanvasShapes.Event.registerCategory('custom', CustomEvent);

    return CustomEvent;
}());
