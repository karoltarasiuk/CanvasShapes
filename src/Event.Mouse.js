/*global CanvasShapes*/

CanvasShapes.Event.Mouse = (function () {

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
    var MouseEvent = function (event, scene, target) {
        this.initialise(event, scene, target);
    };

    CanvasShapes.Class.extend(
        MouseEvent.prototype,
        CanvasShapes.EventAbstract.prototype,
    {
        className: 'CanvasShapes.Event',

        /**
         * @overrides {CanvasShapes.EventAbstract}
         */
        initialise: function (event, scene, target) {

            var rect;

            CanvasShapes.EventAbstract.prototype.initialise.apply(
                this,
                arguments
            );

            rect = this.target.getBoundingClientRect();

            if (
                !this.target || !CanvasShapes._.isElement(this.target) ||
                !CanvasShapes._.isObject(this.event) ||
                !CanvasShapes._.isNumber(this.event.pageX) ||
                !CanvasShapes._.isNumber(this.event.pageY)
            ) {
                throw new CanvasShapes.Error(1041);
            }

            this.x = this.event.pageX - (rect.left + document.body.scrollLeft);
            this.y = this.event.pageY - (rect.top + document.body.scrollTop);
        }
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
    }, function () {
        this.dom.addEventListener(
            'click',
            CanvasShapes._.bind(this.dispatch, this)
        );
        this.dom.addEventListener(
            'mousedown',
            CanvasShapes._.bind(this.dispatch, this)
        );
        this.dom.addEventListener(
            'mouseup',
            CanvasShapes._.bind(this.dispatch, this)
        );
        this.dom.addEventListener(
            'mouseover',
            CanvasShapes._.bind(this.dispatch, this)
        );
        this.dom.addEventListener(
            'mouseout',
            CanvasShapes._.bind(this.dispatch, this)
        );
        this.dom.addEventListener(
            'mousemove',
            CanvasShapes._.bind(this.dispatch, this)
        );
        this.dom.addEventListener(
            'contextmenu',
            CanvasShapes._.bind(this.dispatch, this)
        );
        this.dom.addEventListener(
            'dblclick',
            CanvasShapes._.bind(this.dispatch, this)
        );
    });

    return MouseEvent;
}());
