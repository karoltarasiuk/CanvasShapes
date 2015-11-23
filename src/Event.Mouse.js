/*global _, CanvasShapes*/

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
        this.initialize(event, scene, target);
    };

    CanvasShapes.Class.extend(
        MouseEvent.prototype,
        CanvasShapes.EventAbstract.prototype,
    {
        className: 'CanvasShapes.Event',

        /**
         * @override {CanvasShapes.EventAbstract}
         */
        initialize: function (event, target) {

            CanvasShapes.EventAbstract.prototype.initialize.apply(
                this,
                arguments
            );

            if (
                !this.target || !CanvasShapes.Tools.isElement(this.target) ||
                !_.isObject(this.event) || !_.isNumber(this.event.pageX) ||
                !_.isNumber(this.event.pageY) ||
                !_.isNumber(this.target.offsetLeft) ||
                !_.isNumber(this.target.offsetTop)
            ) {
                throw new CanvasShapes.Error(1041);
            }

            this.x = this.event.pageX - this.target.offsetLeft;
            this.y = this.event.pageY - this.target.offsetTop;
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
        this.dom.addEventListener('click', _.bind(this.dispatch, this));
        this.dom.addEventListener('mousedown', _.bind(this.dispatch, this));
        this.dom.addEventListener('mouseup', _.bind(this.dispatch, this));
        this.dom.addEventListener('mouseover', _.bind(this.dispatch, this));
        this.dom.addEventListener('mouseout', _.bind(this.dispatch, this));
        this.dom.addEventListener('mousemove', _.bind(this.dispatch, this));
        this.dom.addEventListener('contextmenu', _.bind(this.dispatch, this));
        this.dom.addEventListener('dblclick', _.bind(this.dispatch, this));
    });

    return MouseEvent;
}());
