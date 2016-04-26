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
         * This implementation assumes that the shape has only one coordinate.
         * For different cases you should override this method.
         *
         * @implements {CanvasShapes.InteractionInterface}
         *
         * @throws {CanvasShapes.Error} 1037
         */
        isColliding: function (mouseCoordinates) {

            var layer, coordinates,
                allowedError = 0;

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
            coordinates = this.getCentreCoordinates();

            if (this.is(CanvasShapes.RenderingInterface)) {
                allowedError = this.calculateAllowedError(layer);
            }

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

            var newHandler, originalEventType, currentState,
                newHandlers = {},
                that = this,
                // only those which are not handled separately
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
                eventType = 'mousemove';

                newHandlers[eventType] = (function () {

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

            } else if (
                eventType === 'drag' ||
                eventType === 'dragstart' ||
                eventType === 'dragstop'
            ) {
                newHandlers.mousedown = CanvasShapes._.bind(function (e) {
                    if (that.isColliding(e)) {
                        currentState = 'on';
                    }
                }, context);

                newHandlers.mouseup = CanvasShapes._.bind(function (e) {
                    currentState = 'off';
                    if (eventType === 'dragstop') {
                        handler.apply(this, arguments);
                    }
                }, context);

                newHandlers.mousemove = CanvasShapes._.bind(function (e) {
                    if (currentState === 'on') {
                        currentState = 'started';
                        if (eventType === 'dragstart') {
                            handler.apply(this, arguments);
                        }
                    }
                    if (currentState === 'started' && eventType === 'drag') {
                        handler.apply(this, arguments);
                    }
                }, context);

            } else if (eventsUsingIsColliding.indexOf(eventType) !== -1) {
                // checking whether the event is colliding with a shape
                newHandlers[eventType] = CanvasShapes._.bind(function (e) {
                    if (that.isColliding(e)) {
                        handler.apply(this, arguments);
                    }
                }, context);
            } else {
                newHandlers[eventType] = handler;
            }

            for (newHandler in newHandlers) {
                this.getSceneInterfaceHandlers().on(
                    newHandler,
                    newHandlers[newHandler],
                    context
                );
            }
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

            var i, j, tempCoordinates, animationFrameStepCallbackHelper,
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

                // setting `coordinates` as `startingCoordinates` plus offset
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

            /**
             * Internal function to calculate new coordinates for each step
             * of a move animation
             *
             * @param {array}   coordinates
             * @param {array}   startingCoordinates
             * @param {integer} totalAnimationTime
             * @param {float}   ratio
             * @param {integer} currentTime
             *
             * @return {array}
             */
            animationFrameStepCallbackHelper = function (
                coordinates,
                startingCoordinates,
                totalAnimationTime,
                ratio,
                currentTime
            ) {
                var newCoordinates = [];

                if (ratio === undefined) {
                    ratio = 1;
                }

                if (currentTime === undefined) {
                    currentTime = totalAnimationTime;
                }

                if (CanvasShapes._.isFunction(coordinates)) {
                    newCoordinates = coordinates(
                        startingCoordinates,
                        totalAnimationTime,
                        currentTime
                    );
                } else {

                    for (i = 0; i < coordinates.length; i++) {
                        if (CanvasShapes._.isArray(coordinates[i])) {
                            if (!CanvasShapes._.isArray(newCoordinates[i])) {
                                newCoordinates[i] = [];
                            }
                            for (j = 0; j < coordinates[i].length; j++) {
                                newCoordinates[i][j] =
                                    startingCoordinates[i][j] +
                                    (coordinates[i][j] -
                                    startingCoordinates[i][j]) *
                                    ratio;
                            }
                        } else {
                            newCoordinates[i] =
                                startingCoordinates[i] +
                                (coordinates[i] - startingCoordinates[i]) *
                                ratio;
                        }
                    }
                }

                return newCoordinates;
            };

            // if `totalAnimationTime` is too small, we shouldn't do animation
            // we should simply set new coordinates and request rendering
            if (
                totalAnimationTime <
                CanvasShapes.Config.get('MIN_ANIMATION_TIME')
            ) {
                this.getSceneInterfaceHandlers().requestRendering(
                    this,
                    callback,
                    CanvasShapes._.bind(function (coordinates) {
                        this.setCoordinates(coordinates);
                    }, this, animationFrameStepCallbackHelper(
                        coordinates,
                        startingCoordinates,
                        totalAnimationTime
                    ))
                );
                return;
            }

            this.animate(new CanvasShapes.AnimationFrame(
                this,
                totalAnimationTime,
                function (currentTime) {

                    var newCoordinates = [],
                        ratio = currentTime / this.totalAnimationTime;

                    if (CanvasShapes._.isNaN(ratio) || ratio > 1) {
                        ratio = 1;
                    }

                    newCoordinates = animationFrameStepCallbackHelper(
                        this.variables.coordinates,
                        this.variables.startingCoordinates,
                        this.totalAnimationTime,
                        ratio,
                        currentTime
                    );

                    this.shape.setCoordinates(newCoordinates);
                },
                callback,
                {
                    startingCoordinates: startingCoordinates,
                    coordinates: coordinates
                }
            ));
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        isShapeOpen: function () {
            return undefined;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        isShapeClosed: function () {

            var shapeIsOpen = this.isShapeOpen();

            if (shapeIsOpen === undefined) {
                return undefined;
            } else {
                return !shapeIsOpen;
            }
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        isShapeContinuous: function () {
            return undefined;
        }
    });

    return ShapeAbstract;
}());
