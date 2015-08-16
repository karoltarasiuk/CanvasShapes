/*global define, describe, it, expect*/
define([
    "lodash",
    "CanvasShapes",
    "ObjectComparer"
], function(
    _,
    CanvasShapes,
    ObjectComparer
) {

    describe('CanvasShapes.Interaction', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8010);

                expect(
                    function () {
                        new CanvasShapes.InteractionInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8018);

                expect(
                    function () {
                        new CanvasShapes.InteractionAbstract();
                    }
                ).toThrow(temp);
            });
        });

        describe('abstract methods', function () {

            it('isColliding method', function () {

                var layer, shape1Class, shape1,
                    error1 = new CanvasShapes.Error(1036),
                    error2 = new CanvasShapes.Error(1037),
                    shape2 = new CanvasShapes.Point([10, 10]);

                shape1Class = function () {};
                _.extend(shape1Class.prototype, CanvasShapes.InteractionAbstract.prototype);
                shape1 = new shape1Class();

                expect(function () {
                    shape1.isColliding();
                }).toThrow(error1);

                expect(function () {
                    shape2.isColliding();
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding('string');
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding(1);
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({});
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding([]);
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1 });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: 'string' });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: '1' });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: {} });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: [] });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: 2 });
                }).not.toThrow();

                expect(shape2.isColliding({ x: 1, y: 2 })).toBe(false);
                expect(shape2.isColliding({ x: 10, y: 10 })).toBe(true);
            });
        });
    });
});
