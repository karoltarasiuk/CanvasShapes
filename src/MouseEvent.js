/*global _, CanvasShapes*/

CanvasShapes.MouseEvent = (function () {

    /**
     * Constructor of the new MouseEvent object. It accepts native DOM `event`,
     * or a `string` containing a custom event type.
     *
     * `target` argument is optional, and is used to overwrite the target from
     * the native DOM event object, or set the target for custom event.
     *
     * @param {[object,string]} event
     * @param {object}          target [OPTIONAL]
     */
    var MouseEvent = function (event, target) {
        this.initialize(event, target);
    };

    CanvasShapes.Class.extend(MouseEvent.prototype, CanvasShapes.Event.prototype, {
        //
    });

    // register this category
    CanvasShapes.Event.registerCategory('mouse', MouseEvent, {
        CLICK: 'click',
        MOUSEDOWN: 'mousedown',
        MOUSEUP: 'mouseup',
        MOUSEOVER: 'mouseover',
        MOUSEOUT: 'mouseout',
        MOUSEMOVE: 'mousemove',
        CONTEXTMENU: 'contextmenu',
        DBLCLICK: 'dblclick'
    });

    return MouseEvent;
}());
