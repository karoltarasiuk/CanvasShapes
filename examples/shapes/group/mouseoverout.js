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

            this.elements.groupShape = new CanvasShapes.GroupShape();

            this.elements.curve = new CanvasShapes.BezierCurve([
                [10, 10], [50, 10], [50, 25], [10, 25], [10, 50], [90, 50],
                [90, 75], [10, 75], [10, 90], [50, 90]
            ]);
            this.elements.line1 = new CanvasShapes.Line([
                [50, 90], [10, 90]
            ]);
            this.elements.line2 = new CanvasShapes.Line([
                [10, 90], [10, 10]
            ]);

            this.elements.groupShape.addShapes([
                this.elements.curve,
                this.elements.line1,
                this.elements.line2
            ]);
            this.elements.groupShape.setRelativeRendering(true, true);

            this.elements.style = new CanvasShapes.Style({
                strokeStyle: 'darkBlue',
                fillStyle: 'lightBlue',
                lineWidth: 5,
                lineJoin: 'round',
                lineCap: 'round'
            });
            this.elements.style.addToShapes(this.elements.groupShape);
        };

        Showcase.prototype.addAllShapes = function () {

            this.renderer.addShapes([
                this.elements.groupShape
            ]);
        };

        Showcase.prototype.setupEvents = function () {

            var that = this;

            this.elements.groupShape.on('mouseover', function (e) {
                that.elements.style.setDefinition({
                    strokeStyle: 'darkRed',
                    fillStyle: '#FFCDCD'
                }, undefined, true);
                this.getSceneInterfaceHandlers().requestRendering(this);
                that.renderer.render();
            });

            this.elements.groupShape.on('mouseout', function (e) {
                that.elements.style.setDefinition({
                    strokeStyle: 'darkBlue',
                    fillStyle: 'lightBlue',
                }, undefined, true);
                this.getSceneInterfaceHandlers().requestRendering(this);
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
