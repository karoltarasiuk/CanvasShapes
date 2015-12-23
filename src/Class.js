/*global _, CanvasShapes*/

CanvasShapes.Class = (function () {

    var defaultClasses = [
        'CanvasShapes.Class',
        'CanvasShapes.ClassAbstract',
        'CanvasShapes.ClassInterface'
    ];

    /**
     * Base object for every other class in CanvasShapes library.
     */
    var Class = function (className) {
        this.setUUID();

        if (_.isString(className)) {
            this.classes = [className];
            Array.prototype.push.apply(this.classes, defaultClasses);
        } else {
            this.classes = defaultClasses;
        }
    };

    /**
     * Class.extend(destination, *sources)
     *
     * Copy all of the properties in the source objects over to the destination
     * object, and return the destination object. It's in-order, so the last
     * source will override properties of the same name in previous arguments.
     *
     * It adds CanvasShapes.Class.prototype as a first source on the list.
     * It also populates `classes` array with all class names destination
     * inherits from.
     *
     * @param  {object} destination [description]
     * @param  {object} sources
     * @return {object}
     */
    Class.extend = function() {

        var i, obj,
            args = [],
            classes = defaultClasses.slice();

        // copying arguments object into an array
        for (i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        // inserting Class.prototype under index 1
        args.splice(1, 0, Class.prototype);

        // underscore extend
        obj = _.extend.apply(_, args);

        _.each(args, function (argument) {

            if (_.isArray(argument.classes)) {
                for (i = 0; i < argument.classes.length; i++) {
                    classes.push(argument.classes[i]);
                }
            }

            if (_.isString(argument.className)) {
                classes.push(argument.className);
            }
        });

        obj.classes = _.uniq(classes);
    };

    _.extend(Class.prototype, CanvasShapes.ClassAbstract.prototype, {

        className: 'CanvasShapes.Class'
    });

    /**
     * Map of all objects which has an UUID generate using `getUUID()` method.
     *
     * {
     *     UUID: object,
     *     ...
     * }
     *
     * @type {object}
     */
    var OBJECTS = {};

    /**
     * Gets the object from registry by its UUID.
     *
     * @param  {string} UUID
     * @return {[null,object]}
     */
    Class.getObject = function (UUID) {

        if (OBJECTS[UUID]) {
            return OBJECTS[UUID];
        }

        return null;
    };

    /**
     * Sets the object in a registry. If in the registry, there was already an
     * object with given UUID it will be replaced with a new one, and returned.
     * If there was no object function will return `null`.
     *
     * If `object` already exists and `UUID` is different, it will be replaced
     * with a passed one. If `UUID` is the same, nothing will happen. In both
     * those cases function will return `null` anyway.
     *
     * @param {string} UUID
     * @param {object} obj
     *
     * @return {[null,object]}
     */
    Class.setObject = function (UUID, obj) {

        var i,
            old = null;

        if (OBJECTS[UUID]) {
            old = OBJECTS[UUID];
        } else {
            for (i in OBJECTS) {
                if (OBJECTS[i] === obj && i !== UUID) {
                    delete OBJECTS[i];
                    break;
                }
            }
        }

        OBJECTS[UUID] = obj;

        return old;
    };

    /**
     * Swaps the UUID for a passed object. Returns `true` if successful. If
     * object under the `oldUUID` didn't exist it returns `false`.
     *
     * @param  {string} oldUUID
     * @param  {string} newUUID
     *
     * @return {boolean}
     */
    Class.swapUUID = function (oldUUID, newUUID) {

        var obj;

        if (OBJECTS[oldUUID]) {
            obj = OBJECTS[oldUUID];
            delete OBJECTS[oldUUID];
            OBJECTS[newUUID] = obj;
            obj.setUUID(newUUID);
        }

        return !!obj;
    };

    /**
     * Removes object from a registry specified by its UUID. Function returns
     * either removed object or `null` if nothing was removed.
     *
     * @param  {string} UUID
     * @return {[null,object]}
     */
    Class.removeObject = function (UUID) {

        var obj = null;

        if (OBJECTS[UUID]) {
            obj = OBJECTS[UUID];
            delete OBJECTS[UUID];
        }

        return obj;
    };

    /**
     * Empties the objects registry and returns the old version of it.
     *
     * @return {object}
     */
    Class.emptyObjects = function () {

        var old = OBJECTS;
        OBJECTS = {};
        return old;
    };

    /**
     * Gets whole collection of objects created using this class.
     *
     * @return {object}
     */
    Class.getObjects = function () {
        return OBJECTS;
    };

    /**
     * Gets class object from comma separated object notation string. It looks
     * for it only within CanvasShapes namespace, so if your object is not
     * there, `null` will be returned.
     *
     * @param  {string} className
     * @return {null,object}
     */
    Class.getClass = function (className) {

        var i, classNameParts,
            classObject = CanvasShapes;

        if (!_.isString(className)) {
            return null;
        }

        classNameParts = className.split('.');

        if (
            classNameParts.length < 2 ||
            classNameParts[0] !== 'CanvasShapes'
        ) {
            return null;
        }

        for (i = 1; i < classNameParts.length; i++) {
            if (!_.isObject(classObject[classNameParts[i]])) {
                return null;
            }
            classObject = classObject[classNameParts[i]];
        }

        return classObject;
    };

    /**
     * Checks whether passed string is a UUID
     *
     * @param  {string}  UUID
     * @return {boolean}
     */
    Class.isUUID = function (UUID) {
        return CanvasShapes.Tools.isuuid(UUID);
    };

    /**
     * Creates an object from provided JSON. It will create it based on
     * `metadata.className` attribute. It will throw an exception if something
     * wrong will happen.
     *
     * @param  {[object,string]} obj
     * @return {object}
     */
    Class.fromJSON = function (obj) {

        var classObject;

        if (
            !_.isObject(obj.metadata) || !_.isObject(obj.data) ||
            !_.isString(obj.metadata.className) ||
            !_.isString(obj.metadata.UUID)
        ) {
            throw new CanvasShapes.Error(1064);
        }

        classObject = Class.getClass(obj.metadata.className);

        if (
            !_.isObject(classObject) ||
            !_.isFunction(classObject.prototype.fromJSON)
        ) {
            throw new CanvasShapes.Error(1066);
        }

        return classObject.prototype.fromJSON.call(null, obj);
    };

    return Class;
}());
