/*global _, CanvasShapes, JSONChecker*/

CanvasShapes.SceneInterface = (function () {

    var SceneInterface = function () {
        throw new CanvasShapes.Error(8008);
    };

    CanvasShapes.Class.extend(SceneInterface.prototype, {

        className: 'CanvasShapes.SceneInterface',

        /**
         * Initializes event listeners. Call ONLY when `this.dom` is ready!
         */
        initializeListeners: function () {
            throw new CanvasShapes.Error(9041);
        },

        /**
         * Renders all the layers, on which there are shapes which requested
         * rendering.
         *
         * If the `shape` is passed it will re-render only the layer associated
         * with this shape. Due to canvas element implementation it's not
         * possible to re-render one shape only. Also it will re-render this
         * `shape` immediately no matter whether it has requested rendering or
         * not. It will also keep it on the list of shapes which requested
         * rendering.
         *
         * [WARNING] Due to performance reasons, this method doesn't perform any
         * type checking when trying to render. It assuems all the passed
         * arguments are of the correct type.
         *
         * @param {CanvasShapes.RenderingInterface} shape
         */
        render: function (shape) {
            throw new CanvasShapes.Error(9018);
        },

        /**
         * Creates new layer on the scene. `width`, `height`, `left` and `top`,
         * parameters will be passed to CanvasShapes.SceneLayer constructor.
         *
         * `shape` parameter if passed, allows you to add shape automatically
         * to the scene with associated newly created layer. You need to be
         * careful though, as the shape can be a child of a group, and adding
         * it as a standalone shape to the scene will cause it to render twice,
         * and in some cases can cause infinite loop which will raise an error.
         *
         * Best practice to obtain a separate layer for a shape being a child of
         * a group, is to call this method without passing a `shape` parameter,
         * which will create a layer and register it on a scene, but shape will
         * not be rendered as a standalone object.
         *
         * @param {CanvasShapes.ShapeInterface} shape [OPTIONAL]
         * @param {integer} width   [OPTIONAL]
         * @param {integer} height  [OPTIONAL]
         * @param {integer} left    [OPTIONAL]
         * @param {integer} top     [OPTIONAL]
         *
         * @return {CanvasShapes.SceneLayerInterface}
         */
        newLayer: function (shape, width, height, left, top) {
            throw new CanvasShapes.Error(9019);
        },

        /**
         * Allows you to retrieve a layer specific for a shape or layer.
         * If `shapeOrLayer` is null it will return default layer for a scene.
         * getLayer called without any arguments should ALWAYS return a
         * layer. By passing a layer you can establish whether the layer is
         * already a part of a scene - it will return `null` if it's not.
         *
         * @param {[
         *     CanvasShapes.ShapeInterface,
         *     CanvasShapes.SceneLayerInterface
         * ]} shapeOrLayer [OPTIONAL]
         * @return {CanvasShapes.SceneLayerInterface}
         */
        getLayer: function (shapeOrLayer) {
            throw new CanvasShapes.Error(9019);
        },

        /**
         * This method should only be used after the shape is already added
         * through CanvasShapes.Renderer instance. Adding shapes only to the
         * scene is not advised because it's not being registered in Renderer
         * and therefore cannot be controlled and rendered from there.
         *
         * Allows you to add a shape with its corresponding layer to the scene.
         * It's very useful when within one scene you want to have a different
         * configuration of layers than in a second scene of the same renderer.
         *
         * You need to be careful, as the shape can be a child of a group, and
         * adding it as a standalone shape to the scene will cause it to render
         * twice, and in some cases can cause infinite loop which will raise an
         * error eventually (after stack exceeds).
         *
         * @param {CanvasShapes.SceneLayerInterface} layer
         * @param {CanvasShapes.ShapeInterface} shape [OPTIONAL]
         *
         * @return {CanvasShapes.SceneLayerInterface}
         */
        addShape: function (layer, shape) {
            throw new CanvasShapes.Error(9019);
        },

        /**
         * Method allowing the shape to request the layer shape is on, to be
         * re-rendered. It will be rendered when the next animation frame is
         * requested. If the same shape is added twice, it will override the
         * previous entry.
         *
         * If `context` is passed it will will use it when executing callback.
         * If not the `shape` will be used as a context.
         *
         * [WARNING] Due to performance reasons, this method doesn't perform any
         * type checking. It assuems all the passed arguments are of the correct
         * type. It does though check whether shape is associated with a layer.
         *
         * @param {CanvasShapes.Shape}               shape
         * @param {function}                         callback [OPTIONAL]
         * @param {object}                           context  [OPTIONAL]
         */
        requestRendering: function (shape, callback, context) {
            throw new CanvasShapes.Error(9048);
        },

        /**
         * Gets handlers which can allow a shape to obtain some functionality
         * from a scene. Current implementation includes following handlers:
         *
         * - newLayerHandler
         * - getLayerHandler
         * - addShapeHandler
         * - requestRendering
         * - on
         * - off
         * - dispatch
         *
         * @return {object}
         */
        getSceneInterfaceHandlers: function () {
            throw new CanvasShapes.Error(9034);
        },

        /**
         * Returns width of the scene.
         *
         * @return {integer}
         */
        getWidth: function () {
            throw new CanvasShapes.Error(9020);
        },

        /**
         * Returns height of the scene.
         *
         * @return {integer}
         */
        getHeight: function () {
            throw new CanvasShapes.Error(9021);
        },

        /**
         * Returns HTML container for this scene.
         *
         * @return {object}
         */
        getDom: function () {
            throw new CanvasShapes.Error(9022);
        },

        /**
         * Attaches an event handler to the scene. It prevents you from adding
         * the same handler for the second time.
         *
         * The handler should be ready to accept 1 argument which is
         * `CanvasShapes.EventAbstract` object.
         *
         * Returns boolean with the result of attaching.
         *
         * @param  {string}   eventType
         * @param  {function} handler
         * @param  {object}   context
         *
         * @return {boolean}
         */
        on: function (eventType, handler, context) {
            throw new CanvasShapes.Error(9038);
        },

        /**
         * Allows you to detach the event handler from the scene.
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
            throw new CanvasShapes.Error(9039);
        },

        /**
         * Its job is to trigger all the handlers attached using `on()` method
         * of the passed `type`. `type` attribute must exist within passed
         * `event` argument, or `event` must be a `string` containing a type.
         *
         * It also possible (and very handy for custom events) to pass ready to
         * use CanvasShapes.EventAbstract object. This way any event can be
         * triggered.
         *
         * @param {[Event,object,string,CanvasShapes.EventAbstract]}  event
         */
        dispatch: function (event) {
            throw new CanvasShapes.Error(9040);
        }
    });

    return SceneInterface;
}());
