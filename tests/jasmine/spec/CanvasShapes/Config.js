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

    describe('CanvasShapes.Config', function () {

        var config = CanvasShapes.Config;

        it('setting and getting values', function () {

            var a = 1,
                b = {},
                c = 'c',
                d = [];

            config.set('a', a);
            config.set('b', b);
            config.set('c', c);
            config.set('d', d);

            expect(config.get('a')).toBe(a);
            expect(config.get('b')).toBe(b);
            expect(config.get('c')).toBe(c);
            expect(config.get('d')).toBe(d);

            expect(config.get('EPSILON')).not.toBe(null);
            expect(config.get('EQUALITY_ALLOWED_ERROR')).toBe(0.0000000001);
            expect(config.get('RENDER_OFF_SCREEN')).toBe(false);
            expect(config.get('RUBBISH')).toBe(null);
        });

        it('EPSILON', function () {

            var e = config.get('EPSILON');

            expect(1.0 + e).not.toBe(1.0);
            expect(1.0 + e/2).toBe(1.0);
        });
    });
});
