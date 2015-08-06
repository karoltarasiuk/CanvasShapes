/*global _, CanvasShapes, JSONChecker*/

CanvasShapes.Scene = (function () {

    var sceneConfigSpecification, sceneConfigChecker, Scene;

    sceneConfigSpecification = [{
        type: 'object',
        properties: [{
            name: 'id',
            spec: { type: 'string' }
        }, {
            name: 'width',
            spec: { type: 'number' }
        }, {
            name: 'height',
            spec: { type: 'number' }
        }]
    }, {
        type: 'object',
        properties: [{
            name: 'element'
        }, {
            name: 'width',
            spec: { type: 'number' }
        }, {
            name: 'height',
            spec: { type: 'number' }
        }]
    }];
    sceneConfigChecker = new JSONChecker(sceneConfigSpecification);

    Scene = function (config) {

        if (!this.validateConfig(config)) {
            throw new CanvasShapes.Error(1001);
        }

        this.initialize(config);
    };

    CanvasShapes.Class.extend(Scene.prototype, CanvasShapes.SceneAbstract.prototype, {

        className: 'CanvasShapes.Scene',

        newLayerHandler: null,

        setLayerHandler: null,

        getLayerHandler: null,

        initialize: function (config) {

            var defaultLayer;

            this.config = config;
            this.width = this.config.width;
            this.height = this.config.height;

            if (_.isString(this.config.id)) {
                this.dom = document.getElementById(this.config.id);
            } else {
                this.dom = this.config.element;
            }

            if (!this.dom) {
                throw new CanvasShapes.Error(1005);
            }

            // canvas elements inside dom are positioned absolutely
            if (
                this.dom.style.position === '' ||
                this.dom.style.position === 'static'
            ) {
                this.dom.style.position = 'relative';
            }

            this.initializeListeners();
        },

        validateConfig: function (config) {

            return sceneConfigChecker.check(config);
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        render: function () {

            var i;

            this.initializeLayers();

            _.each(this.layers, function (layerObject) {

                if (!_.isEmpty(layerObject.shapes)) {
                    _.each(layerObject.shapes, function (shape) {

                        if (
                            !layerObject.layer ||
                            !layerObject.layer.is(CanvasShapes.SceneLayerInterface)
                        ) {
                            throw new CanvasShapes.Error();
                        }

                        if (
                            !layerObject.layer ||
                            !layerObject.layer.is(CanvasShapes.SceneLayerInterface)
                        ) {
                            throw new CanvasShapes.Error();
                        }

                        shape.render(layerObject.layer);
                    });
                }
            });
        }
    });

    return Scene;
}());
