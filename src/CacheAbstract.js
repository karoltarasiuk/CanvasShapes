/*global CanvasShapes*/

CanvasShapes.CacheAbstract = (function () {

    /**
     * An abstract class for caching mechanisms.
     *
     * @throws {CanvasShapes.Error} 8027
     */
    var CacheAbstract = function () {
        throw new CanvasShapes.Error(8027);
    };

    CanvasShapes.Class.extend(
        CacheAbstract.prototype,
        CanvasShapes.CacheInterface.prototype,
    {
        _className: 'CanvasShapes.CacheAbstract',

        /**
         * @implements {CanvasShapes.CacheInterface}
         */
        setCache: function (varname, value, replaceExisting) {

            if (!CanvasShapes._.isString(varname)) {
                throw new CanvasShapes.Error(1073);
            }

            if (!CanvasShapes._.isObject(this._cache)) {
                this._cache = {};
            }

            if (this._cache[varname] && replaceExisting !== true) {
                return false;
            }

            this._cache[varname] = value;

            return true;
        },

        /**
         * @implements {CanvasShapes.CacheInterface}
         */
        getCache: function (varname) {

            if (!CanvasShapes._.isString(varname)) {
                throw new CanvasShapes.Error(1073);
            }

            if (!this._cache[varname]) {
                return false;
            }

            return this._cache[varname];
        }
    });

    return CacheAbstract;
}());
