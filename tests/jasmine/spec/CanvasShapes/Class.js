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

    describe('CanvasShapes.Class', function () {

        var A = function () {},
            B = function () {},
            C = function () {},
            Temp = function () {};

        CanvasShapes.Class.extend(Temp.prototype, {
            className: 'Temp',
            temp: function () { return 'temp'; }
        });

        CanvasShapes.Class.extend(A.prototype, {
            className: 'A',
            a: function () { return 'a'; }
        });

        CanvasShapes.Class.extend(B.prototype, Temp.prototype, {
            className: 'B',
            b: function () { return 'b'; },
            temp: function () { return 'b'; }
        });

        CanvasShapes.Class.extend(C.prototype, B.prototype, A.prototype, {
            className: 'C',
            a: function () { return 'c'; },
            b: function () { return 'c'; },
            c: function () { return 'c'; },
            temp: function () { return 'c'; }
        });

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                expect(
                    function () {
                        new CanvasShapes.ClassInterface();
                    }
                ).toThrow(new CanvasShapes.Error(8013));
            });

            it('cannot instantiate an abstract', function () {

                expect(
                    function () {
                        new CanvasShapes.ClassAbstract();
                    }
                ).toThrow(new CanvasShapes.Error(8005));
            });

            it('can instantiate normal class', function () {

                expect(
                    function () {
                        new CanvasShapes.Class();
                    }
                ).not.toThrow();
            });
        });

        describe('extending', function () {

            it('copies properties correctly', function () {

                var temp = new Temp(),
                    a = new A(),
                    b = new B(),
                    c = new C();

                // methods
                expect(temp.className).toBe('Temp');
                expect(a.className).toBe('A');
                expect(b.className).toBe('B');
                expect(c.className).toBe('C');
            });

            it('copies methods correctly', function () {

                var temp = new Temp(),
                    a = new A(),
                    b = new B(),
                    c = new C();

                // methods
                expect(temp.temp()).toBe('temp');
                expect(a.a()).toBe('a');
                expect(b.b()).toBe('b');
                expect(b.temp()).toBe('b');
                expect(c.a()).toBe('c');
                expect(c.b()).toBe('c');
                expect(c.c()).toBe('c');
                expect(c.temp()).toBe('c');
            });
        });

        describe('method `is()`', function () {

            it('correctly assess the type', function () {

                var classInstance = new CanvasShapes.Class(),
                    classInstance2 = new CanvasShapes.Class('SomeOtherClass');
                    temp = new Temp(),
                    a = new A(),
                    b = new B(),
                    c = new C();

                // true
                expect(temp.is('Temp')).toBe(true);
                expect(a.is('A')).toBe(true);
                expect(b.is('B')).toBe(true);
                expect(b.is('Temp')).toBe(true);
                expect(c.is('A')).toBe(true);
                expect(c.is('B')).toBe(true);
                expect(c.is('C')).toBe(true);
                expect(c.is('Temp')).toBe(true);
                expect(classInstance.is('CanvasShapes.Class')).toBe(true);
                expect(classInstance.is('CanvasShapes.ClassAbstract')).toBe(true);
                expect(classInstance.is('CanvasShapes.ClassInterface')).toBe(true);
                expect(classInstance2.is('SomeOtherClass')).toBe(true);

                // false
                expect(temp.is('A')).toBe(false);
                expect(temp.is('B')).toBe(false);
                expect(temp.is('C')).toBe(false);
                expect(a.is('B')).toBe(false);
                expect(a.is('C')).toBe(false);
                expect(a.is('Temp')).toBe(false);
                expect(b.is('A')).toBe(false);
                expect(b.is('C')).toBe(false);
            });
        });

        describe('UUID', function () {

            it('gets and sets UUID properly', function () {

                var regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                    classInstance = new CanvasShapes.Class();

                expect(regex.test(classInstance.getUUID())).toBe(true);
            });

            it('populates objects registry properly', function () {

                var classInstance = new CanvasShapes.Class();
                expect(CanvasShapes.Class.getObject(classInstance.getUUID())).toBe(classInstance);
            });
        });
    });
});
