/*global _, CanvasShapes*/

CanvasShapes.RenderingInterface = (function () {

    var RenderingInterface = function () {
        throw new CanvasShapes.Error(8009);
    };

    CanvasShapes.Class.extend(RenderingInterface.prototype, {

        className: 'CanvasShapes.RenderingInterface',

        /**
         * Allows parent to run rendering of a shape on previously defined layer.
         */
        render: function () {
            throw new CanvasShapes.Error(9001);
        },

        /**
         * Sets a handler which can allow a shape to obtain new layer just for
         * itself. Useful when a shape is complex, and needs redrawing separately.
         * Parent should always call this method BEFORE `render()`.
         *
         * @param {function} newLayerHandler
         */
        setNewLayerHandler: function (newLayerHandler) {
            throw new CanvasShapes.Error(9003);
        },

        /**
         * Allows a parent to set a layer on which shape will be rendered.
         * Parent should always call this method BEFORE `render()`.
         *
         * @param {CanvasShapes.SceneLayer} layer
         */
        setLayer: function (layer) {
            throw new CanvasShapes.Error(9004);
        },

        /**
         * Allows to get a reference to the layer object is on.
         *
         * @return {CanvasShapes.SceneLayer}
         */
        getLayer: function () {
            throw new CanvasShapes.Error(9016);
        },

        /**
         * Allows you to check whether object has scene
         *
         * @return {boolean}
         */
        hasScene: function () {
            throw new CanvasShapes.Error(9031);
        },

        /**
         * Allows to get a reference to the scene object is in.
         *
         * @return {CanvasShapes.Scene}
         */
        getScene: function () {
            throw new CanvasShapes.Error(9016);
        },

        /**
         * Allows you to assign the style to a rendering shape. If `deep` is
         * `true`, the style will be applied to the children shapes as well.
         *
         * @param {CanvasShapes.StyleInterface} style
         * @param {boolean} deep
         */
        setStyle: function (style, deep) {
            throw new CanvasShapes.Error(9029);
        },

        /**
         * Returns currently assigned style object.
         *
         * @return {CanvasShapes.StyleInterface}
         */
        getStyle: function () {
            throw new CanvasShapes.Error(9030);
        },

        /**
         * Allows parent to obtain an information whether shape needs its own
         * separate layer. The method will return total number of needed layers.
         * In the case of a group it will iterate through all the members.
         *
         * @return {integer}
         */
        numberOfSeparateLayersNeeded: function () {
            throw new CanvasShapes.Error(9005);
        }
    });

    return RenderingInterface;
}());
