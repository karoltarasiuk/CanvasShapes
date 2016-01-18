/*global _, CanvasShapes*/

CanvasShapes.ClassAbstract = (function () {

    /**
     * Abstract for any class within CanvasShapes library.
     *
     * @throws {CanvasShapes.Error} 8005
     */
    var ClassAbstract = function () {
        throw new CanvasShapes.Error(8005);
    };

    CanvasShapes._.extend(
        ClassAbstract.prototype,
        CanvasShapes.ClassInterface.prototype,
    {

        _className: 'CanvasShapes.ClassAbstract',

        /**
         * @implements {CanvasShapes.ClassInterface}
         *
         * @throws {CanvasShapes.Error} 1009
         */
        is: function (passedClass) {

            if (CanvasShapes._.isObject(passedClass)) {
                if (CanvasShapes._.isString(passedClass._className)) {
                    passedClass = passedClass._className;
                } else if (
                    CanvasShapes._.isObject(passedClass.prototype) &&
                    CanvasShapes._.isString(passedClass.prototype._className)
                ) {
                    passedClass = passedClass.prototype._className;
                }
            }

            if (!CanvasShapes._.isString(passedClass)) {
                throw new CanvasShapes.Error(1009);
            }

            return this.classes.indexOf(passedClass) !== -1;
        },

        /**
         * @implements {CanvasShapes.ClassInterface}
         *
         * @throws {CanvasShapes.Error} 1061
         */
        setUUID: function (UUID) {

            var currentUUID = this.getUUID(),
                newUUID = CanvasShapes.Tools.uuid();

            if (UUID && !CanvasShapes.Class.isUUID(UUID)) {
                throw new CanvasShapes.Error(1061);
            }

            if (UUID) {
                if (currentUUID) {
                    CanvasShapes.Class.swapUUID(currentUUID, UUID);
                } else {
                    CanvasShapes.Class.setObject(UUID, this);
                }
                this.UUID = UUID;
            } else {
                if (currentUUID) {
                    CanvasShapes.Class.swapUUID(currentUUID, newUUID);
                } else {
                    CanvasShapes.Class.setObject(newUUID, this);
                }
                this.UUID = newUUID;
            }

            return this.getUUID();
        },

        /**
         * @implements {CanvasShapes.ClassInterface}
         */
        getUUID: function () {
            return this.UUID;
        },

        /**
         * @implements {CanvasShapes.ClassInterface}
         */
        getClassName: function () {
            return this._className;
        }
    });

    return ClassAbstract;
}());
