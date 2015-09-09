/*global _, CanvasShapes*/

CanvasShapes.ClassAbstract = (function () {

    /**
     * Abstract for any class within CanvasShapes library.
     */
    var ClassAbstract = function () {
        throw new CanvasShapes.Error(8005);
    };

    _.extend(ClassAbstract.prototype, CanvasShapes.ClassInterface.prototype, {

        className: 'CanvasShapes.ClassAbstract',

        /**
         * @implements {CanvasShapes.ClassInterface}
         */
        is: function (passedClass) {

            if (_.isObject(passedClass)) {
                if (passedClass.className) {
                    passedClass = passedClass.className;
                } else if (
                    passedClass.prototype &&
                    passedClass.prototype.className
                ) {
                    passedClass = passedClass.prototype.className;
                }
            }

            if (_.isString(passedClass)) {
                return this.classes.indexOf(passedClass) !== -1;
            } else {
                throw new CanvasShapes.Error(1009);
            }
        },

        /**
         * @implements {CanvasShapes.ClassInterface}
         */
        setUUID: function () {
            this.UUID = CanvasShapes.Tools.uuid();
            return this.getUUID();
        },

        /**
         * @implements {CanvasShapes.ClassInterface}
         */
        getUUID: function () {
            return this.UUID;
        }
    });

    return ClassAbstract;
}());
