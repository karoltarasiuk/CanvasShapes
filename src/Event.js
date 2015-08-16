/*global _, CanvasShapes*/

CanvasShapes.Event = (function () {

    /**
     * Constructor of the new Event object. It accepts native DOM `event`,
     * or a `string` containing a custom event type.
     *
     * `target` argument is optional, and is used to overwrite the target from
     * the native DOM event object, or set the target for custom event.
     *
     * @param {[object,string]} event
     * @param {object}          target [OPTIONAL]
     */
    var Event = function (event, target) {
        this.initialize(event, target);
    };

    CanvasShapes.Class.extend(Event.prototype, CanvasShapes.EventAbstract.prototype, {

        className: 'CanvasShapes.Event'
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
     * @param  {[Event,string]}  event
     * @return {object}
     */
    Event.getCategory = function (event) {

        var i, j;

        if (
            !_.isString(event) &&
            (!_.isObject(event) || !_.isString(event.type))
        ) {
            throw new CanvasShapes.Error(1040);
        }

        if (_.isString(event)) {
            event = {
                type: event
            };
        }

        // search for registered event within some category
        for (i in CATEGORIES) {
            if (_.isObject(CATEGORIES[i].eventsObject)) {
                for (j in CATEGORIES[i].eventsObject) {
                    if (CATEGORIES[i].eventsObject[j] === event.type) {
                        return CATEGORIES[i];
                    }
                }
            }
        }

        // category not found, look for custom event category
        for (i in CATEGORIES) {
            if (_.isUndefined(CATEGORIES[i].eventsObject)) {
                return CATEGORIES[i];
            }
        }
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
     * When `initializeListeners` is passed, it will be called whenever scene
     * object requests listeners initialization. Scene object will also become
     * a context for this call.
     *
     * @param  {string}   category
     * @param  {function} baseClass
     * @param  {object}   eventsObject [OPTIONAL]
     * @param  {function} initializeListeners [OPTIONAL]
     *
     * @return {boolean}
     */
    Event.registerCategory = function (category, baseClass, eventsObject, initializeListeners) {

        if (!_.isString(category) || category.length === 0) {
            throw new CanvasShapes.Error(1030);
        }

        if (!_.isFunction(baseClass)) {
            throw new CanvasShapes.Error(1032);
        }

        if (CATEGORIES[category.toUpperCase()]) {
            throw new CanvasShapes.Error(1031);
        }

        if (eventsObject && !_.isObject(eventsObject)) {
            throw new CanvasShapes.Error(1033);
        }

        if (initializeListeners && !_.isFunction(initializeListeners)) {
            throw new CanvasShapes.Error(1034);
        }

        CATEGORIES[category.toUpperCase()] = {
            category: category,
            baseClass: baseClass,
            eventsObject: eventsObject,
            initializeListeners: initializeListeners
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
     * Initialize listeners for each registered category. `scene` is a context
     * of this call.
     *
     * @param  {CanvasShapes.SceneInterface} scene
     */
    Event.initializeListeners = function (scene) {

        var i;

        if (
            !_.isObject(scene) || !_.isFunction(scene.is) ||
            !scene.is(CanvasShapes.SceneInterface)
        ) {
            throw new CanvasShapes.Error(1038);
        }

        for (i in CATEGORIES) {
            if (CATEGORIES[i].initializeListeners) {
                CATEGORIES[i].initializeListeners.call(scene);
            }
        }
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

    // register this category
    Event.registerCategory('custom', Event);

    return Event;
}());
