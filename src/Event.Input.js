/*global _, CanvasShapes*/

CanvasShapes.Event.Input = (function () {

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
    var InputEvent = function (event, scene, target) {
        this.initialise(event, scene, target);
    };

    CanvasShapes.Class.extend(
        InputEvent.prototype,
        CanvasShapes.EventAbstract.prototype,
    {
        className: 'CanvasShapes.Event'
    });

    // register this category
    CanvasShapes.Event.registerCategory('input', InputEvent, {
        KEYDOWN: 'keydown',
        KEYUP: 'keyup',
        KEYPRESS: 'keypress'
    }, function () {
        // I'm setting tabIndex to 1 on a body element to give it focus, so
        // it's able to capture keyboard events. I can't give it to `this.dom`
        // as there can be multiple scenes, and events must work for all of
        // them within one `Renderer`.
        document.body.tabIndex = 1;
        document.body.addEventListener('keydown', _.bind(this.dispatch, this));
        document.body.addEventListener('keyup', _.bind(this.dispatch, this));
        document.body.addEventListener('keypress', _.bind(this.dispatch, this));
    });

    return InputEvent;
}());
