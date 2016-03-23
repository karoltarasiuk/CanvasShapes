/*global CanvasShapes*/

CanvasShapes.Error = (function () {

    var errors, ErrorClass;

    errors = {
        1001: 'CanvasShapes.Scene - provided config is invalid',
        1002: 'CanvasShapes.Rendering - no arguments passed to `render()`',
        1003: 'CanvasShapes.Point - in `constructor`: coordinates must be passed as an array with min 2 values',
        1004: 'CanvasShapes.SceneLayer - in `constructor`: canvas.getContext() method is not available',
        1005: 'CanvasShapes.Scene - existing dom element must be specified in scene configuration',
        1006: 'CanvasShapes.Scene - nothing to render - no arguments passed',
        1007: "CanvasShapes.SceneLayer - in `constructor`: passed `dom` doesn't exist",
        1008: "CanvasShapes.Point - in `setFace()`: provided face doesn't exist",
        1009: "CanvasShapes.Class - in `is()`: `passedClass` is not a string and doesn't have `className` property",
        1010: "CanvasShapes.GroupAbstract - in `add()`: all shapes must implement CanvasShapes.ShapeInterface",
        1011: "CanvasShapes.CoordinatesAbstract - in `validateCoordinates()` or `validateCoordinatesArray()`: passed coordinates are not valid",
        1012: "CanvasShapes.Scene - this object doesn't implement CanvasShapes.RenderingInterface and can't be rendered",
        1013: "CanvasShapes.Rectangle or CanvasShapes.Square - passed coordinates are not creating 90 degrees angle",
        1014: "CanvasShapes.Square - passed coordinates are not creating 90 degrees angle",
        1015: "CanvasShapes.Square - passed coordinates are not creating a square",
        1016: "CanvasShapes.SceneLayerAbstract - context mandatory but missing",
        1017: "CanvasShapes.SceneLayerAbstract - scene mandatory but missing",
        1018: "CanvasShapes.RenderingAbstract - layer mandatory but missing",
        1019: "CanvasShapes.SceneAbstract - in `newLayer()`: shape is not an instance of CanvasShapes.ShapeInterface",
        1020: "CanvasShapes.SceneAbstract - in `addShape()`: shape is not an instance of CanvasShapes.ShapeInterface",
        1021: "CanvasShapes.SceneAbstract - in `getLayerObject()`: shape is not an instance of CanvasShapes.ShapeInterface",
        1022: "CanvasShapes.SceneAbstract - in `addShape()`: layer is not an instance of CanvasShapes.SceneLayerInterface",
        1023: 'CanvasShapes.Renderer - in `addScene()`: scene is not an instance of CanvasShapes.SceneInterface',
        1024: "CanvasShapes.Arc - in `constructor`: coordinates array is required",
        1025: "CanvasShapes.Arc - in `constructor`: radius is required",
        1026: "CanvasShapes.Point - in `setFace()`: provided face is not valid",
        1027: "CanvasShapes.SceneAbstract - in `initialiseListeners()`: `this.dom` doesn't exist",
        1028: "CanvasShapes.Event.deregisterCategory - passed category is not a string",
        1029: "CanvasShapes.Event.deregisterCategory - passed category doesn't exist",
        1030: "CanvasShapes.Event.registerCategory - passed category is not a string",
        1031: "CanvasShapes.Event.registerCategory - passed category does exist - use CanvasShapes.Event.deregisterCategory to deregister first",
        1032: "CanvasShapes.Event.registerCategory - passed baseClass is not a function",
        1033: "CanvasShapes.Event.registerCategory - passed eventsObject is not an object",
        1034: "CanvasShapes.Event.registerCategory - passed initialiseListeners is not a function",
        1035: "CanvasShapes.EventAbstract - in `initialise()`: invalid format of `event` argument passed",
        1036: "CanvasShapes.Shape - in `constructor`: wrong format of arguments passed",
        1037: "CanvasShapes.ShapeAbstract - in `isColliding()`: passed `mouseCoordinates` is not in valid format",
        1038: "CanvasShapes.Event.initialiseListeners - passed arugment is not an instance of CanvasShapes.SceneInterface",
        1039: "CanvasShapes.EventAbstract - in `initialise()`: `target` is not a DOM element",
        1040: "CanvasShapes.Event.getCategory - passed `event` is in invalid format",
        1041: "CanvasShapes.Event.Mouse - in `initialise()`: invalid format of `event` argument passed",
        1042: "CanvasShapes.ShapeAbstract - in `on()`, `off()` or `dispatch()`: shape is not added to a scene yet",
        1043: "CanvasShapes.AnimationFrame - in `constructor`: invalid format of arguments passed",
        1044: "CanvasShapes.SceneAbstract - in `requestRendering()`: shape is not on the layer",
        1045: "CanvasShapes.AnimationAbstract - in `animate()`: invalid format of arguments passed",
        1046: "CanvasShapes.ShapeAbstract - in `setParent()`: invalid format of arguments passed",
        1047: "CanvasShapes.CoordinatesAbstract - in `translateOffsetToCoordinates()`: invalid format of arguments passed",
        1048: "CanvasShapes.StyleAbstract - in `setDefinition()`: invalid format of arguments passed",
        1049: "CanvasShapes.CoordinatesAbstract - in `translateCoordinates()`: invalid format of arguments passed",
        1050: "CanvasShapes.StyleAbstract - in `animate()`: invalid format of arguments passed",
        1051: "CanvasShapes.StyleAbstract - in `getDefinition()`: invalid format of arguments passed",
        1052: "CanvasShapes.StyleAbstract - in `addToShape()`: invalid format of arguments passed",
        1053: "CanvasShapes.Renderer - in `addShapes()`: invalid format of arguments passed",
        1054: "CanvasShapes.SceneLayerAbstract - canvas mandatory but missing",
        1055: "CanvasShapes.SceneLayer - in `initialise()`: invalid format of arguments passed",
        1056: "CanvasShapes.EventAbstract - in `initialise()`: `scene` is not an instance of CanvasShapes.SceneInterface",
        1057: "CanvasShapes.ShapeAbstract - in `setIsCollidingRatio()`: `isCollidingRatio` should be boolean",
        1058: "CanvasShapes.Polygon - in `isColliding()`: passed `mouseCoordinates` is not in valid format",
        1059: "CanvasShapes.Line - in `isColliding()`: passed `mouseCoordinates` is not in valid format",
        1060: "CanvasShapes.Tools - in `bernstein(): `index` can't be less than 0, `degree` can't be less than 0, and `t` can't be less than 0 and bigger than 1",
        1061: "CanvasShapes.Class - in `setUUID()`: passed `UUID` is not valid",
        1062: "CanvasShapes.Class - in `setObject()`: passed arguments are not valid",
        1063: "CanvasShapes.Class - in `getObject()`: passed `UUID` is not valid",
        1064: "CanvasShapes.Class - in `swapUUID()`: passed parameters are not valid",
        1065: "CanvasShapes.Class - in `removeObject()`: passed parameters are not valid",
        1066: "CanvasShapes.Class - in `getClass()`: passed `className` is not a string",
        1067: "CanvasShapes.Class - in `extend()`: passed arguments are invalid",
        1068: "CanvasShapes.Event.Mouse - dom is not ready while registering category",
        1069: "CanvasShapes.Tools - in `binomialCoefficient(): `index` and `degree` can't be less than 0, and `index` can't be bigger than `degree`",
        1070: "CanvasShapes.BezierCurve - in `isColliding()`: passed `mouseCoordinates` is not in valid format",
        1071: "CanvasShapes.Relation - in `_generateRenderingPoints()`: `func` returned value is not an array of floats with always the same number of values",
        1072: "CanvasShapes.Relation - in `constructor`: `func` is not a function",
        1073: "CanvasShapes.CacheAbstract - in `setCache()` or `getCache()`: passed `varname` is not string",
        1074: "CanvasShapes.AnimationFrameAbstract - in `setBeforeRender()`: passed `beforeRender` is not a function or `undefined`",
        // Not allowed instantiation errors
        8001: "CanvasShapes.RenderingAbstract - can't instantiate abstract",
        8002: "CanvasShapes.StyleAbstract - can't instantiate abstract",
        8003: "CanvasShapes.ShapeAbstract - can't instantiate abstract",
        8004: "CanvasShapes.CoordinatesAbstract - can't instantiate abstract",
        8005: "CanvasShapes.ClassAbstract - can't instantiate abstract",
        8006: "CanvasShapes.GroupAbstract - can't instantiate abstract",
        8007: "CanvasShapes.SceneAbstract - can't instantiate abstract",
        8008: "CanvasShapes.SceneInterface - can't instantiate interface",
        8009: "CanvasShapes.RenderingInterface - can't instantiate interface",
        8010: "CanvasShapes.InteractionInterface - can't instantiate interface",
        8011: "CanvasShapes.GroupInterface - can't instantiate interface",
        8012: "CanvasShapes.CoordinatesInterface - can't instantiate interface",
        8013: "CanvasShapes.ClassInterface - can't instantiate interface",
        8014: "CanvasShapes.StyleInterface - can't instantiate interface",
        8015: "CanvasShapes.ShapeInterface - can't instantiate interface",
        8016: "CanvasShapes.SceneLayerInterface - can't instantiate interface",
        8017: "CanvasShapes.SceneLayerAbstract - can't instantiate abstract",
        8018: "CanvasShapes.InteractionAbstract - can't instantiate abstract",
        8019: "CanvasShapes.EventAbstract - can't instantiate abstract",
        8020: "CanvasShapes.EventInterface - can't instantiate interface",
        8021: "CanvasShapes.AnimationInterface - can't instantiate interface",
        8022: "CanvasShapes.AnimationAbstract - can't instantiate abstract",
        8023: "CanvasShapes.AnimationFrameInterface - can't instantiate interface",
        8024: "CanvasShapes.AnimationFrameAbstract - can't instantiate abstract",
        8025: "CanvasShapes.Shape - can't instantiate abstract",
        8026: "CanvasShapes.CacheInterface - can't instantiate interface",
        8027: "CanvasShapes.CacheAbstract - can't instantiate abstract",
        // Not implemented methods errors
        9001: 'CanvasShapes.RenderingInterface - `render()` is not implemented',
        9002: 'CanvasShapes.RenderingAbstract - `renderOnSingleLayer()` is not implemented',
        9003: 'CanvasShapes.RenderingInterface - `setSceneInterfaceHandlers()` is not implemented',
        9004: 'CanvasShapes.RenderingInterface - `setLayer()` is not implemented',
        9006: 'CanvasShapes.StyleInterface - `set()` is not implemented',
        9007: 'CanvasShapes.CoordinatesInterface - `getCoordinates()` is not implemented',
        9008: 'CanvasShapes.CoordinatesInterface - `processCoordinates()` is not implemented',
        9009: 'CanvasShapes.ClassInterface - `is()` is not implemented',
        9010: 'CanvasShapes.GroupInterface - `addShapes()` is not implemented',
        9011: 'CanvasShapes.GroupInterface - `eachShape()` is not implemented',
        9012: 'CanvasShapes.GroupInterface - `removeShapes()` is not implemented',
        9013: 'CanvasShapes.CoordinatesInterface - `validateCoordinates()` is not implemented',
        9014: 'CanvasShapes.CoordinatesInterface - `validateCoordinatesArray()` is not implemented',
        9015: 'CanvasShapes.GroupInterface - `getShapes()` is not implemented',
        9016: 'CanvasShapes.RenderingInterface - `getLayer()` is not implemented',
        9017: 'CanvasShapes.RenderingInterface - `getScene()` is not implemented',
        9018: 'CanvasShapes.SceneInterface - `render()` is not implemented',
        9019: 'CanvasShapes.SceneInterface - `newLayer()` is not implemented',
        9020: 'CanvasShapes.SceneInterface - `getWidth()` is not implemented',
        9021: 'CanvasShapes.SceneInterface - `getHeight()` is not implemented',
        9022: 'CanvasShapes.SceneInterface - `getDom()` is not implemented',
        9025: 'CanvasShapes.SceneLayerInterface - `getScene()` is not implemented',
        9026: 'CanvasShapes.SceneLayerInterface - `getContext()` is not implemented',
        9027: 'CanvasShapes.SceneLayerInterface - `getWidth()` is not implemented',
        9028: 'CanvasShapes.SceneLayerInterface - `getHeight()` is not implemented',
        9029: 'CanvasShapes.RenderingInterface - `setStyle()` is not implemented',
        9030: 'CanvasShapes.RenderingInterface - `getStyle()` is not implemented',
        9031: 'CanvasShapes.RenderingInterface - `hasScene()` is not implemented',
        9032: 'CanvasShapes.SceneInterface - `getLayer()` is not implemented',
        9033: 'CanvasShapes.SceneInterface - `setLayer()` is not implemented',
        9034: 'CanvasShapes.SceneInterface - `getSceneInterfaceHandlers()` is not implemented',
        9035: 'CanvasShapes.SceneInterface - `setRelativeRendering()` is not implemented',
        9036: 'CanvasShapes.SceneInterface - `getRelativeRendering()` is not implemented',
        9038: "CanvasShapes.SceneInterface - `on()` is not implemented",
        9039: "CanvasShapes.SceneInterface - `off()` is not implemented",
        9040: "CanvasShapes.SceneInterface - `dispatch()` is not implemented",
        9041: "CanvasShapes.SceneInterface - `initialiseListeners()` is not implemented",
        9042: "CanvasShapes.InteractionInterface - `isColliding()` is not implemented",
        9043: "CanvasShapes.InteractionInterface - `attachEvents()` is not implemented",
        9044: "CanvasShapes.EventInterface - `initialise()` is not implemented",
        9045: "CanvasShapes.EventInterface - `getType()` is not implemented",
        9046: "CanvasShapes.AnimationInterface - `move()` is not implemented",
        9047: "CanvasShapes.AnimationInterface - `animate()` is not implemented",
        9048: "CanvasShapes.SceneInterface - `requestRendering()` is not implemented",
        9049: "CanvasShapes.CoordinatesInterface - `setCoordinates()` is not implemented",
        9050: "CanvasShapes.ClassInterface - 'setUUID()` is not implemented",
        9051: "CanvasShapes.ClassInterface - 'getUUID()` is not implemented",
        9052: "CanvasShapes.AnimationFrameInterface - `next()` is not implemented",
        9053: "CanvasShapes.AnimationFrameInterface - `reset()` is not implemented",
        9054: "CanvasShapes.ShapeInterface - `setParent()` is not implemented",
        9055: "CanvasShapes.ShapeInterface - `getParent()` is not implemented",
        9056: "CanvasShapes.ShapeInterface - `getRenderingShape()` is not implemented",
        9057: "CanvasShapes.CoordinatesInterface - `translateOffsetToCoordinates()` is not implemented",
        9058: "CanvasShapes.CoordinatesInterface - `translateCoordinates()` is not implemented",
        9059: "CanvasShapes.StyleInterface - `animate()` is not implemented",
        9060: "CanvasShapes.StyleInterface - `addToShape()` is not implemented",
        9061: "CanvasShapes.AnimationFrameInterface - `getType()` is not implemented",
        9062: "CanvasShapes.SceneInterface - `shouldRenderOffScreen()` is not implemented",
        9063: "CanvasShapes.SceneLayerInterface - `getCanvas()` is not implemented",
        9064: "CanvasShapes.SceneLayerInterface - `getTop()` is not implemented",
        9065: "CanvasShapes.SceneLayerInterface - `getLeft()` is not implemented",
        9066: "CanvasShapes.ClassInterface - 'getClassName()` is not implemented",
        9067: 'CanvasShapes.CoordinatesInterface - `getCentreCoordinates()` is not implemented',
        9068: 'CanvasShapes.SceneInterface - `addShape()` is not implemented',
        9069: 'CanvasShapes.SceneLayerInterface - `clear()` is not implemented',
        9070: 'CanvasShapes.ShapeInterface - `isOnScene()` is not implemented',
        9071: 'CanvasShapes.ShapeInterface - `setIsCollidingRatio()` is not implemented',
        9072: 'CanvasShapes.ShapeInterface - `calculateAllowedError()` is not implemented',
        9073: 'CanvasShapes.RenderingInterface - `getSceneInterfaceHandlers()` is not implemented',
        9074: 'CanvasShapes.CacheInterface - `setCache()` is not implemented',
        9075: 'CanvasShapes.CacheInterface - `getCache()` is not implemented',
        9076: 'CanvasShapes.AnimationFrameInterface - `setBeforeRender()` is not implemented',
        9077: 'CanvasShapes.AnimationFrameInterface - `getBeforeRender()` is not implemented',
        9078: 'CanvasShapes.CoordinatesInterface - `areCoordinatesEqual()` is not implemented',
    };

    /**
     * Custom error class to handle all the errors within CanvasShapes library.
     * It accepts error code to be passed as an integer, or string with a
     * custom message.
     *
     * @param {[integer,string]} error
     */
    ErrorClass = function (error) {

        if (CanvasShapes._.isNumber(error)) {
            this.code = error;
            this.message = this.getMessageByCode(this.code);
        } else if (CanvasShapes._.isString(error)) {
            this.message = error;
        }
    };

    CanvasShapes.Class.extend(ErrorClass.prototype, Error.prototype, {

        _className: 'CanvasShapes.Error',

        /**
         * Error internal identifier within CanvasShapes library.
         *
         * @type {integer}
         */
        code: 0,

        /**
         * Gets message by passed code. If invalid code is provided it returns
         * empty string.
         *
         * @param  {integer} code
         * @return {string}
         */
        getMessageByCode: function (code) {

            if (CanvasShapes._.isString(errors[code])) {
                return errors[code];
            }

            return "";
        },

        /**
         * Overrides default `toString` implementation. For custom error class
         * it's important, as throwing error is relaying on `toString`.
         *
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toString
         *
         * @return {string}
         */
        toString: function() {

            var obj = Object(this),
                name = this.getClassName();

            if (obj !== this) {
                throw new TypeError();
            }

            name = (name === undefined) ? 'Error' : String(name);

            var msg = this.message;
            msg = (msg === undefined) ? '' : String(msg);

            if (name === '') {
                return msg;
            }
            if (msg === '') {
                return name;
            }

            return name + ': ' + (this.code ? this.code + ' - ' : '') + msg;
        }
    });

    return ErrorClass;
}());
