require.config({
    paths: {
        jasmine: 'lib/jasmine-2.0.0/jasmine',
        jasminehtml: 'lib/jasmine-2.0.0/jasmine-html',
        boot: 'lib/jasmine-2.0.0/boot',
        lodash: 'lib/lodash.min',
        ObjectComparer: 'lib/ObjectComparer',
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
            'spec/CanvasShapes/Class',
            'spec/CanvasShapes/Config',
            'spec/CanvasShapes/Error',
            'spec/CanvasShapes/Group',
            'spec/CanvasShapes/Renderer',
            'spec/CanvasShapes/Rendering',
            'spec/CanvasShapes/Scene',
            'spec/CanvasShapes/SceneLayer',
            'spec/CanvasShapes/Shape',
            'spec/CanvasShapes/Style',
            'spec/CanvasShapes/Tools',
            'spec/CanvasShapes/shapes/primitives/Arc',
            'spec/CanvasShapes/shapes/primitives/Circle',
            'spec/CanvasShapes/shapes/primitives/Line',
            'spec/CanvasShapes/shapes/primitives/Point',
            'spec/CanvasShapes/shapes/primitives/Polygon',
        ];

    require(specs, function () {
        window.onload();
    });
});
