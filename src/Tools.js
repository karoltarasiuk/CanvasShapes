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

    /**
     * Checks if passed value is a DOM node, e.g. element, attribute, text
     *
     * @source http://stackoverflow.com/a/384380/571230
     *
     * @param  {anything} o
     * @return {boolean}
     */
    function isNode(o){
        return (
            typeof Node === "object" ? o instanceof Node :
            o && typeof o === "object" && typeof o.nodeType === "number" &&
            typeof o.nodeName==="string"
        );
    }

    /**
     * Checks if passed value is a DOM elmeent, e.g. DIV, P, A and so on
     *
     * @source http://stackoverflow.com/a/384380/571230
     *
     * @param  {anything} o
     * @return {boolean}
     */
    function isElement(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 &&
            typeof o.nodeName==="string"
        );
    }

    return {
        removeByIndex: removeByIndex,
        isNode: isNode,
        isElement: isElement,
        uuid: uuid
    };
})();
