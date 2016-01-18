/*global CanvasShapes*/

CanvasShapes.Renderer = (function () {

    /**
     * Renderer is your manager of a drawing or animation.
     *
     * Remember that if you
     * need multiple versions of the same thing, you better create few scenes
     * within one renderer. Each scene can have own settings, but will render
     * exactly the same shapes (when added through renderer).
     *
     * If you create 2 completely different drawings or animations, you should
     * create a separate renderer for each.
     */
    var Renderer = function () {
        RENDERERS.push(this);
        this._scenes = [];
    };

    CanvasShapes.Class.extend(Renderer.prototype, {

        _className: 'CanvasShapes.Renderer',

        /**
         * Add scene to the renderer. It can be passed as a ready to use scene
         * or scene configuration object.
         *
         * @throws {CanvasShapes.Error} 1023
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

            this._scenes.push(scene);

            return scene;
        },

        /**
         * Adds all the shapes passed in arguments to all the scenes.
         *
         * You can also specify that any of those shapes must be rendered on a
         * separate and new layer. To do so pass a string `"new"` as a second
         * arugment. Any other value of it will raise an exception.
         *
         * @throws {CanvasShapes.Error} 1053
         *
         * @param {array} shapes
         * @param {string} layer [OPTIONAL]
         */
        addShapes: function (shapes, layer) {

            var i, j, layerInstance;

            if (layer && layer !== 'new') {
                throw new CanvasShapes.Error(1053);
            }

            for (i = 0; i < this._scenes.length; i++) {
                for (j = 0; j < shapes.length; j++) {
                    if (layer === 'new') {
                        if (layerInstance) {
                            this._scenes[i].addShape(shapes[j], layerInstance);
                        } else {
                            layerInstance = this._scenes[i].newLayer(shapes[j]);
                        }
                    } else {
                        this._scenes[i].addShape(shapes[j]);
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

            for (i = 0; i < this._scenes.length; i++) {
                this._scenes[i].render();
            }
        },

        /**
         * @see {CanvasShapes.InteractionInterface}
         *
         * It will invoke `on()` method on every scene.
         */
        on: function (eventType, handler, context) {

            var i;

            for (i = 0; i < this._scenes.length; i++) {
                this._scenes[i].on.apply(this._scenes[i], arguments);
            }
        },

        /**
         * @see {CanvasShapes.InteractionInterface}
         *
         * It will invoke `off()` method on every scene.
         */
        off: function (handlerOrType, eventTypeOrContext, context) {

            var i;

            for (i = 0; i < this._scenes.length; i++) {
                this._scenes[i].off.apply(this._scenes[i], arguments);
            }
        },

        /**
         * @see {CanvasShapes.InteractionInterface}
         *
         * It will invoke `dispatch()` method on every scene.
         */
        dispatch: function (event, context) {

            var i;

            for (i = 0; i < this._scenes.length; i++) {
                this._scenes[i].dispatch.apply(this._scenes[i], arguments);
            }
        }
    });

    /* STATIC CONTEXT */

    var RENDERERS = [],
        RUNNING = false,
        FPS = 0,
        FRAMES_DATA = [],
        FRAMES_LIMIT = 100,
        MIN_FRAMES = 2;

    /**
     * It's currently only a wrapper for `window.requestAnimationFrame`. It
     * creates a callback function which takes care of running all the renderers
     * or stopping them if requested.
     *
     * The callback works recursively - at the end of execution it calls a
     * function again.
     */
    function getAnimationFrame() {

        window.requestAnimationFrame(function () {

            var i, time;

            if (!RUNNING) {
                return;
            }

            for (i = 0; i < RENDERERS.length; i++) {
                RENDERERS[i].render();
            }

            FRAMES_DATA.push((new Date()).getTime() / 1000);
            if (FRAMES_DATA.length > FRAMES_LIMIT) {
                FRAMES_DATA.shift();
            }

            if (FRAMES_DATA.length > MIN_FRAMES) {
                time = FRAMES_DATA[FRAMES_DATA.length - 1] - FRAMES_DATA[0];
                FPS = Math.floor(FRAMES_DATA.length / time);
            }

            getAnimationFrame();
        });
    }

    /**
     * Starts running renderers, by listening to the
     * `window.requestAnimationFrame` method. Only useful when craeting an
     * animation. Static drawings won't need it.
     *
     * You should run this when all renderers are prepared and ready. To add a
     * new renderer please first use `Renderer.stop`, and then start again, when
     * all is prepared.
     */
    Renderer.start = function () {
        RUNNING = true;
        FPS = 0;
        FRAMES_DATA = [];
        getAnimationFrame();
    };

    /**
     * Stops running renderers.
     */
    Renderer.stop = function () {
        RUNNING = false;
    };

    /**
     * Allows you to check your current frames-per-second number.
     *
     * It evaluates it based on every currently running renderer. There is no
     * way to check it per each renderer, as all of them are based on the same
     * `window.requestAnimationFrame` method.
     *
     * @return {integer}
     */
    Renderer.getFPS = function () {

        if (!RUNNING) {
            return 0;
        }

        return FPS;
    };

    return Renderer;
}());
