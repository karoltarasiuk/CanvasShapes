/*global _, CanvasShapes*/

CanvasShapes.SceneLayer = (function () {

    var SceneLayer = function (scene, width, height, left, top) {
        this.setUUID();
        this.initialize(scene, width, height, left, top);
    };

    CanvasShapes.Class.extend(SceneLayer.prototype, CanvasShapes.SceneLayerAbstract.prototype, {

        className: 'CanvasShapes.SceneLayer',

        canvas: null,

        left: null,

        top: null,

        initialize: function (scene, width, height, left, top) {

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

            this.initializeCanvas();

            if (!this.canvas.getContext) {
                throw new CanvasShapes.Error(1004);
            }

            this.context = this.canvas.getContext('2d');
        },

        initializeCanvas: function () {

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
            this.canvas.innerHTML = '<span>Canvas 2D context is not supported in your browser</span>';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = this.top + 'px';
            this.canvas.style.left = this.left + 'px';

            dom.appendChild(this.canvas);
        }
    });

    return SceneLayer;
}());
