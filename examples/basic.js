require.config({
    paths: {
        CanvasShapes: '../build/CanvasShapes'
    }
});

require([
    'CanvasShapes'
], function (
    CanvasShapes
) {
    var renderer = CanvasShapes.init(),
        group = new CanvasShapes.Group(),
        point1 = new CanvasShapes.Point([10, 10]),
        point2 = new CanvasShapes.Point([90, 90], 'circle'),
        point3 = new CanvasShapes.Point([20, 20]),
        point4 = new CanvasShapes.Point([80, 20], 'circle'),
        point5 = new CanvasShapes.Point([20, 80]),
        point6 = new CanvasShapes.Point([30, 30]),
        point7 = new CanvasShapes.Point([60, 60]),
        point8 = new CanvasShapes.Point([90, 30]),
        point9 = new CanvasShapes.Point([10, 10]),
        point10 = new CanvasShapes.Point([80, 80]),
        point11 = new CanvasShapes.Point([90, 70]),
        point12 = new CanvasShapes.Point([10, 80]),
        point13 = new CanvasShapes.Point([10, 90]),
        point14 = new CanvasShapes.Point([90, 70]),
        point15 = new CanvasShapes.Point([110, 100]),
        point16 = new CanvasShapes.Point([0, 0]),
        arc1 = new CanvasShapes.Arc(
            [[0, 0], [100, 0], [100, 100]],
            70
        ),
        circle1 = new CanvasShapes.Circle([95, 95], 5),
        line = new CanvasShapes.Line([point1, point2]),
        polygon1 = new CanvasShapes.Polygon([point3, point4, point2, point5]),
        polygon2 = new CanvasShapes.Polygon([point12, point14, point15, point13]),
        square = new CanvasShapes.Square([point6, point7, point8]),
        rectangle = new CanvasShapes.Rectangle([point9, point10, point11]),
        bezierCurve = new CanvasShapes.BezierCurve([[0, 0], [50, 0], [0, 100], [100, 100]]),
        quadraticCurve = new CanvasShapes.BezierCurve([[0, 0], [100, 0], [100, 100]]),
        megaCurve = new CanvasShapes.BezierCurve([
            [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50], [100, 75],
            [0, 75], [0, 100], [50, 100]
        ]),
        relation = new CanvasShapes.Relation((function () {

            // taking care of rounding problems
            var func2FirstNotFalse = false, func3FirstNotFalse = false;

            return function (x) {

                var func1, func2, func3,
                    width = 100,
                    a = Math.floor(width / 2),
                    b = Math.floor(width / 2),
                    r = Math.floor(width / 4);

                func1 = x;

                // circle equation: (x - a)^2 + (y - b)^2 = r^2
                // it can be plotted using 2 functions
                func2 = Math.sqrt(r * r - (x - a) * (x - a)) + b;
                if (!Number.isFinite(func2)) {
                    func2 = false;
                    if (func2FirstNotFalse) {
                        func2FirstNotFalse = false;
                        func2 = 50;
                    }
                } else if (!func2FirstNotFalse) {
                    func2FirstNotFalse = true;
                    func2 = 50;
                }
                func3 = -Math.sqrt(r * r - (x - a) * (x - a)) + b;
                if (!Number.isFinite(func3)) {
                    func3 = false;
                    if (func3FirstNotFalse) {
                        func3FirstNotFalse = false;
                        func3 = 50;
                    }
                } else if (!func3FirstNotFalse) {
                    func3FirstNotFalse = true;
                    func3 = 50;
                }

                return [func1, func2, func3];
            };
        })()),
        strokeStyle = new CanvasShapes.Style({
            strokeStyle: 'black'
        }),
        strokeStyle2 = new CanvasShapes.Style({
            strokeStyle: 'black',
            lineWidth: 5
        }),
        strokeStyle3 = new CanvasShapes.Style({
            strokeStyle: 'blue',
            lineWidth: 5
        }),
        strokeStyle4 = new CanvasShapes.Style({
            strokeStyle: 'pink',
            lineWidth: 5
        }),
        fillStyle = new CanvasShapes.Style({
            fillStyle: 'orange'
        }),
        relationStyle = new CanvasShapes.Style({
            strokeStyle: 'orange',
            lineWidth: 3
        }),
        scene3 = new CanvasShapes.Scene({ id: 'scene3', width: 300, height: 300 }),
        scene1, scene2, scene4, scene5, scene6;

    scene1 = renderer.addScene({ id: 'scene1', width: 100, height: 100 });
    scene2 = renderer.addScene({ id: 'scene2', width: 200, height: 200 });
    renderer.addScene(scene3);
    scene4 = renderer.addScene({ id: 'scene4', width: 100, height: 200 });
    scene5 = renderer.addScene({ id: 'scene5', width: 150, height: 200 });
    scene6 = renderer.addScene({ id: 'scene6', width: 300, height: 200 });

    // adding all shapes
    group.addShapes([square]);
    renderer.addShapes([line, rectangle, circle1, arc1, point16, group, polygon1, polygon2]);

    // those polygons must be on separate layers
    scene3.newLayer(polygon1);
    scene6.newLayer(polygon1);
    // another way of doing exactly the same
    scene3.addShape(polygon2, scene3.newLayer());
    scene6.addShape(polygon2, scene6.newLayer());
    // circle1 on a new layer in any scene
    renderer.addShapes([circle1], 'new');
    // curves on a default layer in any scene
    renderer.addShapes([bezierCurve, quadraticCurve, megaCurve, relation]);

    // setting relative rendering
    square.setRelativeRendering(true);
    polygon1.setRelativeRendering(true);
    point16.setRelativeRendering(true);
    arc1.setRelativeRendering(true);
    circle1.setRelativeRendering(true);
    bezierCurve.setRelativeRendering(true);
    quadraticCurve.setRelativeRendering(true);
    megaCurve.setRelativeRendering(true);
    relation.setRelativeRendering(true);

    // styling shapes
    strokeStyle.addToShapes([
        polygon1, polygon2, arc1, circle1, line, rectangle
    ]);
    strokeStyle2.addToShapes([bezierCurve]);
    strokeStyle3.addToShapes([quadraticCurve]);
    strokeStyle4.addToShapes([megaCurve]);
    fillStyle.addToShapes([square]);
    relationStyle.addToShapes(relation);
    point1.setFace('circle', 10);
    point16.setFace('circle', 10);

    // rendering all the shapes once
    // renderer.render();

    // starting animation loop
    CanvasShapes.Renderer.start();
    point16.move(500, [100, 100], function () {
        point16.move(500, [100, 0], function () {
            point16.move(500, [0, 100], function () {
                point16.move(500, [0, 50], function () {
                    point16.move(2000, function (coords, totalTime, curTime) {
                        var ratio;
                        if (curTime >= totalTime) {
                            coords[0] = 100;
                            coords[1] = 50;
                        } else {
                            ratio = (curTime / totalTime) * 100;
                            coords[0] = ratio;
                            ratio = ratio/100 * (2 * Math.PI);
                            coords[1] = Math.sin(ratio) * 50 + 50;
                        }
                        return coords;
                    }, function () {console.log('POINT MOVED');
                        CanvasShapes.Renderer.stop();
                    });
                });
            });
        });
    });
    arc1.move(1200, [[-50, 80], [80, 80], [80, 150]], function () {console.log('ARC 1 MOVED');
        arc1.move(1200, [[-50, 60], [60, 60], [60, 150]], function () {console.log('ARC 2 MOVED');
            arc1.move(1200, [[-50, 50], [50, 50], [50, 150]], function () {
                console.log('ARC 3 MOVED');
            });
        });
    });
    circle1.move(1700, [5, 50], function () {console.log('CIRCLE 1 MOVED');
        circle1.move(1700, [5, 95], function () {
            circle1.move(0, { x: 40, y: -40 }, function () {
                console.log('CIRCLE 2 MOVED');
            });
        });
    });
    square.move(3500, [[80, 90], [90, 80], [100, 90], [90, 100]], function () {
        console.log('SQUARE MOVED');
    });
    line.move(3500, [[90, 10], [10, 90]], function () {
        console.log('LINE MOVED');
    });
    rectangle.move(3500, [[20, 20], [90, 90], [100, 80], [30, 10]], function () {
        console.log('RECTANGLE MOVED');
    });
    polygon1.move(3500, [[50, 50], [70, 30], [50, 70], [30, 30]], function () {
        console.log('POLYGON 1 MOVED');
    });
    polygon2.move(3500, { x: 20, y: 10 }, function () {
        console.log('POLYGON 2 MOVED');
    });

    fillStyle.animate(3500, {
        fillStyle: 'green'
    }, function () {
        console.log('FILL STYLE CHANGED');
    });

    strokeStyle.animate(3500, {
        strokeStyle: 'red'
    }, function () {
        console.log('STROKE STYLE CHANGED');
    });

    setInterval(function () {
        document.getElementById('fps').getElementsByClassName('fps')[0].innerHTML =
            CanvasShapes.Renderer.getFPS();
    }, 100);

    // exposing CanvasShapes to public context for debugging purposes
    window.CanvasShapes = CanvasShapes;
});
