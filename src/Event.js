/*global _, CanvasShapes*/

CanvasShapes.Event = (function () {

    /**
     * Abstract Event class. You can't use it directly as it will throw an
     * exception. Use `Event.getInstance` static method instead.
     *
     * This class doesn't have an `Abstract` suffix in its name as its static
     * methods and fields can be used pretty often, so it saves you on typing.
     */
    var Event = function () {
        throw new CanvasShapes.Error(8019);
    };

    CanvasShapes.Class.extend(Event.prototype, {

        className: 'CanvasShapes.Event',

        /**
         * Initialization method of the new Event object. It accepts native DOM
         * `event`, or a `string` containing a custom event type.
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

            this.event = event;
            this.category = Event.getCategory(this.event);
            this.target = target ? target : event.target;

            switch (this.category.category) {
                case CATEGORIES.MOUSE.category:
                    this.x = this.event.pageX - this.target.offsetLeft;
                    this.y = this.event.pageY - this.target.offsetTop;
                    break;
                case CATEGORIES.INPUT.category:
                    break;
                case CATEGORIES.CUSTOM.category:
                    break;
            }
        }
    });

    /**
     * Supported event categories. Must be registered within event classes.
     *
     * @type {object}
     */
    var CATEGORIES = {};

    /**
     * Returns category on the event based on passed event object.
     *
     * @param  {Event}  event
     * @return {object}
     */
    Event.getCategory = function (event) {

        var i, j;

        if (_.isString(event)) {
            event = {
                type: event
            };
        }

        if (_.isObject(event) && _.isString(event.type)) {
            for (i in CATEGORIES) {
                if (_.isObject(CATEGORIES[i].eventsObject)) {
                    for (j in CATEGORIES[i].eventsObject) {
                        if (CATEGORIES[i].eventsObject[j] === event.type) {
                            return CATEGORIES[i];
                        }
                    }
                }
            }
        } else {
            // look for custom event category
            for (i in CATEGORIES) {
                if (_.isUndefined(CATEGORIES[i].eventsObject)) {
                    return CATEGORIES[i];
                }
            }
        }

        return null;
    };

    /**
     * Simple checker whether CanvasShapes supports the event type.
     *
     * @param  {string}  eventType
     * @return {boolean}
     */
    Event.eventTypeExists = function (eventType) {

        var i, j;

        for (i in CATEGORIES) {
                if (_.isObject(CATEGORIES[i].eventsObject)) {
                    for (j in CATEGORIES[i].eventsObject) {
                        if (CATEGORIES[i].eventsObject[j] === eventType) {
                            return true;
                        }
                    }
                }
            }

        return false;
    };

    /**
     * Allows you to register a new category. Without it CanvasShapes wonn't
     * recognize those events.
     *
     * If `eventsObject` is not passed, the category will be treated as custom.
     * Remember that only one custom category is allowed. If you want to get rid
     * of the default one, use `Event.deregisterCategory`.
     *
     * @param  {string}   category
     * @param  {function} baseClass
     * @param  {object}   eventsObject [OPTIONAL]
     *
     * @return {boolean}
     */
    Event.registerCategory = function (category, baseClass, eventsObject) {

        var i;

        if (!_.isString(category)) {
            throw new CanvasShapes.Error(1030);
        }

        if (!_.isFunction(baseClass)) {
            throw new CanvasShapes.Error(1032);
        }

        if (CATEGORIES[category.toUpperCase()]) {
            throw new CanvasShapes.Error(1031);
        }

        CATEGORIES[category.toUpperCase()] = {
            category: category,
            baseClass: baseClass,
            eventsObject: eventsObject
        };
    };

    /**
     * Allows you to deregister previously registered category.
     *
     * @param {string} category
     */
    Event.deregisterCategory = function (category) {

        if (!_.isString(category)) {
            throw new CanvasShapes.Error(1028);
        }

        if (!CATEGORIES[category.toUpperCase()]) {
            throw new CanvasShapes.Error(1029);
        }

        delete CATEGORIES[category.toUpperCase()];
    };

    /**
     * Creator method of the new Event object. It accepts native DOM `event`, or
     * a `string` containing a custom event type. It will check which object
     * type you need and create it appropriately.
     *
     * `target` argument is optional, and is used to overwrite the target from
     * the native DOM event object, or set the target for custom event.
     *
     * @param {[object,string]} event
     * @param {object}          target [OPTIONAL]
     */
    Event.getInstance = function (event, target) {
        var category = Event.getCategory(event);

        if (category) {
            return new category.baseClass(event, target);
        }

        return null;
    };

    return Event;
}());
