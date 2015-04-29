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

    describe('CanvasShapes.Group', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8011);

                expect(
                    function () {
                        new CanvasShapes.GroupInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8006);

                expect(
                    function () {
                        new CanvasShapes.GroupAbstract();
                    }
                ).toThrow(temp);
            });

            it('can instantiate normal class', function () {

                expect(
                    function () {
                        new CanvasShapes.Group();
                    }
                ).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            var temp, group, subgroup, emptygroup, shape1, shape2, shape3,
                shape4, shape5, shape6, shape7, shape8, shape9, shape10;

            beforeEach(function () {

                group = new CanvasShapes.Group();
                subgroup = new CanvasShapes.Group();
                emptygroup = new CanvasShapes.Group();
                shape1 = new CanvasShapes.Shape();
                shape2 = new CanvasShapes.Shape();
                shape3 = new CanvasShapes.Shape();
                shape4 = new CanvasShapes.Shape();
                shape5 = new CanvasShapes.Shape();
                shape6 = new CanvasShapes.Shape();
                shape7 = new CanvasShapes.Shape();
                shape8 = new CanvasShapes.Shape();
                shape9 = new CanvasShapes.Shape();
                // not implementing CanvasShapes.ShapeInterface
                shape10 = {};

                // modifying objects to be able to find them using filter
                shape1.name = 'shape1';
                shape2.name = 'shape2';
                shape3.name = 'shape3';
                shape4.name = 'shape4';
                shape5.name = 'shape5';
                shape6.name = 'shape6';
                shape7.name = 'shape7';
                shape8.name = 'shape8';
                shape9.name = 'shape9';

                subgroup.addShapes([shape4, shape5, shape6, shape7, shape8, shape9]);
                group.addShapes([shape1, subgroup, shape2, shape3]);
            });

            it('adding not supported object', function () {

                expect(function () {
                    group.addShapes(shape10);
                }).toThrow(new CanvasShapes.Error(1010));
            });

            it('getting shapes', function () {

                expect(emptygroup.getShapes()).toEqual([]);

                expect(group.getShapes().length).toBe(4);
                expect(group.getShapes()[0]).toEqual(shape1);
                expect(group.getShapes()[2]).toEqual(shape2);
                expect(group.getShapes()[3]).toEqual(shape3);
            });

            it('getting names of each shape', function () {

                temp = group.eachShape(function () {
                    return this.name;
                });

                expect(temp).toEqual(['shape1', undefined, 'shape2', 'shape3']);
            });

            it('getting names of each shape - deep', function () {

                temp = group.eachShape(function () {
                    return this.name;
                }, undefined, true);

                expect(temp).toEqual(['shape1', undefined, ['shape4', 'shape5',
                    'shape6', 'shape7', 'shape8', 'shape9'], 'shape2', 'shape3']);
            });

            it('removing shape, which was never in the group', function () {

                temp = group.removeShapes(function () {
                    if (this.name === 'shape4') {
                        return true;
                    }
                });
                expect(temp).toBe(0);
                expect(group.getShapes().length).toBe(4);
            });

            it('removing all shapes', function () {

                temp = group.removeShapes();
                expect(temp).toBe(4);
                expect(group.getShapes().length).toBe(0);
            });

            it('removing a shape with passed parameters', function () {

                temp = group.removeShapes(function (name) {
                    if (this.name === name) {
                        return true;
                    }
                }, ['shape3']);
                expect(temp).toBe(1);
                expect(group.getShapes().length).toBe(3);
            });

            it('removing shapes with passed parameters using deep mode', function () {

                temp = group.removeShapes(function (names) {
                    if (names.indexOf(this.name) !== -1) {
                        return true;
                    }
                }, [['shape3', 'shape7', 'shape8', 'shape10']], true);
                expect(temp).toBe(3);
                expect(group.getShapes().length).toBe(3);
            });
        });

        describe('class methods', function () {

            it('sets scene interface handlers', function () {

                var group = new CanvasShapes.Group(),
                    shape1 = new CanvasShapes.Shape(),
                    shape2 = new CanvasShapes.Shape(),
                    sceneInterfaceHandlers = {
                        newLayerHandler: function () {},
                        getLayerHandler: function () {},
                        addShapeHandler: function () {}
                    };

                group.addShapes([shape1, shape2]);
                group.setSceneInterfaceHandlers(sceneInterfaceHandlers);

                expect(group.sceneInterfaceHandlers).toBe(sceneInterfaceHandlers);
                expect(group.sceneInterfaceHandlers.newLayerHandler).toBeDefined();
                expect(group.sceneInterfaceHandlers.getLayerHandler).toBeDefined();
                expect(group.sceneInterfaceHandlers.addShapeHandler).toBeDefined();
                group.eachShape(function () {
                    expect(this.sceneInterfaceHandlers).toBe(sceneInterfaceHandlers);
                    expect(this.sceneInterfaceHandlers.newLayerHandler).toBeDefined();
                    expect(this.sceneInterfaceHandlers.getLayerHandler).toBeDefined();
                    expect(this.sceneInterfaceHandlers.addShapeHandler).toBeDefined();
                });
            });

            it('renders without throwing anything', function () {

                var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    group = new CanvasShapes.Group(),
                    shape1 = new CanvasShapes.Point([30, 30]),
                    shape2 = new CanvasShapes.Point([60, 60]);

                group.addShapes([shape1, shape2]);
                expect(function () {
                    group.render(scene.getLayer());
                }).not.toThrow();
            });

            it('evaluates group coordinates properly', function () {

                var group = new CanvasShapes.Group(),
                    shape1 = new CanvasShapes.Point([30, 30]),
                    shape2 = new CanvasShapes.Point([60, 60]);

                expect(group.getCoordinates()).toEqual([0, 0, 0]);
                group.addShapes([shape1, shape2]);
                expect(group.getCoordinates()).toEqual([45, 45, 0]);
            });

            it('sets the style properly', function () {

                var group1 = new CanvasShapes.Group(),
                    group2 = new CanvasShapes.Group(),
                    shape1 = new CanvasShapes.Point([30, 30]),
                    shape2 = new CanvasShapes.Point([60, 60]),
                    shape3 = new CanvasShapes.Point([30, 30], 'circle'),
                    shape4 = new CanvasShapes.Point([60, 60], 'circle'),
                    style = new CanvasShapes.Style({
                        stroke: true,
                        fill: true
                    });

                // shapes added to group, but style not set deeply
                group1.addShapes([shape1, shape2]);
                group1.setStyle(style);
                expect(group1.getStyle()).toBe(style);
                group1.eachShape(function () {
                    expect(this.getStyle()).not.toBe(style);
                    expect(this.getStyle()).toBe(null);
                });

                // setting style deeply, but points don't have faces
                group1.setStyle(style, true);
                expect(group1.getStyle()).toBe(style);
                group1.eachShape(function () {
                    expect(this.getStyle()).not.toBe(style);
                    expect(this.getStyle()).toBe(null);
                });

                // setting style deeply, and points have faces
                group2.addShapes([shape3, shape4]);
                group2.setStyle(style, true);
                expect(group2.getStyle()).toBe(style);
                group2.eachShape(function () {
                    expect(this.getStyle()).toBe(style);
                });
            });
        });
    });
});
