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

            this.elements.polygon = new CanvasShapes.Polygon([
                [50, 10], [60, 30], [80, 30], [40, 90]
            ]);
            this.elements.polygon.setRelativeRendering(true);
            this.elements.polygonStyle = new CanvasShapes.Style({
                strokeStyle: 'darkBlue',
                fillStyle: 'lightBlue'
            });
            this.elements.polygonStyle.addToShapes(this.elements.polygon);
        };

        Showcase.prototype.addAllShapes = function () {

            this.renderer.addShapes([
                this.elements.polygon
            ]);
        };

        Showcase.prototype.setupEvents = function () {

            var that = this;

            this.elements.polygon.on('mouseover', function (e) {
                that.elements.polygonStyle.setDefinition({
                    strokeStyle: 'darkRed',
                    fillStyle: '#FFCDCD'
                });
                this.sceneInterfaceHandlers.requestRendering(this);
                that.renderer.render();
            });

            this.elements.polygon.on('mouseout', function (e) {
                that.elements.polygonStyle.setDefinition({
                    strokeStyle: 'darkBlue',
                    fillStyle: 'lightBlue'
                });
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
