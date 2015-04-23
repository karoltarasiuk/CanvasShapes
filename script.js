require.config({
    paths: {
        lodash: 'lib/lodash.min',
        JSONChecker: 'lib/JSONChecker.v1.1.0',
        CanvasShapes: 'build/CanvasShapes'
    }
});

require([
    'lodash',
    'CanvasShapes'
], function (
    _,
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
        line = new CanvasShapes.Line([point1, point2]),
        polygon = new CanvasShapes.Polygon([point3, point4, point2, point5]),
        square = new CanvasShapes.Square([point6, point7, point8]),
        rectangle = new CanvasShapes.Rectangle([point9, point10, point11]),
        strokeStyle = new CanvasShapes.Style({
            stroke: true
        }),
        fillStyle = new CanvasShapes.Style({
            fill: true
        });

    renderer.addScene({ id: 'scene1', width: 100, height: 100 });
    renderer.addScene({ id: 'scene2', width: 200, height: 200, relativeRendering: true });
    renderer.addScene({ id: 'scene3', width: 300, height: 300, relativeRendering: true });
    renderer.addScene({ id: 'scene4', width: 100, height: 200, relativeRendering: true });
    renderer.addScene({ id: 'scene5', width: 150, height: 200, relativeRendering: true });
    renderer.addScene({ id: 'scene6', width: 300, height: 200, relativeRendering: true });

    group.addShapes([line, polygon, square, rectangle]);
    group.setStyle(strokeStyle, true);
    square.setStyle(fillStyle);
    point1.setFace('circle', 10);
    renderer.render(group);
});
