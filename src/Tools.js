/*global _, CanvasShapes*/

CanvasShapes.Tools = (function () {

    /**
     * Wrapper for `Array.prototype.slice` method.
     *
     * @param  {array}   array
     * @param  {integer} index
     *
     * @return {array}
     */
    function removeByIndex(array, index) {
        if (_.isArray(array) && array.splice) {
            array.splice(index, 1);
        }
        return array;
    }

    return {
        removeByIndex: removeByIndex
    };
})();
