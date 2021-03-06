/*global CanvasShapes*/

CanvasShapes.EventAbstract = (function () {

    /**
     * Abstract Event class. You can't use it directly as it will throw an
     * exception. Use `Event.getInstance` static method instead.
     *
     * This class doesn't have an `Abstract` suffix in its name as its static
     * methods and fields can be used pretty often, so it saves you on typing.
     *
     * @throws {CanvasShapes.Error} 8019
     */
    var EventAbstract = function () {
        throw new CanvasShapes.Error(8019);
    };

    CanvasShapes.Class.extend(
        EventAbstract.prototype,
        CanvasShapes.EventInterface.prototype,
    {
        _className: 'CanvasShapes.EventAbstract',

        /**
         * Initialisation method of the new Event object. It accepts native DOM
         * `event`, custom `event` object with `type` property defined, or a
         * `string` containing a custom event type.
         *
         * `scene` is a Scene instance when the even occured. We don't pass a
         * layer as scene simply doesn't know which layer the event should go
         * to. It's because it can have multiple layers rendered off the screen
         * and copied to one visible layer.
         *
         * `target` argument is optional, and is used to overwrite the target
         * from the native DOM event object, or set the target for custom event.
         * If `target` is not passed explicitly, it falls back to `event.target`
         * and then to `scene.getDom()`.
         *
         * @throws {CanvasShapes.Error} 1035
         * @throws {CanvasShapes.Error} 1056
         * @throws {CanvasShapes.Error} 1039
         *
         * @param {[object,string]}             event
         * @param {CanvasShapes.SceneInterface} scene
         * @param {object}                      target [OPTIONAL]
         */
        _initialise: function (event, scene, target) {

            if (CanvasShapes._.isString(event)) {
                event = {
                    type: event
                };
            }

            if (
                !CanvasShapes._.isObject(event) ||
                !CanvasShapes._.isString(event.type)
            ) {
                throw new CanvasShapes.Error(1035);
            }

            if (
                !CanvasShapes._.isObject(scene) ||
                !CanvasShapes._.isFunction(scene.is) ||
                !scene.is(CanvasShapes.SceneInterface)
            ) {
                throw new CanvasShapes.Error(1056);
            }

            if (!target) {
                target = scene.getDom();
            }

            if (!CanvasShapes.Tools.isElement(target)) {
                throw new CanvasShapes.Error(1039);
            }

            this.event = event;
            this.category = CanvasShapes.Event.getCategory(this.event);
            this.target = target;
            this.scene = scene;
        },

        /**
         * Returns the type of the event.
         *
         * @return {string}
         */
        getType: function () {
            return this.event.type;
        }
    });

    return EventAbstract;
}());
