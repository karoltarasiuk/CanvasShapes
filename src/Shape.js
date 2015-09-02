/*global _, CanvasShapes*/

CanvasShapes.Shape = (function () {

    var MIN_COORDINATES = undefined,
        MAX_COORDINATES = undefined;

    var Shape = function (coordinates) {
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

            coordinates = this.getCoordinates();

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

            } else if (_.isUndefined(context) && _.isObject(eventTypeOrContext)) {
                // this.off('some-event-type', contextObject)
                this.sceneInterfaceHandlers.off(handlerOrType, eventTypeOrContext);

            } else if (_.isUndefined(context) && _.isString(eventTypeOrContext)) {
                // this.off(someHandlerFunction, 'some-event-type')
                this.sceneInterfaceHandlers.off(handlerOrType, eventTypeOrContext, this);

            } else {
                // this.off(someHandlerFunction, 'some-event-type', contextObject)
                this.sceneInterfaceHandlers.off(handlerOrType, eventTypeOrContext, context);
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
        move: function (totalAnimationTime, coordinates, callback, context) {

            var startingCoordinates = _.cloneDeep(this.coordinates);

            if (
                (_.isUndefined(this.MIN_COORDINATES) && _.isUndefined(this.MAX_COORDINATES)) ||
                (this.MIN_COORDINATES === 1 && this.MAX_COORDINATES === 1)
            ) {
                this.validateCoordinates(coordinates, true);
            } else {
                this.validateCoordinatesArray(coordinates, true, this.MIN_COORDINATES, this.MAX_COORDINATES);
            }

            if (!context) {
                context = this;
            }

            this.animate(totalAnimationTime, function (currentTime) {

                var i, j,
                    newCoordinates = [],
                    ratio = currentTime / totalAnimationTime;

                if (_.isNaN(ratio) || ratio > 1) {
                    ratio = 1;
                }

                for (i = 0; i < coordinates.length; i++) {
                    if (_.isArray(coordinates[i])) {
                        if (!_.isArray(newCoordinates[i])) {
                            newCoordinates[i] = [];
                        }
                        for (j = 0; j < coordinates[i].length; i++) {
                            newCoordinates[i][j] =
                                startingCoordinates[i][j] +
                                (coordinates[i][j] - startingCoordinates[i][j]) *
                                ratio;
                        }
                    } else {
                        newCoordinates[i] =
                            startingCoordinates[i] +
                            (coordinates[i] - startingCoordinates[i]) *
                            ratio;
                    }
                }

                this.setCoordinates(newCoordinates);
                this.sceneInterfaceHandlers.requestRendering(this);

            }, callback, context);
        }
    });

    return Shape;
}());
