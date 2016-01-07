/*global define, describe, it, expect*/
define([
    "lodash",
    "CanvasShapes"
], function(
    _,
    CanvasShapes
) {

    describe('CanvasShapes.Event', function () {

        describe('initialisation', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8020);

                expect(
                    function () {
                        new CanvasShapes.EventInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8019);

                expect(
                    function () {
                        new CanvasShapes.EventAbstract();
                    }
                ).toThrow(temp);
            });

            var i,
                eventClasses = {
                    "CanvasShapes.Event": CanvasShapes.Event,
                    "CanvasShapes.Event.Mouse": CanvasShapes.Event.Mouse,
                    "CanvasShapes.Event.Input": CanvasShapes.Event.Input
                },
                process = function (EventClass) {

                    var event, dom, span,
                        div = document.createElement('div'),
                        scene = new CanvasShapes.Scene({
                            element: div,
                            width: 100,
                            height: 100
                        }),
                        error1 = new CanvasShapes.Error(1035),
                        error2 = new CanvasShapes.Error(1056),
                        error3 = new CanvasShapes.Error(1039);

                    // NOT STRING
                    expect(function () { new EventClass(); })
                        .toThrow(error1);
                    expect(function () { new EventClass(1); })
                        .toThrow(error1);
                    expect(function () { new EventClass({}); })
                        .toThrow(error1);
                    expect(function () { new EventClass([]); })
                        .toThrow(error1);
                    expect(function () { new EventClass(true); })
                        .toThrow(error1);

                    // NOT SCENE
                    expect(function () { new EventClass('custom'); })
                        .toThrow(error2);
                    expect(function () { new EventClass('custom', {}); })
                        .toThrow(error2);
                    expect(function () { new EventClass('custom', 1); })
                        .toThrow(error2);
                    expect(function () { new EventClass('custom', []); })
                        .toThrow(error2);
                    expect(function () { new EventClass('custom', 'dom'); })
                        .toThrow(error2);
                    expect(function () { new EventClass('custom', true); })
                        .toThrow(error2);

                    // TARGET IS NOT DOM
                    expect(function () {
                        new EventClass({ type: 'custom', target: {} });
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass({ type: 'custom', target: 1 });
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass({ type: 'custom', target: [] });
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass({ type: 'custom', target: 'dom' });
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass({ type: 'custom', target: true });
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass({ type: 'custom', target: {} }, {});
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass({ type: 'custom', target: 1 }, 1);
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass({ type: 'custom', target: [] }, []);
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass(
                            { type: 'custom', target: 'dom' },
                            'dom'
                        );
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass(
                            { type: 'custom', target: true },
                            true
                        );
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass(
                            {
                                type: 'custom',
                                target: document.createElement('div')
                            },
                            {}
                        );
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass(
                            {
                                type: 'custom',
                                target: document.createElement('div')
                            },
                            1
                        );
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass(
                            {
                                type: 'custom',
                                target: document.createElement('div')
                            },
                            []
                        );
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass(
                            {
                                type: 'custom',
                                target: document.createElement('div')
                            },
                            'dom'
                        );
                    }).toThrow(error2);
                    expect(function () {
                        new EventClass(
                            {
                                type: 'custom',
                                target: document.createElement('div')
                            },
                            true
                        );
                    }).toThrow(error2);

                    // ALL GOOD
                    expect(function () {
                        new EventClass({ type: 'custom' }, scene);
                    }).not.toThrow();
                    expect(function () { new EventClass('custom', scene); })
                        .not.toThrow();
                    expect(function () {
                        new EventClass(
                            {
                                type: 'custom',
                                target: document.createElement('div')
                            },
                            scene
                        );
                    }).not.toThrow();
                    expect(function () {
                        new EventClass(
                            'custom',
                            scene,
                            document.createElement('p')
                        );
                    }).not.toThrow();
                    expect(function () {
                        new EventClass(
                            {
                                type: 'custom',
                                target: document.createElement('span')
                            },
                            scene,
                            document.createElement('a')
                        );
                    }).not.toThrow();

                    // TARGET PRECEDENCE
                    dom = document.createElement('p');
                    span = document.createElement('span');
                    event = new EventClass('custom', scene, dom);
                    expect(event.target).toBe(dom);
                    event = new EventClass('custom', scene);
                    expect(event.target).toBe(scene.dom);
                    event = new EventClass(
                        { type: 'custom', target: span },
                        scene
                    );
                    expect(event.target).toBe(div);
                    event = new EventClass(
                        { type: 'custom', target: span },
                        scene,
                        dom
                    );
                    expect(event.target).toBe(dom);
                };

            for (i in eventClasses) {
                it('can instantiate CanvasShapes.Event based classes: ' + i, function () {
                    process(eventClasses[i]);
                });
            }
        });

        describe('static methods', function () {

            it('CanvasShapes.Event.getCategory', function () {

                var temp,
                    error1 = new CanvasShapes.Error(1040);

                expect(function () { CanvasShapes.Event.getCategory(); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getCategory(1); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getCategory([]); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getCategory({}); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getCategory(true); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getCategory(
                    function () {}
                ); }).toThrow(error1);

                expect(CanvasShapes.Event.getCategory('whatever')).toEqual({
                    category: 'custom',
                    baseClass : CanvasShapes.Event,
                    eventsObject : undefined,
                    initialiseListeners : undefined
                });

                temp = CanvasShapes.Event.getCategory('click');
                expect(temp).toEqual({
                    category: 'mouse',
                    baseClass : CanvasShapes.Event.Mouse,
                    eventsObject : {
                        CLICK: 'click',
                        MOUSEDOWN: 'mousedown',
                        MOUSEUP: 'mouseup',
                        MOUSEOVER: 'mouseover',
                        MOUSEOUT: 'mouseout',
                        MOUSEMOVE: 'mousemove',
                        CONTEXTMENU: 'contextmenu',
                        DBLCLICK: 'dblclick'
                    },
                    initialiseListeners : temp.initialiseListeners
                });

                temp = CanvasShapes.Event.getCategory('keydown');
                expect(temp).toEqual({
                    category: 'input',
                    baseClass : CanvasShapes.Event.Input,
                    eventsObject : {
                        KEYDOWN: 'keydown',
                        KEYUP: 'keyup',
                        KEYPRESS: 'keypress'
                    },
                    initialiseListeners : temp.initialiseListeners
                });
            });

            it('CanvasShapes.Event.eventTypeExists', function () {

                expect(CanvasShapes.Event.eventTypeExists()).toBe(false);
                expect(CanvasShapes.Event.eventTypeExists(1)).toBe(false);
                expect(CanvasShapes.Event.eventTypeExists(true)).toBe(false);
                expect(CanvasShapes.Event.eventTypeExists([])).toBe(false);
                expect(CanvasShapes.Event.eventTypeExists({})).toBe(false);
                expect(CanvasShapes.Event.eventTypeExists('custom'))
                    .toBe(false);

                expect(CanvasShapes.Event.eventTypeExists('click')).toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('mousedown'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('mouseup'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('mouseover'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('mouseout'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('mousemove'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('contextmenu'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('dblclick'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('keydown'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('keyup'))
                    .toBe(true);
                expect(CanvasShapes.Event.eventTypeExists('keypress'))
                    .toBe(true);
            });

            it('CanvasShapes.Event.registerCategory', function () {

                var error1 = new CanvasShapes.Error(1030),
                    error2 = new CanvasShapes.Error(1032),
                    error3 = new CanvasShapes.Error(1031),
                    error4 = new CanvasShapes.Error(1033),
                    error5 = new CanvasShapes.Error(1034);

                expect(function () { CanvasShapes.Event.registerCategory(); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.registerCategory(1); })
                    .toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.registerCategory(true);
                }).toThrow(error1);
                expect(function () { CanvasShapes.Event.registerCategory([]); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.registerCategory({}); })
                    .toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.registerCategory(function () {});
                }).toThrow(error1);
                expect(function () { CanvasShapes.Event.registerCategory(''); })
                    .toThrow(error1);

                expect(function () {
                    CanvasShapes.Event.registerCategory('a');
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.registerCategory('a', 1);
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.registerCategory('a', true);
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.registerCategory('a', []);
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.registerCategory('a', {});
                }).toThrow(error2);

                expect(function () {CanvasShapes.Event.registerCategory(
                    'mouse',
                    function () {}
                ); }).toThrow(error3);
            });

            it('CanvasShapes.Event.deregisterCategory', function () {

                var error1 = new CanvasShapes.Error(1028),
                    error2 = new CanvasShapes.Error(1029);

                expect(function () {
                    CanvasShapes.Event.deregisterCategory();
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.deregisterCategory(1);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.deregisterCategory(true);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.deregisterCategory([]);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.deregisterCategory({});
                }).toThrow(error1);

                expect(function () {
                    CanvasShapes.Event.deregisterCategory('');
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.deregisterCategory('not-existing');
                }).toThrow(error2);

                expect(function () {
                    CanvasShapes.Event.deregisterCategory('mouse');
                }).not.toThrow();
                expect(CanvasShapes.Event.getCategory('click')).toEqual({
                    category: 'custom',
                    baseClass : CanvasShapes.Event,
                    eventsObject : undefined,
                    initialiseListeners : undefined
                });
            });

            it('CanvasShapes.Event.initialiseListeners', function () {

                var error1 = new CanvasShapes.Error(1038),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    });

                expect(function () {CanvasShapes.Event.initialiseListeners(); })
                    .toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initialiseListeners(1);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initialiseListeners(true);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initialiseListeners('string');
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initialiseListeners([]);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initialiseListeners({});
                }).toThrow(error1);

                expect(function () {
                    CanvasShapes.Event.initialiseListeners(scene);
                }).not.toThrow();
            });

            it ('CanvasShapes.Event.getInstance', function () {

                var error1 = new CanvasShapes.Error(1040),
                    error2 = new CanvasShapes.Error(1039),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    });

                expect(function () { CanvasShapes.Event.getInstance(); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getInstance(1); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getInstance(true); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getInstance({}); })
                    .toThrow(error1);
                expect(function () { CanvasShapes.Event.getInstance([]); })
                    .toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.getInstance(function () {});
                }).toThrow(error1);

                expect(function () {
                    CanvasShapes.Event.getInstance({ type: 'custom' }, scene, {});
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.getInstance({ type: 'custom' }, scene, []);
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.getInstance({ type: 'custom' }, scene, 1);
                }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance(
                    { type: 'custom' },
                    scene,
                    'string');
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.getInstance({ type: 'custom' }, scene, true);
                }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance(
                    { type: 'custom' },
                    scene,
                    function () {});
                }).toThrow(error2);

                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, scene, {}); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, scene, []); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, scene, 1); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, scene, 'string'); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, scene, true); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, scene, function () {}); }).toThrow(error2);

                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, scene); }).not.toThrow();
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom'
                }, scene, document.createElement('div')); }).not.toThrow();
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, scene, document.createElement('div')); }).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            it('initialise()', function () {

                // this is tested in .getInstance and constructors
            });

            it('getType()', function () {

                var scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    event = CanvasShapes.Event.getInstance(
                        { type: 'custom' },
                        scene
                    );

                expect(event.getType()).toBe('custom');
            });
        });
    });
});
