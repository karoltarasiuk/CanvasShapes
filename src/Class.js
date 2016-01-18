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

        if (CanvasShapes._.isString(className)) {
            this.classes = [className];
            Array.prototype.push.apply(this.classes, defaultClasses);
        } else {
            this.classes = defaultClasses;
        }
    };

    CanvasShapes._.extend(
        Class.prototype,
        CanvasShapes.ClassAbstract.prototype,
    {
        _className: 'CanvasShapes.Class'
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
     * @param {object} destination [description]
     * @param {object} sources
     *
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
        obj = CanvasShapes._.extend.apply(CanvasShapes._, args);

        CanvasShapes._.each(args, function (argument) {

            if (CanvasShapes._.isArray(argument.classes)) {
                for (i = 0; i < argument.classes.length; i++) {
                    classes.push(argument.classes[i]);
                }
            }

            if (CanvasShapes._.isString(argument._className)) {
                classes.push(argument._className);
            }
        });

        obj.classes = CanvasShapes._.uniq(classes);
    };

    /**
     * Gets the object from registry by its UUID.
     *
     * @throws {CanvasShapes.Error} 1063
     *
     * @param  {string} UUID
     * @return {[null,object]}
     */
    Class.getObject = function (UUID) {

        if (!Class.isUUID(UUID)) {
            throw new CanvasShapes.Error(1063);
        }

        if (OBJECTS[UUID]) {
            return OBJECTS[UUID];
        }

        return null;
    };

    /**
     * Sets the object in a registry. If in the registry, there was already some
     * object with the same UUID it will be replaced with a new one. If `obj`
     * exists under different UUID, it will be swapped.
     *
     * Function will return old object (under passed `UUID`) or `true`
     * otherwise.
     *
     * @throws {CanvasShapes.Error} 1062
     *
     * @param {string} UUID
     * @param {object} obj
     *
     * @return {[true,object]}
     */
    Class.setObject = function (UUID, obj) {

        var i,
            old = null;

        if (!Class.isUUID(UUID) || !CanvasShapes._.isObject(obj)) {
            throw new CanvasShapes.Error(1062);
        }

        // overwrite if UUID is already in use
        if (OBJECTS[UUID]) {
            old = OBJECTS[UUID];
        }

        // remove if obj is seved somewhere else
        for (i in OBJECTS) {
            if (OBJECTS[i] === obj && i !== UUID) {
                delete OBJECTS[i];
                break;
            }
        }

        OBJECTS[UUID] = obj;

        return old;
    };

    /**
     * Swaps the UUID for a passed object. Returns `true` if successful. If
     * object under the `oldUUID` doesn't exist it returns `false`. It only
     * swaps it within registry - it doesn't touch an object itself.
     *
     * @throws {CanvasShapes.Error} 1064
     *
     * @param {string} oldUUID
     * @param {string} newUUID
     *
     * @return {boolean}
     */
    Class.swapUUID = function (oldUUID, newUUID) {

        var obj;

        if (!Class.isUUID(oldUUID) || !Class.isUUID(newUUID)) {
            throw new CanvasShapes.Error(1064);
        }

        obj = Class.getObject(oldUUID);
        if (obj) {
            delete OBJECTS[oldUUID];
            OBJECTS[newUUID] = obj;
        }

        return !!obj;
    };

    /**
     * Removes object from a registry specified by its UUID. Function returns
     * either removed object or `null` if nothing was removed.
     *
     * @throws {CanvasShapes.Error} 1065
     *
     * @param  {string}        UUID
     * @return {[null,object]}
     */
    Class.removeObject = function (UUID) {

        var obj = null;

        if (!Class.isUUID(UUID)) {
            throw new CanvasShapes.Error(1065);
        }

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
     * @throws {CanvasShapes.Error} 1066
     *
     * @param  {string}      className
     * @return {null,object}
     */
    Class.getClass = function (className) {

        var i, classNameParts,
            classObject = CanvasShapes;

        if (!CanvasShapes._.isString(className)) {
            throw new CanvasShapes.Error(1066);
        }

        classNameParts = className.split('.');

        if (
            classNameParts.length < 2 ||
            classNameParts[0] !== 'CanvasShapes'
        ) {
            return null;
        }

        for (i = 1; i < classNameParts.length; i++) {
            if (!CanvasShapes._.isObject(classObject[classNameParts[i]])) {
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

    return Class;
}());
