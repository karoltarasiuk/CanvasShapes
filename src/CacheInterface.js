/*global CanvasShapes*/

CanvasShapes.CacheInterface = (function () {

    /**
     * An interface to handle caching mechanisms.
     *
     * @throws {CanvasShapes.Error} 8026
     */
    var CacheInterface = function () {
        throw new CanvasShapes.Error(8026);
    };

    CanvasShapes.Class.extend(CacheInterface.prototype, {

        _className: 'CanvasShapes.CacheInterface',

        /**
         * Allow you to set a value to cache. It returns `true` when the value
         * was successfully set or `false` otherwise.
         *
         * @throws {CanvasShapes.Error} 1073
         *
         * @param {string}  varname
         * @param {mixed}   value
         * @param {boolean} replaceExisting
         *
         * @return {boolean}
         */
        setCache: function (varname, value, replaceExisting) {
            throw new CanvasShapes.Error(9074);
        },

        /**
         * Allows you to retrieve a cached value.
         *
         * @param  {string}     varname
         * @return {[null,any]}
         */
        getCache: function (varname) {
            throw new CanvasShapes.Error(9075);
        }
    });

    return CacheInterface;
}());
