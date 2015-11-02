require.config({
    paths: {
        lodash: '../lib/lodash.min',
        JSONChecker: '../lib/JSONChecker',
        uuid: '../lib/uuid',
        CanvasShapes: '../build/CanvasShapes'
    }
});

require([
    'lodash',
    'CanvasShapes'
], function (
    _,
    CanvasShapes
) {
    var Showcase = (function () {

        Showcase = function (width, height, domId) {
            this.width = width;
            this.height = height;
            this.domId = domId;
            this.renderer = renderer = CanvasShapes.init();
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
                height: this.height
            });

            this.renderer.addScene(this.scene);
        };

        Showcase.prototype.createObjects = function () {

            this.elements = {};
            this.elements.background = {};
            this.elements.animatedBackground = {};
            this.elements.house = {};
            this.elements.animatedHouse = {};

            this.createBackground();
            this.createAnimatedBackground();
            this.createHouse();
        };

        Showcase.prototype.addAllShapes = function () {

            var i;

            this.renderer.addShapes([
                this.elements.background.horizon
            ]);

            this.renderer.addShapes([
                this.elements.animatedBackground.sky,
                this.elements.animatedBackground.sun,
                this.elements.animatedBackground.grass
            ]);

            this.renderer.addShapes(this.elements.animatedBackground.stars);

            this.renderer.addShapes([
                this.elements.house.main,
                this.elements.house.door,
                this.elements.house.window,
                this.elements.house.chimney,
                this.elements.house.roof,
                this.elements.house.windowDoor1,
                this.elements.house.windowDoor2
            ]);
        };

        Showcase.prototype.starCoordinates = function (offset, multiplier) {
            var shape = new CanvasShapes.Shape(),
                coordinates = [
                    [-4, -1], [-1, -1], [0, -3], [1, -1], [4, -1],
                    [2, 1], [3, 4], [0, 2], [-3, 4], [-2, 1]
                ];
            return shape.translateCoordinates(
                coordinates, offset, multiplier
            );
        };

        Showcase.prototype.createStars = function () {

            var i,
                starStyle = new CanvasShapes.Style(function (context) {
                    context.strokeStyle = 'orange';
                    context.stroke();
                    context.fillStyle = 'yellow';
                    context.fill();
                }),
                starPositions = [
                    [{ x: 15, y: -15 }, 1],
                    [{ x: 50, y: -20 }, 1],
                    [{ x: 85, y: -10 }, 1],
                    [{ x: 30, y: -20 }, 0.5],
                    [{ x: 65, y: -10 }, 0.5],
                    [{ x: 35, y: -5 }, 0.5],
                    [{ x: 80, y: -25 }, 0.5]
                ];

            this.elements.animatedBackground.stars = [];

            for (i = 0; i < starPositions.length; i++) {
                this.elements.animatedBackground.stars[i] = new CanvasShapes.Polygon(
                    this.starCoordinates.apply(undefined, starPositions[i])
                );
                this.elements.animatedBackground.stars[i].setRelativeRendering(true);
                this.elements.animatedBackground.stars[i].setStyle(starStyle);
            }
        };

        Showcase.prototype.createAnimatedBackground = function () {

            this.elements.animatedBackground.sky = new CanvasShapes.Rectangle(
                [[0, 0], [100, 0], [100, 75]]
            );
            this.elements.animatedBackground.sky.setRelativeRendering(true);
            this.elements.animatedBackground.skyStyle = new CanvasShapes.Style({
                fillStyle: '#39a7fe'
            });
            this.elements.animatedBackground.skyStyle.addToShapes(
                this.elements.animatedBackground.sky
            );

            this.elements.animatedBackground.sun = new CanvasShapes.Circle(
                [85, 15], 12
            );
            this.elements.animatedBackground.sun.setRelativeRendering(true);
            this.elements.animatedBackground.sun.setStyle(
                new CanvasShapes.Style(function (context) {
                    context.strokeStyle = 'orange';
                    context.stroke();
                    context.fillStyle = 'yellow';
                    context.fill();
                })
            );

            this.elements.animatedBackground.grass = new CanvasShapes.Rectangle(
                [[0, 75], [100, 75], [100, 100]]
            );
            this.elements.animatedBackground.grass.setRelativeRendering(true);
            this.elements.animatedBackground
                .grassStyle = new CanvasShapes.Style({
                    fillStyle: '#8ec852'
                });
            this.elements.animatedBackground.grassStyle.addToShapes(
                this.elements.animatedBackground.grass
            );

            this.createStars();
        };

        Showcase.prototype.createBackground = function () {

            // horizon line
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
        };

        Showcase.prototype.createHouse = function () {

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
        };

        Showcase.prototype.dayAnimation = function () {

            var i, tempCoords,
                that = this,
                callback = function () {
                    that.nightAnimation();
                },
                starPositions = [
                    [{ x: 15, y: -15 }, 1],
                    [{ x: 50, y: -20 }, 1],
                    [{ x: 85, y: -10 }, 1],
                    [{ x: 30, y: -20 }, 0.5],
                    [{ x: 65, y: -10 }, 0.5],
                    [{ x: 35, y: -5 }, 0.5],
                    [{ x: 80, y: -25 }, 0.5]
                ];

            this.elements.house.windowStyle.animate(1000, {
                fillStyle: '#39a7fe'
            });
            this.elements.house.windowDoor1.move(1000, [[24, 52], [25, 52], [25, 64], [24, 64]]);
            this.elements.house.windowDoor2.move(1000, [[38, 52], [39, 52], [39, 64], [38, 64]]);

            this.elements.animatedBackground.skyStyle.animate(1000, {
                fillStyle: '#39a7fe'
            });
            this.elements.animatedBackground.grassStyle.animate(1000, {
                fillStyle: '#8ec852'
            });
            this.elements.house.chimneyStyle.animate(1000, {
                fillStyle: '#696969'
            });
            this.elements.house.roofStyle.animate(1000, {
                fillStyle: '#ede6cc'
            });
            this.elements.house.mainStyle.animate(1000, {
                fillStyle: '#ede6cc'
            });

            this.elements.animatedBackground.sun.move(1000, [85, 15]);
            for (i = 0; i < starPositions.length; i++) {
                tempCoords = that.starCoordinates.apply(undefined, starPositions[i]);
                this.elements.animatedBackground.stars[i].move(1000, tempCoords);
            }

            setTimeout(function () {
                callback();
            }, 4000);
        };

        Showcase.prototype.nightAnimation = function () {

            var i, tempCoords,
                that = this,
                callback = function () {
                    that.dayAnimation();
                },
                starPositions = [
                    [{ x: 15, y: 15 }, 1],
                    [{ x: 50, y: 10 }, 1],
                    [{ x: 85, y: 20 }, 1],
                    [{ x: 30, y: 10 }, 0.5],
                    [{ x: 65, y: 20 }, 0.5],
                    [{ x: 35, y: 25 }, 0.5],
                    [{ x: 80, y: 5 }, 0.5]
                ];

            this.elements.house.windowStyle.animate(1000, {
                fillStyle: 'darkblue'
            });
            this.elements.house.windowDoor1.move(1000, [[25, 52], [31.5, 52], [31.5, 64], [25, 64]]);
            this.elements.house.windowDoor2.move(1000, [[31.5, 52], [38, 52], [38, 64], [31.5, 64]]);

            this.elements.animatedBackground.skyStyle.animate(1000, {
                fillStyle: 'darkblue'
            });
            this.elements.animatedBackground.grassStyle.animate(1000, {
                fillStyle: 'darkgreen'
            });
            this.elements.house.chimneyStyle.animate(1000, {
                fillStyle: 'black'
            });
            this.elements.house.roofStyle.animate(1000, {
                fillStyle: '#d2b48c'
            });
            this.elements.house.mainStyle.animate(1000, {
                fillStyle: '#d2b48c'
            });

            this.elements.animatedBackground.sun.move(1000, [85, 115]);
            for (i = 0; i < starPositions.length; i++) {
                tempCoords = that.starCoordinates.apply(undefined, starPositions[i]);
                this.elements.animatedBackground.stars[i].move(1000, tempCoords);
            }

            setTimeout(function () {
                callback();
            }, 4000);
        };

        return Showcase;
    })();

    var i,
        HOW_MANY = 1,
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

        for (i = 0; i < HOW_MANY; i++) {
            scenesIDs.push('scene' + i);
            $('#scenes').append('<div id="scene' + i + '" style="float: left;"></div>');
        }
        $('#scenes').append('<div style="clear: both;"></div>');

        if (HOW_MANY === 1) {
            if (ww > wh) {
                ww = wh;
            } else {
                wh = ww;
            }
            width = ww;
            height = wh;
        } else {
            width = ww / HOW_MANY;
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
            document.getElementById('fps').innerHTML = CanvasShapes.Renderer.getFPS();
        }, 100);

    }).resize();
});
