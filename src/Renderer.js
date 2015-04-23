/*global _, CanvasShapes*/

CanvasShapes.Renderer = (function () {

    var Renderer = function () {};

    CanvasShapes.Class.extend(Renderer.prototype, {

        className: 'CanvasShapes.Renderer',

        scenes: [],

        /**
         * Add scene to the renderer. It can be passed as a ready to use scene
         * or scene configuration object.
         *
         * @param {[CanvasShapes.Scene, Object]} scene
         */
        addScene: function (scene) {

            if (scene instanceof CanvasShapes.Scene) {
                this.scenes.push(scene);
            } else {
                this.scenes.push(new CanvasShapes.Scene(scene));
            }
        },

        /**
         * Start rendering of objects. This method simply invokes corresponding
         * render method in CanvasShapes.Scene objects passing all the arguments
         */
        render: function () {

            var i;

            for (i = 0; i < this.scenes.length; i++) {
                this.scenes[i].render.apply(this.scenes[i], arguments);
            }
        }
    });

    return Renderer;
}());
