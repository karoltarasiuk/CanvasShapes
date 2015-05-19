/*global _, CanvasShapes*/

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
        1008: "CanvasShapes.Point - in `setFace`: provided face doesn't exist",
        1009: "CanvasShapes.ClassAbstract - in `is`: `passedClass` is not a string and doesn't have `className` property",
        1010: "CanvasShapes.GroupAbstract - in `add`: all shapes must implement CanvasShapes.ShapeInterface",
        1011: "CanvasShapes.CoordinatesAbstract - in `validateCoordinates` or `validateCoordinatesArray`: passed coordinates are not valid",
        1012: "CanvasShapes.Scene - this object doesn't implement CanvasShapes.RenderingInterface and can't be rendered",
        1013: "CanvasShapes.Rectangle - passed coordinates are not creating 90 degrees angle",
        1014: "CanvasShapes.Square - passed coordinates are not creating 90 degrees angle",
        1015: "CanvasShapes.Square - passed coordinates are not creating a square",
        1016: "CanvasShapes.SceneLayerAbstract - context mandatory but missing",
        1017: "CanvasShapes.SceneLayerAbstract - scene mandatory but missing",
        1018: "CanvasShapes.RenderingAbstract - layer mandatory but missing",
        1019: "CanvasShapes.SceneAbstract - in `newLayer()`: shape is not an instance of CanvasShapes.ShapeInterface",
        1020: "CanvasShapes.SceneAbstract - in `addShape()`: shape is not an instance of CanvasShapes.ShapeInterface",
        1021: "CanvasShapes.SceneAbstract - in `getLayerObject()`: shape is not an instance of either CanvasShapes.ShapeInterface or CanvasShapes.SceneLayerInterface",
        1022: "CanvasShapes.SceneAbstract - in `addShape()`: layer is not an instance of CanvasShapes.SceneLayerInterface",
        1023: 'CanvasShapes.Renderer - in `addScene()`: scene is not an instance of CanvasShapes.SceneInterface',
        1024: "CanvasShapes.Arc - in `constructor`: coordinates array is required",
        1025: "CanvasShapes.Arc - in `constructor`: radius is required",
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
        // Not implemented methods errors
        9001: 'CanvasShapes.RenderingInterface - `render()` is not implemented',
        9002: 'CanvasShapes.RenderingAbstract - `renderOnSingleLayer()` is not implemented',
        9003: 'CanvasShapes.RenderingInterface - `setSceneInterfaceHandlers()` is not implemented',
        9004: 'CanvasShapes.RenderingInterface - `setLayer()` is not implemented',
        9005: 'CanvasShapes.RenderingInterface - `numberOfSeparateLayersNeeded()` is not implemented',
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
        9023: 'CanvasShapes.SceneInterface - `setRelativeRendering()` is not implemented',
        9024: 'CanvasShapes.SceneInterface - `getRelativeRendering()` is not implemented',
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
    };

    /**
     * Custom error class to handle all the errors within CanvasShapes library.
     * It accepts error code to be passed as an integer, or string with a
     * custom message.
     *
     * @param {[integer,string]} error
     */
    ErrorClass = function (error) {

        if (_.isNumber(error)) {
            this.code = error;
            this.message = this.getMessageByCode(this.code);
        } else if (_.isString(error)) {
            this.message = error;
        }
    };

    CanvasShapes.Class.extend(ErrorClass.prototype, Error.prototype, {

        className: 'CanvasShapes.Error',

        /**
         * Error internal identifier within CanvasShapes library.
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

            if (_.isString(errors[code])) {
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
                name = this.className;

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
