/*global _, CanvasShapes*/

CanvasShapes.ClassInterface = (function () {

    /**
     * Interface for any class within CanvasShapes library.
     */
    var ClassInterface = function () {
        throw new CanvasShapes.Error(8013);
    };

    _.extend(ClassInterface.prototype, {

        className: 'CanvasShapes.ClassInterface',

        /**
         * Checks whether this object is an instance of a passed class. It
         * checks `this.className` property and compares to either:
         * - passed string,
         * - to `passedClass.prototype.className` of a passed class,
         * - to `passedClass.className` property of an object.
         *
         * @param  {[string,object]} passedClass
         * @return {boolean}
         */
        is: function (passedClass) {
            throw new CanvasShapes.Error(9009);
        },

        /**
         * Generate and sets UUID V4 to this instance of the object. It will
         * also return this UUID.
         *
         * @return {string}
         */
        setUUID: function () {
            throw new CanvasShapes.Error(9050);
        },

        /**
         * Gets current UUID of the object.
         *
         * @return {string}
         */
        getUUID: function () {
            throw new CanvasShapes.Error(9050);
        }
    });

    return ClassInterface;
}());
