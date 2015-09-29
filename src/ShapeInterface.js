/*global _, CanvasShapes*/

CanvasShapes.ShapeInterface = (function () {

    var ShapeInterface = function () {
        throw new CanvasShapes.Error(8015);
    };

    CanvasShapes.Class.extend(ShapeInterface.prototype, {

        className: 'CanvasShapes.ShapeInterface',

        /**
         * If shape is being part of a group, we need to set its parent, so it
         * knows how to render itself.
         *
         * @param {CanvasShapes.GroupInterface} group
         */
        setParent: function (group) {
            throw new CanvasShapes.Error(9054);
        },

        /**
         * Allows you to get the parent of a shape. It will return 'undefined'
         * if shape doesn't have a parent.
         *
         * @return {CanvasShapes.GroupInterface}
         */
        getParent: function () {
            throw new CanvasShapes.Error(9055);
        },

        /**
         * Allows you to get the rendering shape of a shape. There are two
         * scenarios: it's a standalone shape and then `this` will be returned,
         * or the shape is a part of a group, or nested structure of groups, and
         * then it will look for the top-most shape/group associated with a
         * layer.
         *
         * @return {CanvasShapes.RenderingInterface}
         */
        getRenderingShape: function () {
            throw new CanvasShapes.Error(9056);
        }
    });

    return ShapeInterface;
}());
