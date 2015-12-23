/*global _, CanvasShapes*/

CanvasShapes.JSONInterface = (function () {

    /**
     * Interface for any object able to serialise.
     */
    var JSONInterface = function () {
        throw new CanvasShapes.Error(8025);
    };

    CanvasShapes.Class.extend(JSONInterface.prototype, {

        className: 'CanvasShapes.JSONInterface',

        /**
         * Allows serialisation of the object to JSON.
         *
         * If toString is `true`, it will use `JSON.stringify()` on the result.
         *
         * JSON object format with some example data:
         * ```
         * {
         *     metadata: {
         *         className: 'CanvasShapes.Shape',
         *         UUID: '85eea6ac-75e2-4bd3-9fdb-5dd09301db71'
         *     },
         *     data: {
         *         // anything needed to reconstruct the object
         *     }
         * }
         * ```
         *
         * If an object depends on other serializable objects (point's face or
         * shape's style) it shouldn't be serialized separately. All this should
         * be managed by scene's `toJSON` method, which will resolve all those
         * dependencies without creating extra and redundant data.
         *
         * @param  {boolean} toString [OPTIONAL]
         * @return {string}
         */
        toJSON: function (toString) {
            throw new CanvasShapes.Error(9066);
        },

        /**
         * Allows de-serialisation of the object.
         *
         * This method should be able to run as a standalone via prototype only,
         * e.g. object.prototype.fromJSON.apply(null, [JSON]). As you can see
         * `this` argument is `null`, so there is no context you can rely on. It
         * should also support backwards compatibility in case when breaking
         * changes to the structure will be introduced.
         *
         * If an object depends on other serializable objects (point's face or
         * shape's style) it shouldn't be serialized separately. All this should
         * be managed by scene's `fromJSON` method, which will resolve all those
         * dependencies without creating extra and redundant data.
         *
         * @param  {[object,string]} JSON
         * @return {object}
         */
        fromJSON: function (JSON) {
            throw new CanvasShapes.Error(9068);
        }
    });

    return JSONInterface;
}());
