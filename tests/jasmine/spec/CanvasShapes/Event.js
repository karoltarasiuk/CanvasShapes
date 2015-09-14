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

            it('can instantiate CanvasShapes.Event', function () {

                var event, dom,
                    error1 = new CanvasShapes.Error(1035),
                    error2 = new CanvasShapes.Error(1039);

                // NOT STRING
                expect(function () { new CanvasShapes.Event(); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event(1); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event({}); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event([]); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event(true); })
                    .toThrow(error1);

                // NOT DOM
                expect(function () { new CanvasShapes.Event('custom', {}); })
                    .toThrow(error2);
                expect(function () { new CanvasShapes.Event('custom', 1); })
                    .toThrow(error2);
                expect(function () { new CanvasShapes.Event('custom', []); })
                    .toThrow(error2);
                expect(function () { new CanvasShapes.Event('custom', 'dom'); })
                    .toThrow(error2);
                expect(function () { new CanvasShapes.Event('custom', true); })
                    .toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom', target: {} });
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom', target: 1 });
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom', target: [] });
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom', target: 'dom' });
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom', target: true });
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom', target: {} }, {});
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom', target: 1 }, 1);
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom', target: [] }, []);
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event(
                        { type: 'custom', target: 'dom' },
                        'dom'
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event(
                        { type: 'custom', target: true },
                        true
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        {}
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        1
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        []
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        'dom'
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        true
                    );
                }).toThrow(error2);

                // ALL GOOD
                expect(function () {
                    new CanvasShapes.Event({ type: 'custom' });
                }).not.toThrow();
                expect(function () { new CanvasShapes.Event('custom'); })
                    .not.toThrow();
                expect(function () {
                    new CanvasShapes.Event(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        }
                    );
                }).not.toThrow();
                expect(function () {
                    new CanvasShapes.Event(
                        'custom',
                        document.createElement('p')
                    );
                }).not.toThrow();
                expect(function () {
                    new CanvasShapes.Event(
                        {
                            type: 'custom',
                            target: document.createElement('span')
                        },
                        document.createElement('a')
                    );
                }).not.toThrow();

                // SECOND TARGET IS OVERWRITING THE FIRST
                dom = document.createElement('p');
                event = new CanvasShapes.Event('custom', dom);
                expect(event.target).toBe(dom);
                event = new CanvasShapes.Event(
                    { type: 'custom', target: document.createElement('span') },
                    dom
                );
                expect(event.target).toBe(dom);
            });

            it('can instantiate CanvasShapes.Event.Mouse', function () {

                var error1 = new CanvasShapes.Error(1035),
                    error2 = new CanvasShapes.Error(1039),
                    error3 = new CanvasShapes.Error(1041);

                // NOT STRING
                expect(function () { new CanvasShapes.Event.Mouse(); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event.Mouse(1); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event.Mouse({}); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event.Mouse([]); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event.Mouse(true); })
                    .toThrow(error1);

                // NOT DOM
                expect(function () {
                    new CanvasShapes.Event.Mouse('custom', {});
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse('custom', 1);
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse('custom', []);
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse('custom', 'dom');
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse('custom', true);
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse({
                        type: 'custom',
                        target: {}
                    });
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse({ type: 'custom', target: 1 });
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        { type: 'custom', target: [] }
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        { type: 'custom', target: 'dom' }
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        { type: 'custom', target: true }
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        { type: 'custom', target: {} },
                        {}
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        { type: 'custom', target: 1 },
                        1
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        { type: 'custom', target: [] },
                        []
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        { type: 'custom', target: 'dom' },
                        'dom'
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        { type: 'custom', target: true },
                        true
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        {}
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        1
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        []
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        'dom'
                    );
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Mouse(
                        {
                            type: 'custom',
                            target: document.createElement('div')
                        },
                        true
                    );
                }).toThrow(error2);

                // NOT MOUSE EVENT OR NO VALID TARGET
                expect(function () {
                    new CanvasShapes.Event.Mouse({ type: 'custom' });
                }).toThrow(error3);
                expect(function () { new CanvasShapes.Event.Mouse('custom'); })
                    .toThrow(error3);
                expect(function () { new CanvasShapes.Event.Mouse({
                    type: 'custom',
                    target: document.createElement('div')
                }); }).toThrow(error3);
                expect(function () { new CanvasShapes.Event.Mouse(
                    'custom',
                    document.createElement('p')
                ); }).toThrow(error3);
                expect(function () { new CanvasShapes.Event.Mouse({
                    type: 'custom',
                    target: document.createElement('span')
                }, document.createElement('a') ); }).toThrow(error3);

                // ALL GOOD
                expect(function () { new CanvasShapes.Event.Mouse({
                    type: 'click',
                    pageX: 100,
                    pageY: 100,
                    target: document.createElement('span')
                }); }).not.toThrow();
                expect(function () { new CanvasShapes.Event.Mouse({
                    type: 'click',
                    pageX: 100,
                    pageY: 100
                }, document.createElement('p')); }).not.toThrow();
                expect(function () { new CanvasShapes.Event.Mouse({
                    type: 'click',
                    pageX: 100,
                    pageY: 100,
                    target: document.createElement('div')
                }, document.createElement('a')); }).not.toThrow();
            });

            it('can instantiate CanvasShapes.Event.Input', function () {

                var error1 = new CanvasShapes.Error(1035),
                    error2 = new CanvasShapes.Error(1039);

                // NOT STRING
                expect(function () { new CanvasShapes.Event.Input(); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event.Input(1); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event.Input({}); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event.Input([]); })
                    .toThrow(error1);
                expect(function () { new CanvasShapes.Event.Input(true); })
                    .toThrow(error1);

                // NOT DOM
                expect(function () {
                    new CanvasShapes.Event.Input('custom', {});
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Input('custom', 1);
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Input('custom', []);
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Input('custom', 'dom');
                }).toThrow(error2);
                expect(function () {
                    new CanvasShapes.Event.Input('custom', true);
                }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: {}
                }); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: 1
                }); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: []
                }); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: 'dom'
                }); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: true
                }); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: {}
                }, {}); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: 1
                }, 1); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: []
                }, []); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: 'dom'
                }, 'dom'); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: true
                }, true); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: document.createElement('div')
                }, {}); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: document.createElement('div')
                }, 1); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: document.createElement('div')
                }, []); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: document.createElement('div')
                }, 'dom'); }).toThrow(error2);
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: document.createElement('div')
                }, true); }).toThrow(error2);

                // ALL GOOD
                expect(function () {
                    new CanvasShapes.Event.Input({ type: 'custom' });
                }).not.toThrow();
                expect(function () {
                    new CanvasShapes.Event.Input('custom');
                }).not.toThrow();
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: document.createElement('div')
                }); }).not.toThrow();
                expect(function () { new CanvasShapes.Event.Input(
                    'custom',
                    document.createElement('p')
                ); }).not.toThrow();
                expect(function () { new CanvasShapes.Event.Input({
                    type: 'custom',
                    target: document.createElement('span')
                }, document.createElement('a') ); }).not.toThrow();
            });
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
                    initializeListeners : undefined
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
                    initializeListeners : temp.initializeListeners
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
                    initializeListeners : temp.initializeListeners
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
                    initializeListeners : undefined
                });
            });

            it('CanvasShapes.Event.initializeListeners', function () {

                var error1 = new CanvasShapes.Error(1038),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    });

                expect(function () {CanvasShapes.Event.initializeListeners(); })
                    .toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initializeListeners(1);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initializeListeners(true);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initializeListeners('string');
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initializeListeners([]);
                }).toThrow(error1);
                expect(function () {
                    CanvasShapes.Event.initializeListeners({});
                }).toThrow(error1);

                expect(function () {
                    CanvasShapes.Event.initializeListeners(scene);
                }).not.toThrow();
            });

            it ('CanvasShapes.Event.getInstance', function () {

                var error1 = new CanvasShapes.Error(1040),
                    error2 = new CanvasShapes.Error(1039);

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

                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: {}
                }); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: []
                }); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: 1
                }); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: 'string'
                }); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: true
                }); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: function () {}
                }); }).toThrow(error2);

                expect(function () {
                    CanvasShapes.Event.getInstance({ type: 'custom' }, {});
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.getInstance({ type: 'custom' }, []);
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.getInstance({ type: 'custom' }, 1);
                }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance(
                    { type: 'custom' },
                    'string');
                }).toThrow(error2);
                expect(function () {
                    CanvasShapes.Event.getInstance({ type: 'custom' }, true);
                }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance(
                    { type: 'custom' },
                    function () {});
                }).toThrow(error2);

                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, {}); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, []); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, 1); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, 'string'); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, true); }).toThrow(error2);
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, function () {}); }).toThrow(error2);

                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }); }).not.toThrow();
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom' },
                    document.createElement('div'));
                }).not.toThrow();
                expect(function () { CanvasShapes.Event.getInstance({
                    type: 'custom',
                    target: document.createElement('div')
                }, document.createElement('div')); }).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            it('initialize()', function () {

                var event = CanvasShapes.Event.getInstance({ type: 'custom' }),
                    error1 = new CanvasShapes.Error(1035),
                    error2 = new CanvasShapes.Error(1039);

                expect(function () { event.initialize(); }).toThrow(error1);
                expect(function () { event.initialize(1); }).toThrow(error1);
                expect(function () { event.initialize(true); }).toThrow(error1);
                expect(function () { event.initialize({}); }).toThrow(error1);
                expect(function () { event.initialize([]); }).toThrow(error1);
                expect(function () { event.initialize(function () {}); })
                    .toThrow(error1);

                expect(function () {
                    event.initialize({ type: 'custom', target: {} });
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom', target: [] });
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom', target: 1 });
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom', target: 'string' });
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom', target: true });
                }).toThrow(error2);
                expect(function () { event.initialize({
                    type: 'custom',
                    target: function () {}
                }); }).toThrow(error2);

                expect(function () {
                    event.initialize({ type: 'custom' }, {});
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom' }, []);
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom' }, 1);
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom' }, 'string');
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom' }, true);
                }).toThrow(error2);
                expect(function () {
                    event.initialize({ type: 'custom' }, function () {});
                }).toThrow(error2);

                expect(function () { event.initialize({
                    type: 'custom',
                    target: document.createElement('div')
                }, {}); }).toThrow(error2);
                expect(function () { event.initialize({
                    type: 'custom',
                    target: document.createElement('div')
                }, []); }).toThrow(error2);
                expect(function () { event.initialize({
                    type: 'custom',
                    target: document.createElement('div')
                }, 1); }).toThrow(error2);
                expect(function () { event.initialize({
                    type: 'custom',
                    target: document.createElement('div')
                }, 'string'); }).toThrow(error2);
                expect(function () { event.initialize({
                    type: 'custom',
                    target: document.createElement('div')
                }, true); }).toThrow(error2);
                expect(function () { event.initialize({
                    type: 'custom',
                    target: document.createElement('div')
                }, function () {}); }).toThrow(error2);
            });

            it('getType()', function () {
                var event = CanvasShapes.Event.getInstance({ type: 'custom' });
                expect(event.getType()).toBe('custom');
            });
        });
    });
});
