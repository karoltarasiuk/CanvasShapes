/*global CanvasShapes*/

CanvasShapes.ShapeAbstract = (function () {

    /**
     * An abstract class for all the shapes.
     *
     * @throws {CanvasShapes.Error} 8003
     */
    var ShapeAbstract = function () {
        throw new CanvasShapes.Error(8003);
    };

    CanvasShapes.Class.extend(
        ShapeAbstract.prototype,
        CanvasShapes.ShapeInterface.prototype,
    {
        _className: 'CanvasShapes.ShapeAbstract',

        /**
         * @implements {CanvasShapes.ShapeInterface}
         *
         * @throws {CanvasShapes.Error} 1046
         */
        setParent: function (group) {
            if (
                !CanvasShapes._.isObject(group) ||
                !CanvasShapes._.isFunction(group.is) ||
                !group.is(CanvasShapes.GroupInterface)
            ) {
                throw new CanvasShapes.Error(1046);
            }

            this.parent = group;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        getParent: function () {
            return this.parent;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        getRenderingShape: function () {

            var parent = this.getParent();

            if (!parent) {
                return this;
            }

            while (parent.getParent()) {
                parent = parent.getParent();
            }

            return parent;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        isOnScene: function () {

            if (
                CanvasShapes._.isArray(this.getSceneInterfaceHandlers()) &&
                this.getSceneInterfaceHandlers().length > 0
            ) {
                return true;
            }

            return false;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         *
         * @throws {CanvasShapes.Error} 1057
         */
        setIsCollidingRatio: function (isCollidingRatio) {

            if (!CanvasShapes._.isNumber(isCollidingRatio)) {
                throw new CanvasShapes.Error(1057);
            }

            this._isCollidingRatio = isCollidingRatio;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        calculateAllowedError: function (layer) {

            var isCollidingRatio = this._isCollidingRatio ||
                    CanvasShapes.Config.get('IS_COLLIDING_RATIO'),
                allowedError = CanvasShapes._.max([
                    layer.getWidth(),
                    layer.getHeight()]
                ) * isCollidingRatio;

            if (allowedError < 1) {
                allowedError = 1;
            }

            return allowedError;
        },

        /**
         * This implementation assumes that the shape has only one coordinate.
         * For different cases you should override this method.
         *
         * @implements {CanvasShapes.InteractionInterface}
         *
         * @throws {CanvasShapes.Error} 1037
         */
        isColliding: function (mouseCoordinates) {

            var layer, allowedError, coordinates;

            if (
                !CanvasShapes._.isObject(mouseCoordinates) ||
                !CanvasShapes._.isNumber(mouseCoordinates.x) ||
                !CanvasShapes._.isNumber(mouseCoordinates.y) ||
                !CanvasShapes._.isObject(mouseCoordinates.scene) ||
                !CanvasShapes._.isFunction(mouseCoordinates.scene.is) ||
                !mouseCoordinates.scene.is(CanvasShapes.SceneInterface)
            ) {
                throw new CanvasShapes.Error(1037);
            }

            layer = mouseCoordinates.scene.getLayer(this);
            allowedError = this.calculateAllowedError(layer);
            coordinates = this.getCentreCoordinates();

            return CanvasShapes.Tools.isValueWithinInterval(
                coordinates[0],
                mouseCoordinates.x + allowedError,
                mouseCoordinates.x - allowedError
            ) && CanvasShapes.Tools.isValueWithinInterval(
                coordinates[1],
                mouseCoordinates.y + allowedError,
                mouseCoordinates.y - allowedError
            );
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         *
         * @throws {CanvasShapes.Error} 1042
         */
        on: function (eventType, handler, context) {

            var newHandler, originalEventType,
                that = this,
                eventsUsingIsColliding = [
                    'click',
                    'contextmenu',
                    'dblclick',
                    'mousemove',
                    'mouseup',
                    'mousedown'
                ];

            if (!this.isOnScene()) {
                throw new CanvasShapes.Error(1042);
            }

            if (!context) {
                context = this;
            }

            if (eventType === 'mouseover' || eventType === 'mouseout') {
                // emulation of those based on mousemove
                originalEventType = eventType;

                newHandler = (function () {

                    var inOrOut,
                        newHandler = CanvasShapes._.bind(function (e) {

                            var isColliding = that.isColliding(e);

                            if (isColliding) {
                                if (
                                    originalEventType === 'mouseover' &&
                                    inOrOut === 'out'

                                ) {
                                    handler.apply(this, arguments);
                                }
                                inOrOut = 'in';

                            } else if (!isColliding) {
                                if (
                                    originalEventType === 'mouseout' &&
                                    inOrOut === 'in'
                                ) {
                                    handler.apply(this, arguments);
                                }
                                inOrOut = 'out';
                            }

                        }, context);

                    return newHandler;
                })();

                eventType = 'mousemove';

            } else if (eventsUsingIsColliding.indexOf(eventType) !== -1) {
                // checking whether the event is colliding with a shape
                newHandler = CanvasShapes._.bind(function (e) {
                    if (that.isColliding(e)) {
                        handler.apply(this, arguments);
                    }
                }, context);
            } else {
                newHandler = handler;
            }

            this.getSceneInterfaceHandlers().on(eventType, newHandler, context);
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         *
         * @throws {CanvasShapes.Error} 1042
         */
        off: function (handlerOrType, eventTypeOrContext, context) {

            if (!this.isOnScene()) {
                throw new CanvasShapes.Error(1042);
            }

            if (
                CanvasShapes._.isString(handlerOrType) &&
                eventTypeOrContext === undefined &&
                context === undefined
            ) {
                // this.off('some-event-type')
                this.getSceneInterfaceHandlers().off(handlerOrType, this);

            } else if (
                context === undefined &&
                CanvasShapes._.isObject(eventTypeOrContext)
            ) {
                // this.off('some-event-type', contextObject)
                this.getSceneInterfaceHandlers().off(
                    handlerOrType,
                    eventTypeOrContext
                );

            } else if (
                context === undefined &&
                CanvasShapes._.isString(eventTypeOrContext)
            ) {
                // this.off(someHandlerFunction, 'some-event-type')
                this.getSceneInterfaceHandlers().off(
                    handlerOrType,
                    eventTypeOrContext,
                    this
                );

            } else {
                // this.off(someHandlerFunction, 'some-event-type',
                // contextObject)
                this.getSceneInterfaceHandlers().off(
                    handlerOrType,
                    eventTypeOrContext,
                    context
                );
            }
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         *
         * @throws {CanvasShapes.Error} 1042
         */
        dispatch: function (event, context) {

            if (!this.isOnScene()) {
                throw new CanvasShapes.Error(1042);
            }

            if (!context) {
                context = this;
            }

            this.getSceneInterfaceHandlers().dispatch(event, context);
        },

        /**
         * @implements {CanvasShapes.AnimationInterface}
         */
        move: function (totalAnimationTime, coordinates, callback) {

            var i, j, tempCoordinates,
                startingCoordinates = this.processCoordinates(
                    this.getCoordinates()
                );

            if (CanvasShapes._.isArray(coordinates)) {
                if (
                    (this.MIN_COORDINATES === undefined && this.MAX_COORDINATES === undefined) ||
                    (this.MIN_COORDINATES === 1 && this.MAX_COORDINATES === 1)
                ) {
                    this.validateCoordinates(coordinates, true);
                } else {
                    this.validateCoordinatesArray(coordinates, true, this.MIN_COORDINATES, this.MAX_COORDINATES);
                }
            } else if (CanvasShapes._.isFunction(coordinates)) {
                // do absolutely nothing
            } else if (CanvasShapes._.isObject(coordinates)) {
                // translating offset object to array
                tempCoordinates =
                    this.translateOffsetToCoordinates(coordinates);

                coordinates = [];

                // setting `this._coordinates` as
                // `this.startingCoordinates` plus offset
                for (i = 0; i < startingCoordinates.length; i++) {
                    if (CanvasShapes._.isArray(startingCoordinates[i])) {
                        for (j = 0; j < startingCoordinates[i].length; j++) {
                            if (!CanvasShapes._.isArray(coordinates[i])) {
                                coordinates[i] = [];
                            }
                            coordinates[i][j] =
                                startingCoordinates[i][j] + tempCoordinates[j];
                        }
                    } else {
                        coordinates[i] =
                            startingCoordinates[i] + tempCoordinates[i];
                    }
                }
            }

            this.animate(new CanvasShapes.AnimationFrame(
                this,
                totalAnimationTime,
                function (currentTime) {

                    var i, j,
                        newCoordinates = [],
                        ratio = currentTime / this.totalAnimationTime;

                    if (CanvasShapes._.isNaN(ratio) || ratio > 1) {
                        ratio = 1;
                    }

                    if (CanvasShapes._.isFunction(this.variables.coordinates)) {
                        newCoordinates = this.variables.coordinates(
                            this.variables.startingCoordinates,
                            this.totalAnimationTime,
                            currentTime
                        );
                    } else {

                        for (i = 0; i < this.variables.coordinates.length; i++) {
                            if (CanvasShapes._.isArray(this.variables.coordinates[i])) {
                                if (!CanvasShapes._.isArray(newCoordinates[i])) {
                                    newCoordinates[i] = [];
                                }
                                for (j = 0; j < this.variables.coordinates[i].length; j++) {
                                    newCoordinates[i][j] =
                                        this.variables.startingCoordinates[i][j] +
                                        (this.variables.coordinates[i][j] -
                                        this.variables.startingCoordinates[i][j]) *
                                        ratio;
                                }
                            } else {
                                newCoordinates[i] =
                                    this.variables.startingCoordinates[i] +
                                    (this.variables.coordinates[i] - this.variables.startingCoordinates[i]) *
                                    ratio;
                            }
                        }
                    }

                    this.shape.setCoordinates(newCoordinates);
                },
                callback,
                {
                    startingCoordinates: startingCoordinates,
                    coordinates: coordinates
                }
            ));
        }
    });

    return ShapeAbstract;
}());
