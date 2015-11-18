/*global _, CanvasShapes*/

CanvasShapes.Shape = (function () {

    var MIN_COORDINATES = undefined,
        MAX_COORDINATES = undefined;

    var Shape = function (coordinates) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this.coordinates = coordinates;
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
         * @implements {CanvasShapes.InteractionInterface}
         */
        isColliding: function (mouseCoordinates) {

            var coordinates;

            if (
                !_.isObject(mouseCoordinates) ||
                !_.isNumber(mouseCoordinates.x) ||
                !_.isNumber(mouseCoordinates.y)
            ) {
                throw new CanvasShapes.Error(1037);
            }

            coordinates = this.getCentreCoordinates();

            if (
                coordinates[0] === mouseCoordinates.x &&
                coordinates[1] === mouseCoordinates.y
            ) {
                return true;
            }

            return false;
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

            if (!this.isOnScene()) {
                throw new CanvasShapes.Error(1042);
            }

            if (!context) {
                context = this;
            }

            this.sceneInterfaceHandlers.on(eventType, handler, context);
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
                _.isUndefined(eventTypeOrContext) &&
                _.isUndefined(context)
            ) {
                // this.off('some-event-type')
                this.sceneInterfaceHandlers.off(handlerOrType, this);

            } else if (
                _.isUndefined(context) &&
                _.isObject(eventTypeOrContext)
            ) {
                // this.off('some-event-type', contextObject)
                this.sceneInterfaceHandlers.off(
                    handlerOrType,
                    eventTypeOrContext
                );

            } else if (
                _.isUndefined(context) &&
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
                    (_.isUndefined(this.MIN_COORDINATES) && _.isUndefined(this.MAX_COORDINATES)) ||
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
