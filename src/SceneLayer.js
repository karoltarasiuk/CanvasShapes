/*global _, CanvasShapes*/

CanvasShapes.SceneLayer = (function () {

    /**
     * SceneLayer constructor.
     *
     * When `offScreen` parameter is passed, layer CSS position is `fixed` and
     * `margin-top` and `margin-left` are set to negative `height` and `top`
     * respectively.
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
        this.initialise(scene, width, height, left, top, offScreen);
    };

    CanvasShapes.Class.extend(
        SceneLayer.prototype,
        CanvasShapes.SceneLayerAbstract.prototype,
    {
        className: 'CanvasShapes.SceneLayer',

        canvas: null,

        left: null,

        top: null,

        /**
         * SceneLayer initialisation method.
         *
         * When `offScreen` parameter is passed, layer CSS position is `fixed`
         * and `margin-top` and `margin-left` are set to negative `height` and
         * `top` respectively.
         *
         * @param {CanvasShapes.SceneInterface} scene
         * @param {float}                       width [OPTIONAL]
         * @param {float}                       height [OPTIONAL]
         * @param {float}                       left [OPTIONAL]
         * @param {float}                       top [OPTIONAL]
         * @param {boolean}                     offScreen [OPTIONAL]
         */
        initialise: function (scene, width, height, left, top, offScreen) {

            if (
                !_.isObject(scene) || !_.isFunction(scene.is) ||
                !scene.is(CanvasShapes.SceneInterface) ||
                (!_.isUndefined(width) && !_.isNumber(width)) ||
                (!_.isUndefined(height) && !_.isNumber(height)) ||
                (!_.isUndefined(left) && !_.isNumber(left)) ||
                (!_.isUndefined(top) && !_.isNumber(top)) ||
                (!_.isUndefined(offScreen) && !_.isBoolean(offScreen))
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

            this.initialiseCanvas();

            if (!this.canvas.getContext) {
                throw new CanvasShapes.Error(1004);
            }

            this.context = this.canvas.getContext('2d');
        },

        initialiseCanvas: function () {

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
            this.canvas.style.top = this.top + 'px';
            this.canvas.style.left = this.left + 'px';

            if (this.offScreen) {
                this.canvas.className = 'offScreen';
                this.canvas.style.position = 'fixed';
                this.canvas.style.marginTop = -this.height + 'px';
                this.canvas.style.marginLeft = -this.width + 'px';
            }

            dom.appendChild(this.canvas);
        }
    });

    return SceneLayer;
}());
