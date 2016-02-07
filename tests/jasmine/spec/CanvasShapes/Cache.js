/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
) {

    describe('CanvasShapes.Cache', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8026);

                expect(
                    function () {
                        new CanvasShapes.CacheInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8027);

                expect(
                    function () {
                        new CanvasShapes.CacheAbstract();
                    }
                ).toThrow(temp);
            });
        });

        describe('abstract methods', function () {

            it('cannot pass a wrong format of a varname', function () {

                var i,
                    shape = new CanvasShapes.Point([10, 10]),
                    error = new CanvasShapes.Error(1073),
                    data = [
                        undefined,
                        false,
                        1,
                        [],
                        {},
                        function () {}
                    ];

                for (i = 0; i < data.length; i++) {
                    expect(function () {
                        shape.setCache(data[i], {});
                    }).toThrow(error);
                    expect(function () {
                        shape.getCache(data[i], {});
                    }).toThrow(error);
                }
            });

            it('correctly sets and gets the cache', function () {

                var shape = new CanvasShapes.Point([10, 10]);

                expect(shape.setCache('a', { a: 'a' })).toBe(true);
                expect(shape.getCache('a')).toEqual({ a: 'a' });
                expect(shape.setCache('a', { b: 'b' })).toBe(false);
                expect(shape.getCache('a')).toEqual({ a: 'a' });
                expect(shape.getCache('a')).not.toEqual({ b: 'b' });
                expect(shape.setCache('a', { b: 'b' }, true)).toBe(true);
                expect(shape.getCache('a')).not.toEqual({ a: 'a' });
                expect(shape.getCache('a')).toEqual({ b: 'b' });
            });
        });
    });
});
