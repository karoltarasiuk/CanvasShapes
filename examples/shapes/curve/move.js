require.config({
    paths: {
        CanvasShapes: '../../../build/CanvasShapes'
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

            CanvasShapes.Renderer.start();
            this.setupMoving();
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

            this.startingCoordinates = [
                [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                [100, 75], [0, 75], [0, 100], [50, 100]
            ];
            this.endingCoordinates = [
                [100, 0], [50, 0], [50, 25], [100, 25], [100, 50], [0, 50],
                [0, 75], [100, 75], [100, 100], [50, 100]
            ];

            this.elements.curve = new CanvasShapes.BezierCurve(
                this.startingCoordinates
            );
            this.elements.curve.setRelativeRendering(true);
            this.elements.curveStyle = new CanvasShapes.Style({
                strokeStyle: 'darkBlue',
                lineWidth: 5
            });
            this.elements.curveStyle.addToShapes(this.elements.curve);
        };

        Showcase.prototype.addAllShapes = function () {

            this.renderer.addShapes([
                this.elements.curve
            ]);
        };

        Showcase.prototype.setupMoving = function () {

            var that = this;

            that.elements.curve.move(5000, that.endingCoordinates, function () {
                that.elements.curve.move(
                    5000,
                    that.startingCoordinates,
                    function () {
                        that.setupMoving();
                    }
                );
            });
        };

        return Showcase;
    })();

    var i, j,
        ROWS = 1,
        COLS = 1,
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
                $('#scenes').append('<div id="scene_' + i + '_' + j + '" style="float: left; border: 1px solid black;"></div>');
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

        $("#fps .fps").html('0');

    }).resize();
});
