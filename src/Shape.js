/*global _, CanvasShapes*/

CanvasShapes.Shape = (function () {

    var MIN_COORDINATES = undefined,
        MAX_COORDINATES = undefined;

    var Shape = function (coordinates) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;

        if (coordinates) {
            if (
                _.isArray(coordinates) && (
                    this.validateCoordinates(coordinates) ||
                    this.validateCoordinatesArray(coordinates)
                )
            ) {
                this.setCoordinates(coordinates);
            } else {
                throw new CanvasShapes.Error(1036);
            }
        }
    };

    CanvasShapes.Class.extend(
        Shape.prototype,
        CanvasShapes.RenderingAbstract.prototype,
        CanvasShapes.ShapeAbstract.prototype,
        CanvasShapes.CoordinatesAbstract.prototype,
        CanvasShapes.InteractionAbstract.prototype,
        CanvasShapes.AnimationAbstract.prototype,
    {
        className: 'CanvasShapes.Shape',

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function () {
            // there's nothing to render
        },

        /**
         * Allows you to overwrite global IS_COLLIDING_RATIO config value.
         *
         * @param {boolean} isCollidingRatio
         */
        setIsCollidingRatio: function (isCollidingRatio) {

            if (!_.isNumber(isCollidingRatio)) {
                throw new CanvasShapes.Error(1057);
            }

            this._isCollidingRatio = isCollidingRatio;
        },

        /**
         * Calculates allowed error parameter used in `isColliding` method. It's
         * never less than 1. Also internal `_isCollidingRatio` property set in
         * `setIsCollidingRatio()` takes precedence over global
         * `IS_COLLIDING_RATIO` config value. The calculation is relative to the
         * size of a layer, which means, since one shape can sit on
         * multiple layers, that layer must be passed as an argument.
         *
         * @param  {CanvasShapes.SceneLayerInterface} layer
         * @return {float}
         */
        calculateAllowedError: function (layer) {

            var isCollidingRatio = this._isCollidingRatio ||
                    CanvasShapes.Config.get('IS_COLLIDING_RATIO'),
                allowedError = _.max([
                    layer.getWidth(),
                    layer.getHeight()]
                ) * isCollidingRatio;

            if (allowedError < 1) {
                allowedError = 1;
            }

            return allowedError;
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        isColliding: function (mouseCoordinates) {

            var layer, allowedError, coordinates;

            if (
                !_.isObject(mouseCoordinates) ||
                !_.isNumber(mouseCoordinates.x) ||
                !_.isNumber(mouseCoordinates.y) ||
                !_.isObject(mouseCoordinates.scene) ||
                !_.isFunction(mouseCoordinates.scene.is) ||
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
         * Checks whether shape was added to a scene.
         *
         * @return {boolean}
         */
        isOnScene: function () {

            if (_.isObject(this.sceneInterfaceHandlers)) {
                return true;
            }

            return false;
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
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
                        newHandler = _.bind(function (e) {

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
                newHandler = _.bind(function (e) {
                    if (that.isColliding(e)) {
                        handler.apply(this, arguments);
                    }
                }, context);
            } else {
                newHandler = handler;
            }

            this.sceneInterfaceHandlers.on(eventType, newHandler, context);
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        off: function (handlerOrType, eventTypeOrContext, context) {

            if (!this.isOnScene()) {
                throw new CanvasShapes.Error(1042);
            }

            if (
                _.isString(handlerOrType) &&
                eventTypeOrContext === undefined &&
                context === undefined
            ) {
                // this.off('some-event-type')
                this.sceneInterfaceHandlers.off(handlerOrType, this);

            } else if (
                context === undefined &&
                _.isObject(eventTypeOrContext)
            ) {
                // this.off('some-event-type', contextObject)
                this.sceneInterfaceHandlers.off(
                    handlerOrType,
                    eventTypeOrContext
                );

            } else if (
                context === undefined &&
                _.isString(eventTypeOrContext)
            ) {
                // this.off(someHandlerFunction, 'some-event-type')
                this.sceneInterfaceHandlers.off(
                    handlerOrType,
                    eventTypeOrContext,
                    this
                );

            } else {
                // this.off(someHandlerFunction, 'some-event-type',
                // contextObject)
                this.sceneInterfaceHandlers.off(
                    handlerOrType,
                    eventTypeOrContext,
                    context
                );
            }
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        dispatch: function (event, context) {

            if (!this.isOnScene()) {
                throw new CanvasShapes.Error(1042);
            }

            if (!context) {
                context = this;
            }

            this.sceneInterfaceHandlers.dispatch(event, context);
        },

        /**
         * @implements {CanvasShapes.AnimationInterface}
         */
        move: function (totalAnimationTime, coordinates, callback) {

            var i, j, tempCoordinates,
                startingCoordinates = this.processCoordinates(
                    this.getCoordinates()
                );

            if (_.isArray(coordinates)) {
                if (
                    (this.MIN_COORDINATES === undefined && this.MAX_COORDINATES === undefined) ||
                    (this.MIN_COORDINATES === 1 && this.MAX_COORDINATES === 1)
                ) {
                    this.validateCoordinates(coordinates, true);
                } else {
                    this.validateCoordinatesArray(coordinates, true, this.MIN_COORDINATES, this.MAX_COORDINATES);
                }
            } else if (_.isFunction(coordinates)) {
                // do absolutely nothing
            } else if (_.isObject(coordinates)) {
                // translating offset object to array
                tempCoordinates =
                    this.translateOffsetToCoordinates(coordinates);

                coordinates = [];

                // setting `this.coordinates` as
                // `this.startingCoordinates` plus offset
                for (i = 0; i < startingCoordinates.length; i++) {
                    if (_.isArray(startingCoordinates[i])) {
                        for (j = 0; j < startingCoordinates[i].length; j++) {
                            if (!_.isArray(coordinates[i])) {
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

                    if (_.isNaN(ratio) || ratio > 1) {
                        ratio = 1;
                    }

                    if (_.isFunction(this.variables.coordinates)) {
                        newCoordinates = this.variables.coordinates(
                            this.variables.startingCoordinates,
                            this.totalAnimationTime,
                            currentTime
                        );
                    } else {

                        for (i = 0; i < this.variables.coordinates.length; i++) {
                            if (_.isArray(this.variables.coordinates[i])) {
                                if (!_.isArray(newCoordinates[i])) {
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

    return Shape;
}());
