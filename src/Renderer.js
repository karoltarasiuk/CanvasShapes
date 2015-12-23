/*global _, CanvasShapes*/

/**
 * The main class of a library. Everything starts from here, and it should be
 * the first instance you create. Also it should be the only instance you render
 * per page. It's not a singleton, as you can have multiple prepared renderers
 * and switch between them.
 */
CanvasShapes.Renderer = (function () {

    var Renderer = function () {
        this.setUUID();
        RENDERERS.push(this);
        this.scenes = {};
    };

    CanvasShapes.Class.extend(
        Renderer.prototype,
        CanvasShapes.JSONInterface.prototype,
    {

        className: 'CanvasShapes.Renderer',

        /**
         * Hashmap of added scenes. Keys are UUIDs.
         *
         * @type {object}
         */
        scenes: null,

        /**
         * Add scene to the renderer. It can be passed as a ready to use scene
         * or scene configuration object.
         *
         * [WARNING] You shouldn't add the same scene to multiple renderers, as
         * it may create significant performance drop and unexpected results, as
         * scene will be processed more than once, being physically bound to the
         * same DOM element.
         *
         * @param {[CanvasShapes.SceneInterface, Object]} scene
         * @return {CanvasShapes.SceneInterface}
         */
        addScene: function (scene) {

            if (_.isObject(scene) && _.isFunction(scene.is)) {
                if (!scene.is(CanvasShapes.SceneInterface)) {
                    throw new CanvasShapes.Error(1023);
                }
            } else {
                scene = new CanvasShapes.Scene(scene);
            }

            this.scenes[scene.getUUID()] = scene;

            return scene;
        },

        /**
         * It removes scene from a renderer. `scene` can be passed as an object
         * or UUID. If `destroy` is passed as `true` it will also empty the DOM
         * element.
         *
         * @param  {[string,object]} scene
         * @param  {boolean}         destroy
         */
        removeScene: function (scene, destroy) {

            var i;

            for (i in this.scenes) {
                if (i === scene || this.scenes[i] === scene) {
                    if (destroy === true) {
                        this.scenes[i].dom.innerHTML = '';
                    }
                    delete this.scenes[i];
                    break;
                }
            }
        },

        /**
         * Removes all the scenes from a renderer. If `destroy` is passed as
         * `true` it will also empty the DOM element.
         *
         * @param  {boolen} destroy
         */
        removeScenes: function (destroy) {

            var i;

            for (i in this.scenes) {
                this.removeScene(i, destroy);
            }
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

            var i, j, layerInstance;

            if (layer && layer !== 'new') {
                throw new CanvasShapes.Error(1053);
            }

            for (i in this.scenes) {
                for (j = 0; j < shapes.length; j++) {
                    if (layer === 'new') {
                        if (layerInstance) {
                            this.scenes[i].addShape(shapes[j], layerInstance);
                        } else {
                            layerInstance = this.scenes[i].newLayer(shapes[j]);
                        }
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

            for (i in this.scenes) {
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

            for (i in this.scenes) {
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

            for (i in this.scenes) {
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

            for (i in this.scenes) {
                this.scenes[i].dispatch.apply(this.scenes[i], arguments);
            }
        },

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        toJSON: function (toString) {

            var i,
                registry = CanvasShapes.Class.getObjects(),
                registryJSON = {},
                obj = {
                    metadata: {
                        className: this.className,
                        UUID: this.getUUID()
                    },
                    data: {
                        scenes: []
                    }
                };

            for (i in registry) {
                if (
                    _.isObject(registry[i]) &&
                    _.isFunction(registry[i].toJSON) &&
                    _.isFunction(registry[i].is) &&
                    !registry[i].is(CanvasShapes.Renderer)
                ) {
                    registryJSON[i] = registry[i].toJSON();
                }
            }

            obj.data.registry = registryJSON;

            for (i in this.scenes) {
                obj.data.scenes.push(i);
            }

            if (toString === true) {
                obj = JSON.stringify(obj);
            }

            return obj;
        },

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        fromJSON: function (obj) {

            var i, renderer,
                registry = {};

            if (_.isString(obj)) {
                obj = JSON.parse(obj);
            }

            if (
                !_.isObject(obj.metadata) || !_.isObject(obj.data) ||
                !_.isString(obj.metadata.className) ||
                !_.isString(obj.metadata.UUID) ||
                !_.isObject(obj.data.registry) ||
                !_.isArray(obj.data.scenes)
            ) {
                throw new CanvasShapes.Error(1071);
            }

            for (i in obj.data.registry) {
                if (
                    _.isObject(obj.data.registry[i]) &&
                    _.isObject(obj.data.registry[i].metadata) &&
                    obj.data.registry[i].metadata.className !==
                        'CanvasShapes.Renderer'
                ) {
                    registry[i] = CanvasShapes.Class.fromJSON(
                        obj.data.registry[i]
                    );
                }
            }

            renderer = new CanvasShapes.Renderer();

            for (i = 0; i < obj.data.scenes.length; i++) {
                console.log(i, obj.data.scenes[i], registry);
                renderer.addScene(registry[obj.data.scenes[i]]);
            }

            return renderer;
        }
    });

    /* STATIC CONTEXT */

    var RENDERERS = [],
        RUNNING = false,
        FPS = 0,
        FRAMES_DATA = [],
        FRAMES_LIMIT = 100,
        MIN_FRAMES = 2;

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

    Renderer.start = function () {
        RUNNING = true;
        FPS = 0;
        FRAMES_DATA = [];
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
