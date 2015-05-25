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
         * @param {[CanvasShapes.SceneInterface, Object]} scene
         * @return {CanvasShapes.SceneInterface}
         */
        addScene: function (scene) {

            if (scene && scene.is) {
                if (!scene.is(CanvasShapes.SceneInterface)) {
                    throw new CanvasShapes.Error(1023);
                }
            } else {
                scene = new CanvasShapes.Scene(scene);
            }

            this.scenes.push(scene);

            return scene;
        },

        /**
         * Adds all the shapes passed in arguments to all the scenes.
         */
        addShapes: function (shapes) {

            var i, j;

            for (i = 0; i < this.scenes.length; i++) {
                for (j = 0; j < shapes.length; j++) {
                    this.scenes[i].addShape(shapes[j]);
                }
            }
        },

        /**
         * Start rendering of objects. This method simply invokes corresponding
         * render method in CanvasShapes.Scene objects.
         */
        render: function () {

            var i;

            for (i = 0; i < this.scenes.length; i++) {
                this.scenes[i].render.apply(this.scenes[i]);
            }
        }
    });

    return Renderer;
}());
