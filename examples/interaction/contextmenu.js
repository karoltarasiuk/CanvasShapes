require.config({
    paths: {
        lodash: '../../lib/lodash.min',
        JSONChecker: '../../lib/JSONChecker',
        uuid: '../../lib/uuid',
        CanvasShapes: '../../build/CanvasShapes'
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
            this.renderer = CanvasShapes.init();
            this.setupScene();
            this.createObjects();
            this.addAllShapes();
            this.setupEvents();

            this.renderer.render();
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

            this.elements.square = new CanvasShapes.Square([
                [10, 10], [90, 10], [90, 90]
            ]);
            this.elements.square.setRelativeRendering(true);
            this.elements.squareStyle = new CanvasShapes.Style({
                strokeStyle: 'darkBlue',
                fillStyle: 'lightBlue'
            });
            this.elements.squareStyle.addToShapes(this.elements.square);
        };

        Showcase.prototype.addAllShapes = function () {

            this.renderer.addShapes([
                this.elements.square
            ]);
        };

        Showcase.prototype.setupEvents = function () {

            var that = this;

            this.clicksNumber = 0;

            this.elements.square.on('contextmenu', function (e) {
                that.clicksNumber++;
                if (that.clicksNumber % 2 === 1) {
                    that.elements.squareStyle.setDefinition({
                        strokeStyle: 'darkRed',
                        fillStyle: '#FFCDCD'
                    });
                } else {
                    that.elements.squareStyle.setDefinition({
                        strokeStyle: 'darkBlue',
                        fillStyle: 'lightBlue'
                    });
                }
                this.sceneInterfaceHandlers.requestRendering(this);
                that.renderer.render();
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
