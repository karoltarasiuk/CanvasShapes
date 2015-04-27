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
        ];

    require(specs, function () {
        window.onload();
    });
});
