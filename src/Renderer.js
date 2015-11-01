/*global _, CanvasShapes*/

/**
 * The main class of a library. Everything starts from here, and it should be
 * the first instance you create. Also it should be the only instance you render
 * per page. It's not a singleton, as you can have multiple prepared renderers
 * and switch between them.
 */
CanvasShapes.Renderer = (function () {

    var Renderer = function () {
        RENDERERS.push(this);
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
         *
         * You can also specify that any of those shapes must be rendered on a
         * separate and new layer. To do so pass a string `"new"` as a second
         * arugment. Any other value of it will raise an exception.
         *
         * @param {array} shapes
         * @param {string} layer [OPTIONAL]
         */
        addShapes: function (shapes, layer) {

            var i, j;

            if (layer && layer !== 'new') {
                throw new CanvasShapes.Error(1053);
            }

            for (i = 0; i < this.scenes.length; i++) {
                for (j = 0; j < shapes.length; j++) {
                    if (layer === 'new') {
                        this.scenes[i].newLayer(shapes[j]);
                    } else {
                        this.scenes[i].addShape(shapes[j]);
                    }
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
                this.scenes[i].render();
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

    /* STATIC CONTEXT */

    var RENDERERS = [];
    var RUNNING = false;
    var FPS = 0;
    var FRAMES = 0;
    var START_TIME = null;

    function getAnimationFrame() {

        window.requestAnimationFrame(function () {

            var i, time;

            if (!RUNNING) {
                return;
            }

            for (i = 0; i < RENDERERS.length; i++) {
                RENDERERS[i].render();
            }

            FRAMES++;
            time = ((new Date()).getTime() - START_TIME) / 1000;
            FPS = Math.floor(FRAMES / time);

            getAnimationFrame();
        });
    }

    Renderer.start = function () {
        RUNNING = true;
        FPS = 0;
        FRAMES = 0;
        START_TIME = (new Date()).getTime();
        getAnimationFrame();
    };

    Renderer.stop = function () {
        RUNNING = false;
    };

    Renderer.getFPS = function () {

        if (!RUNNING) {
            return 0;
        }

        return FPS;
    };

    return Renderer;
}());
