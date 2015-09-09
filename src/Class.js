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

    return Class;
}());
