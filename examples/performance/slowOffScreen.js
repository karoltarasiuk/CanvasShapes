require.config({
    paths: {
        CanvasShapes: '../../build/CanvasShapes'
    }
});

require([
    'CanvasShapes'
], function (
    CanvasShapes
) {
    var Showcase = (function () {

        Showcase = function (width, height, domId) {
            this.width = width;
            this.height = height;
            this.domId = domId;
            this.renderer = CanvasShapes.init();
            this.setupScene();
            this.createObjects();
            this.addAllShapes();
        };

        Showcase.prototype.setupScene = function () {

            this.$scene = $("#" + this.domId).css({
                width: this.width,
                height: this.height
            });

            this.scene = new CanvasShapes.Scene({
                id: this.domId,
                width: this.width,
                height: this.height,
                RENDER_OFF_SCREEN: true
            });

            this.renderer.addScene(this.scene);
        };

        Showcase.prototype.createObjects = function () {

            this.elements = {};
            this.elements.background = {};
            this.elements.house = {};
            this.elements.animated = {};

            this.elements.background.sky = new CanvasShapes.Rectangle(
                [[0, 0], [100, 0], [100, 75]]
            );
            this.elements.background.sky.setRelativeRendering(true);
            this.elements.background.skyStyle = new CanvasShapes.Style({
                fillStyle: '#39a7fe'
            });
            this.elements.background.skyStyle.addToShapes(
                this.elements.background.sky
            );

            this.elements.animated.sun = new CanvasShapes.Circle(
                [85, 15], 12
            );
            this.elements.animated.sun.setRelativeRendering(true);
            this.elements.animated.sunStyle = new CanvasShapes.Style({
                strokeStyle: 'orange',
                fillStyle: 'yellow'
            });
            this.elements.animated.sunStyle.addToShapes(
                this.elements.animated.sun
            );

            this.elements.background.grass = new CanvasShapes.Rectangle(
                [[0, 75], [100, 75], [100, 100]]
            );
            this.elements.background.grass.setRelativeRendering(true);
            this.elements.background
                .grassStyle = new CanvasShapes.Style({
                    fillStyle: '#8ec852'
                });
            this.elements.background.grassStyle.addToShapes(
                this.elements.background.grass
            );

            this.elements.background.horizon = new CanvasShapes.Line(
                [[0, 75], [100, 75]]
            );
            this.elements.background.horizon.setRelativeRendering(true);
            this.elements.background.horizon.setStyle(
                new CanvasShapes.Style(function (context) {
                    context.strokeStyle = 'black';
                    context.stroke();
                })
            );

            this.elements.house.main = new CanvasShapes.Rectangle(
                [[10, 50], [40, 50], [40, 75]]
            );
            this.elements.house.main.setRelativeRendering(true);
            this.elements.house.mainStyle = new CanvasShapes.Style({
                strokeStyle: 'black',
                fillStyle: '#ede6cc'
            });
            this.elements.house.mainStyle.addToShapes(this.elements.house.main);

            this.elements.house.door = new CanvasShapes.Rectangle(
                [[12, 52], [21, 52], [21, 75]]
            );
            this.elements.house.door.setRelativeRendering(true);
            this.elements.house.door.setStyle(
                new CanvasShapes.Style(function (context) {
                    context.strokeStyle = 'black';
                    context.stroke();
                    context.fillStyle = '#8b4513';
                    context.fill();
                })
            );

            this.elements.house.chimney = new CanvasShapes.Rectangle(
                [[32.5, 37.5], [35, 37.5], [35, 50]]
            );
            this.elements.house.chimney.setRelativeRendering(true);
            this.elements.house.chimneyStyle = new CanvasShapes.Style({
                strokeStyle: 'black',
                fillStyle: '#696969'
            });
            this.elements.house.chimneyStyle
                .addToShapes(this.elements.house.chimney);

            this.elements.house.roof = new CanvasShapes.Polygon(
                [[10, 50], [25, 35], [40, 50]]
            );
            this.elements.house.roof.setRelativeRendering(true);
            this.elements.house.roofStyle = new CanvasShapes.Style({
                strokeStyle: 'black',
                fillStyle: '#ede6cc'
            });
            this.elements.house.roofStyle.addToShapes(this.elements.house.roof);

            this.elements.house.window = new CanvasShapes.Rectangle(
                [[25, 52], [38, 52], [38, 64]]
            );
            this.elements.house.window.setRelativeRendering(true);
            this.elements.house.windowStyle = new CanvasShapes.Style({
                strokeStyle: 'black',
                fillStyle: '#39a7fe'
            });
            this.elements.house.windowStyle.addToShapes(
                this.elements.house.window
            );

            this.elements.house.windowDoor1 = new CanvasShapes.Rectangle(
                [[24, 52], [25, 52], [25, 64]]
            );
            this.elements.house.windowDoor1.setRelativeRendering(true);
            this.elements.house.windowDoor1.setStyle(
                new CanvasShapes.Style(function (context) {
                    context.strokeStyle = 'black';
                    context.stroke();
                    context.fillStyle = '#8b4513';
                    context.fill();
                })
            );

            this.elements.house.windowDoor2 = new CanvasShapes.Rectangle(
                [[38, 52], [39, 52], [39, 64]]
            );
            this.elements.house.windowDoor2.setRelativeRendering(true);
            this.elements.house.windowDoor2.setStyle(
                new CanvasShapes.Style(function (context) {
                    context.strokeStyle = 'black';
                    context.stroke();
                    context.fillStyle = '#8b4513';
                    context.fill();
                })
            );

            this.elements.house.stupidComplexPath = new CanvasShapes.Polygon(
                this.stupidPathVertices()
            );
            this.elements.house.stupidComplexPath.setRelativeRendering(true);
            this.elements.house.stupidComplexPathStyle = new CanvasShapes.Style({
                strokeStyle: 'black'
            });
            this.elements.house.stupidComplexPathStyle.addToShapes(
                this.elements.house.stupidComplexPath
            );
        };

        Showcase.prototype.stupidPathVertices = function () {

            var ret = [],
                LOOP = [
                    [ 0,  0], [10, 10], [20,  0], [30, 10], [40,  0],
                    [50, 10], [60,  0], [70, 10], [80,  0], [90, 10],
                    [90, 20], [80, 10], [70, 20], [60, 10], [50, 20],
                    [40, 10], [30, 20], [20, 10], [10, 20], [ 0, 10],
                    [ 0, 20], [10, 30], [20, 20], [30, 30], [40, 20],
                    [50, 30], [60, 20], [70, 30], [80, 20], [90, 30],
                    [90, 40], [80, 30], [70, 40], [60, 30], [50, 40],
                    [40, 30], [30, 40], [20, 30], [10, 40], [ 0, 30],
                    [ 0, 40], [10, 50], [20, 40], [30, 50], [40, 40],
                    [50, 50], [60, 40], [70, 50], [80, 40], [90, 50],
                    [90, 60], [80, 50], [70, 60], [60, 50], [50, 60],
                    [40, 50], [30, 60], [20, 50], [10, 60], [ 0, 50],
                    [ 0, 60], [10, 70], [20, 60], [30, 70], [40, 60],
                    [50, 70], [60, 60], [70, 70], [80, 60], [90, 70],
                    [90, 80], [80, 70], [70, 80], [60, 70], [50, 80],
                    [40, 70], [30, 80], [20, 70], [10, 80], [ 0, 70],
                    [ 0, 80], [10, 90], [20, 80], [30, 90], [40, 80],
                    [50, 90], [60, 80], [70, 90], [80, 80], [90, 90],
                    [90, 99], [80, 90], [70, 99], [60, 90], [50, 99],
                    [40, 90], [30, 99], [20, 90], [10, 99], [ 0, 90],
                    [ 0, 99], [10, 90], [20, 99], [30, 90], [40,  99],
                    [50, 90], [60, 99], [70, 90], [80, 99], [90, 90],
                    [90, 80], [80, 90], [70, 80], [60, 90], [50, 80],
                    [40, 90], [30, 80], [20, 90], [10, 80], [ 0, 90],
                    [ 0, 80], [10, 70], [20, 80], [30, 70], [40, 80],
                    [50, 70], [60, 80], [70, 70], [80, 80], [90, 70],
                    [90, 60], [80, 70], [70, 60], [60, 70], [50, 60],
                    [40, 70], [30, 60], [20, 70], [10, 60], [ 0, 70],
                    [ 0, 60], [10, 50], [20, 60], [30, 50], [40, 60],
                    [50, 50], [60, 60], [70, 50], [80, 60], [90, 50],
                    [90, 40], [80, 50], [70, 40], [60, 50], [50, 40],
                    [40, 50], [30, 40], [20, 50], [10, 40], [ 0, 50],
                    [ 0, 40], [10, 30], [20, 40], [30, 30], [40, 40],
                    [50, 30], [60, 40], [70, 30], [80, 40], [90, 30],
                    [90, 20], [80, 30], [70, 20], [60, 30], [50, 20],
                    [40, 30], [30, 20], [20, 30], [10, 20], [ 0, 30],
                    [ 0, 20], [10, 10], [20, 20], [30, 10], [40, 20],
                    [50, 10], [60, 20], [70, 10], [80, 20], [90, 10],
                    [90,  0], [80, 10], [70,  0], [60, 10], [50,  0],
                    [40, 10], [30,  0], [20, 10], [10,  0], [ 0, 10],
                ],
                HOW_MANY_LOOPS = 10;

            while (HOW_MANY_LOOPS--) {
                ret = ret.concat(LOOP);
            }

            return ret;
        };

        Showcase.prototype.addAllShapes = function () {

            this.renderer.addShapes([
                this.elements.background.sky,
                this.elements.animated.sun,
                this.elements.background.grass,
                this.elements.background.horizon,
                this.elements.house.main,
                this.elements.house.door,
                this.elements.house.window,
                this.elements.house.chimney,
                this.elements.house.roof,
                this.elements.house.windowDoor1,
                this.elements.house.windowDoor2,
                this.elements.house.stupidComplexPath
            ]);
        };

        Showcase.prototype.dayAnimation = function () {

            var that = this,
                callback = function () {
                    that.nightAnimation();
                };

            this.elements.animated.sun.move(1000, [85, 15]);
            this.elements.animated.sunStyle.animate(1000, {
                fillStyle: 'yellow'
            });

            setTimeout(function () {
                callback();
            }, 1100);
        };

        Showcase.prototype.nightAnimation = function () {

            var that = this,
                callback = function () {
                    that.dayAnimation();
                };

            this.elements.animated.sun.move(1000, [85, 115]);
            this.elements.animated.sunStyle.animate(1000, {
                fillStyle: 'red'
            });

            setTimeout(function () {
                callback();
            }, 1100);
        };

        return Showcase;
    })();

    var i, j,
        ROWS = 10,
        COLS = 10,
        HOW_MANY = ROWS * COLS,
        scenesIDs = [],
        showcases = [],
        showcase,
        $window = $(window);

    $('body').css({
        margin: 0,
        padding: 0
    });

    $window.resize(function () {

        var width, height,
            ww = $(window).width(),
            wh = $(window).height();

        // reset
        $('#scenes').html('');
        showcases = [];
        scenesIDs = [];

        for (i = 0; i < ROWS; i++) {
            for (j = 0; j < COLS; j++) {
                scenesIDs.push('scene_' + i + '_' + j);
                $('#scenes').append('<div id="scene_' + i + '_' + j + '" style="float: left;"></div>');
            }
            $('#scenes').append('<div style="clear: both;"></div>');
        }

        if (COLS === 1 && ROWS === 1) {
            if (ww > wh) {
                ww = wh;
            } else {
                wh = ww;
            }
            width = ww;
            height = wh;
        } else {
            width = ww / COLS;
            height = width;
        }

        if (showcase) {
            showcase.destroy();
        }

        for (i = 0; i < HOW_MANY; i++) {
            showcases.push(new Showcase(width, height, scenesIDs[i]));
        }

        CanvasShapes.Renderer.start();

        for (i = 0; i < HOW_MANY; i++) {
            showcases[i].nightAnimation();
        }

        setInterval(function () {
            $("#fps .fps").html(CanvasShapes.Renderer.getFPS());
        }, 100);

    }).resize();
});
