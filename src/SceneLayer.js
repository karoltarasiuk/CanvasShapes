/*global CanvasShapes*/

CanvasShapes.SceneLayer = (function () {

    /**
     * SceneLayer constructor.
     *
     * `scene` is a scene to place the layer on. `width` and `height` define the
     * size of the layer. `top` and `left` its position relatively to the scene.
     *
     * When `offScreen` parameter is passed, layer CSS position is `fixed` and
     * `margin-top` and `margin-left` are set to negative `height` and `top`
     * respectively.
     *
     * [WARNING] `offScreen` is a private read only parameter usually set by a
     * scene which manages off-screen environment. Setting it only for a layer
     * won't do anything.
     *
     * @param {CanvasShapes.SceneInterface} scene
     * @param {float}                       width [OPTIONAL]
     * @param {float}                       height [OPTIONAL]
     * @param {float}                       left [OPTIONAL]
     * @param {float}                       top [OPTIONAL]
     * @param {boolean}                     offScreen [OPTIONAL]
     */
    var SceneLayer = function (scene, width, height, left, top, offScreen) {
        this.setUUID();
        this._initialise(scene, width, height, left, top, offScreen);
    };

    CanvasShapes.Class.extend(
        SceneLayer.prototype,
        CanvasShapes.SceneLayerAbstract.prototype,
    {
        _className: 'CanvasShapes.SceneLayer',

        /**
         * For detailed info check the doc comments of a class.
         *
         * @throws {CanvasShapes.Error} 1055
         * @throws {CanvasShapes.Error} 1004
         *
         * @param {CanvasShapes.SceneInterface} scene
         * @param {float}                       width [OPTIONAL]
         * @param {float}                       height [OPTIONAL]
         * @param {float}                       left [OPTIONAL]
         * @param {float}                       top [OPTIONAL]
         * @param {boolean}                     offScreen [OPTIONAL]
         */
        _initialise: function (scene, width, height, left, top, offScreen) {

            if (
                !CanvasShapes._.isObject(scene) ||
                !CanvasShapes._.isFunction(scene.is) ||
                !scene.is(CanvasShapes.SceneInterface) ||
                (width !== undefined && !CanvasShapes._.isNumber(width)) ||
                (height !== undefined && !CanvasShapes._.isNumber(height)) ||
                (left !== undefined && !CanvasShapes._.isNumber(left)) ||
                (top !== undefined && !CanvasShapes._.isNumber(top)) ||
                (offScreen !== undefined &&
                    !CanvasShapes._.isBoolean(offScreen))
            ) {
                throw new CanvasShapes.Error(1055);
            }

            this.scene = scene;

            if (width) {
                this.width = width;
            } else {
                this.width = this.scene.getWidth();
            }

            if (height) {
                this.height = height;
            } else {
                this.height = this.scene.getHeight();
            }

            if (left) {
                this.left = left;
            }

            if (top) {
                this.top = top;
            }

            this.offScreen = false;

            if (offScreen === true) {
                this.offScreen = true;
            }

            this._initialiseCanvas();

            if (!this.canvas.getContext) {
                throw new CanvasShapes.Error(1004);
            }

            this.context = this.canvas.getContext('2d');
        },

        /**
         * Method initialising canvas within scene's DOM element.
         *
         * @throws {CanvasShapes.Error} 1007
         */
        _initialiseCanvas: function () {

            var dom = this.scene.getDom(),
                sceneWidth = this.scene.getWidth(),
                sceneHeight = this.scene.getHeight();

            if (!dom) {
                throw new CanvasShapes.Error(1007);
            }

            if (sceneWidth !== this.width) {
                if (this.left === null) {
                    this.left = Math.floor((sceneWidth - this.width) / 2);
                }
            } else {
                if (this.left === null) {
                    this.left = 0;
                }
            }

            if (sceneHeight !== this.height) {
                if (this.top === null) {
                    this.top = Math.floor((sceneHeight - this.height) / 2);
                }
            } else {
                if (this.top === null) {
                    this.top = 0;
                }
            }

            // creating actual canvas HTML element
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.innerHTML = '<span>Canvas 2D context is not supported' +
                ' in your browser</span>';
            this.canvas.style.position = 'absolute';

            if (this.offScreen) {
                this.canvas.className = 'offScreen';
                this.canvas.style.position = 'fixed';
                this.canvas.style.marginTop = -this.height + 'px';
                this.canvas.style.marginLeft = -this.width + 'px';
                this.canvas.style.top = '0px';
                this.canvas.style.left = '0px';
            } else {
                this.canvas.style.top = this.top + 'px';
                this.canvas.style.left = this.left + 'px';
            }

            dom.appendChild(this.canvas);
        }
    });

    return SceneLayer;
}());
