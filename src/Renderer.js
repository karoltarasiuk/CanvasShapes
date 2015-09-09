/*global _, CanvasShapes*/

/**
 * The main class of a library. Everything starts from here, and it should be
 * the first instance you create. Also it should be the only instance you render
 * per page. It's not a singleton, as you can have multiple prepared renderers
 * and switch between them.
 */
CanvasShapes.Renderer = (function () {

    var Renderer = function () {
        Renderer.RENDERERS.push(this);
        this.scenes = [];
    };

    CanvasShapes.Class.extend(Renderer.prototype, {

        className: 'CanvasShapes.Renderer',

        /**
         * Array of added scenes
         *
         * @type {array}
         */
        scenes: null,

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
        },

        /**
         * @see {CanvasShapes.InteractionInterface}
         *
         * It will invoke `on()` method on every scene.
         */
        on: function (eventType, handler, context) {

            var i;

            for (i = 0; i < this.scenes.length; i++) {
                this.scenes[i].on.apply(this.scenes[i], arguments);
            }
        },

        /**
         * @see {CanvasShapes.InteractionInterface}
         *
         * It will invoke `off()` method on every scene.
         */
        off: function (handlerOrType, eventTypeOrContext, context) {

            var i;

            for (i = 0; i < this.scenes.length; i++) {
                this.scenes[i].off.apply(this.scenes[i], arguments);
            }
        },

        /**
         * @see {CanvasShapes.InteractionInterface}
         *
         * It will invoke `dispatch()` method on every scene.
         */
        dispatch: function (event, context) {

            var i;

            for (i = 0; i < this.scenes.length; i++) {
                this.scenes[i].dispatch.apply(this.scenes[i], arguments);
            }
        }
    });

    Renderer.RENDERERS = [];
    Renderer.RUNNING = false;

    function getAnimationFrame() {

        window.requestAnimationFrame(function () {

            var i;

            if (!Renderer.RUNNING) {
                return;
            }

            for (i = 0; i < Renderer.RENDERERS.length; i++) {
                Renderer.RENDERERS[i].render();
            }

            getAnimationFrame();
        });
    }

    Renderer.start = function () {
        Renderer.RUNNING = true;
        getAnimationFrame();
    };

    Renderer.stop = function () {
        Renderer.RUNNING = false;
    };

    return Renderer;
}());
