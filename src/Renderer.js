/*global _, CanvasShapes*/

/**
 * The main class of a library. Everything starts from here, and it should be
 * the first instance you create. Also it should be the only instance you render
 * per page. It's not a singleton, as you can have multiple prepared renderers
 * and switch between them.
 */
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
        },

        /**
         * Attaches an event handler to all the scenes.
         *
         * The handler should be ready to accept 1 argument which is
         * `CanvasShapes.Event` object.
         *
         * Returns boolean with the result of attaching. If returns false if it
         * fails for any scene.
         *
         * @param  {string}   eventType
         * @param  {function} handler
         * @param  {object}   context
         *
         * @return {boolean}
         */
        on: function (eventName, handler, context) {

            var i,
                ret = true;

            if (!CanvasShapes.Event.eventTypeExists(eventType)) return false;

            for (i = 0; i < this.scenes.length; i++) {
                ret = ret && this.scenes[i].on.apply(this.scenes[i], arguments);
            }

            return ret;
        },

        /**
         * Allows you to detach the event handler from all the scenes.
         *
         * When `handlerOrType` is a string it will detach all the handlers,
         * matching passed type.
         *
         * If it's a function, it will detach only the same handler (comparison
         * operator here is `===`). If the second argument is passed, it will
         * remove only the handler of the specified type.
         *
         * It will return number of detached handlers.
         *
         * @param {[string,function]} handlerOrType
         * @param {string}            eventType [OPTIONAL]
         *
         * @return {integer}
         */
        off: function (handlerOrType, eventType) {

            var i,
                temp = 0;

            for (i = 0; i < this.scenes.length; i++) {
                temp += this.scenes[i].off.apply(this.scenes[i], arguments);
            }

            return temp;
        }
    });

    return Renderer;
}());
