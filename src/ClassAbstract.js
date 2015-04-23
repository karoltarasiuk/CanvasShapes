/*global _, CanvasShapes*/

CanvasShapes.ClassAbstract = (function () {

    /**
     * Abstract for any class within CanvasShapes library.
     */
    var ClassAbstract = function () {
        throw new CanvasShapes.Error();
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
        }
    });

    return ClassAbstract;
}());
