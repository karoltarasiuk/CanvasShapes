/*global _, CanvasShapes*/

CanvasShapes.Shape = (function () {

    var Shape = function (coordinates) {
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
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        getCoordinates: function () {
            return this.coordinates;
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
        }
    });

    return Shape;
}());
