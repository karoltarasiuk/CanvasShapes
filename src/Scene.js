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
            throw new CanvasShapes.Error(1002);
        }

        this.initialize(config);
    };

    CanvasShapes.Class.extend(Scene.prototype, CanvasShapes.SceneAbstract.prototype, {

        className: 'CanvasShapes.Scene',

        newLayerHandler: null,

        initialize: function (config) {

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

            this.layer = this.newLayer();
            this.newLayerHandler = _.bind(this.newLayer, this);

            if (_.isBoolean(this.config.relativeRendering)) {
                this.setRelativeRendering(this.config.relativeRendering);
            }
        },

        validateConfig: function (config) {

            return sceneConfigChecker.check(config);
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        render: function () {

            var i, renderingObject,
                renderingObjects = Array.prototype.slice.call(arguments);

            if (renderingObjects.length > 0) {

                for (i = 0; i < renderingObjects.length; i++) {

                    renderingObject = renderingObjects[i];

                    if (renderingObject.is(CanvasShapes.RenderingInterface)) {
                        renderingObject.setLayer(this.layer);
                        renderingObject.setNewLayerHandler(
                            this.newLayerHandler
                        );
                        renderingObject.render();
                    } else {
                        throw new CanvasShapes.Error();
                    }
                }

            } else {
                throw new CanvasShapes.Error(1006);
            }
        }
    });

    return Scene;
}());
