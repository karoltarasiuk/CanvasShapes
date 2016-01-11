require.config({
    paths: {
        jasmine: 'lib/jasmine-2.0.0/jasmine',
        jasminehtml: 'lib/jasmine-2.0.0/jasmine-html',
        boot: 'lib/jasmine-2.0.0/boot',
        JSONChecker: 'lib/JSONChecker',
        CanvasShapes: 'src/CanvasShapes',
    },
    shim: {
        jasmine: {
            exports: 'jasmineRequire'
        },
        jasminehtml: {
            deps: ['jasmine'],
            exports: 'jasmineRequire'
        },
        boot: {
            deps: ['jasmine', 'jasminehtml'],
            exports: 'jasmineRequire'
        }
    }
});

require(['boot'], function () {

    var specs = [
            'spec/CanvasShapes/Tools',
            'spec/CanvasShapes/GeometryTools',
            'spec/CanvasShapes/Config',
            'spec/CanvasShapes/Class',
            'spec/CanvasShapes/Error',
            'spec/CanvasShapes/Event',
            'spec/CanvasShapes/Interaction',
            'spec/CanvasShapes/SceneLayer',
            'spec/CanvasShapes/Scene',
            'spec/CanvasShapes/Renderer',
            'spec/CanvasShapes/Rendering',
            'spec/CanvasShapes/Style',
            'spec/CanvasShapes/Coordinates',
            'spec/CanvasShapes/AnimationFrame',
            'spec/CanvasShapes/Animation',
            'spec/CanvasShapes/Shape',
            'spec/CanvasShapes/Group',
            'spec/CanvasShapes/shapes/primitives/Polygon',
            'spec/CanvasShapes/shapes/primitives/Quadrilateral',
            'spec/CanvasShapes/shapes/primitives/Triangle',
            'spec/CanvasShapes/shapes/primitives/Rectangle',
            'spec/CanvasShapes/shapes/primitives/Square',
            'spec/CanvasShapes/shapes/primitives/Point',
            'spec/CanvasShapes/shapes/primitives/Line',
            'spec/CanvasShapes/shapes/primitives/Arc',
            'spec/CanvasShapes/shapes/primitives/Circle',
        ];

    require(specs, function () {
        window.onload();
    });
});
