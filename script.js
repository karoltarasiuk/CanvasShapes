require.config({
    paths: {
        lodash: 'lib/lodash.min',
        JSONChecker: 'lib/JSONChecker',
        uuid: 'lib/uuid',
        CanvasShapes: 'build/CanvasShapes'
    }
});

require([
    'lodash',
    'CanvasShapes'
], function (
    _,
    CanvasShapes
) {window.CanvasShapes = CanvasShapes;
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
        line = new CanvasShapes.Line([point1, point2]),
        polygon1 = new CanvasShapes.Polygon([point3, point4, point2, point5]),
        polygon2 = new CanvasShapes.Polygon([point12, point14, point15, point13]),
        square = new CanvasShapes.Square([point6, point7, point8]),
        rectangle = new CanvasShapes.Rectangle([point9, point10, point11]),
        strokeStyle = new CanvasShapes.Style({
            stroke: true
        }),
        fillStyle = new CanvasShapes.Style({
            fill: true
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
    group.addShapes([line, square, rectangle]);
    renderer.addShapes([point16, group, polygon1, polygon2]);

    // those polygons must be on separate layers
    scene3.addShape(polygon1, scene3.newLayer());
    scene6.addShape(polygon1, scene6.newLayer());
    scene3.addShape(polygon2, scene3.newLayer());
    scene6.addShape(polygon2, scene6.newLayer());

    // setting relative rendering
    square.setRelativeRendering(true);
    polygon1.setRelativeRendering(true);

    // styling shapes
    group.setStyle(strokeStyle, true);
    polygon1.setStyle(strokeStyle, true);
    polygon2.setStyle(strokeStyle, true);
    square.setStyle(fillStyle);
    point1.setFace('circle', 10);
    point16.setFace('circle', 10);

    // rendering all the shapes
    // renderer.render();

    CanvasShapes.Renderer.start();
    console.log('START ANIMATION');
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
                    }, function () {
                        console.log('STOP ANIMATION');
                        CanvasShapes.Renderer.stop();
                    });
                });
            });
        });
    });
});
