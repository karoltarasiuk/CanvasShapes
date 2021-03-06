/*global _, CanvasShapes*/

CanvasShapes.ClassInterface = (function () {

    /**
     * Interface for any class within CanvasShapes library.
     *
     * @throws {CanvasShapes.Error} 8013
     */
    var ClassInterface = function () {
        throw new CanvasShapes.Error(8013);
    };

    CanvasShapes._.extend(ClassInterface.prototype, {

        _className: 'CanvasShapes.ClassInterface',

        /**
         * Checks whether this object is an instance of a passed class. It
         * checks `this.className` property and compares to either:
         * - passed string,
         * - to `passedClass.prototype.className` of a passed class,
         * - to `passedClass.className` property of an object.
         *
         * @throws {CanvasShapes.Error} 9009
         *
         * @param  {[string,object]} passedClass
         * @return {boolean}
         */
        is: function (passedClass) {
            throw new CanvasShapes.Error(9009);
        },

        /**
         * Generate and sets UUID V4 to this instance of the object. It will
         * also return this UUID. This method should always add the shape to
         * the global registry of all objects.
         *
         * If 'UUID' is passed it will be used as an unique identifier. Remember
         * to use it cautiously, as it's up to you to provide a unique one. The
         * general recommendation is to avoid using this feature unless some
         * kind of deserialisation is needed.
         *
         * @throws {CanvasShapes.Error} 9050
         *
         * @param  {string} UUID [OPTIONAL]
         * @return {string}
         */
        setUUID: function (UUID) {
            throw new CanvasShapes.Error(9050);
        },

        /**
         * Gets current UUID of the object.
         *
         * @throws {CanvasShapes.Error} 9051
         *
         * @return {string}
         */
        getUUID: function () {
            throw new CanvasShapes.Error(9051);
        },

        /**
         * Gets class name of this object.
         *
         * @throws {CanvasShapes.Error} 9066
         *
         * @return {string}
         */
        getClassName: function () {
            throw new CanvasShapes.Error(9066);
        }
    });

    return ClassInterface;
}());
