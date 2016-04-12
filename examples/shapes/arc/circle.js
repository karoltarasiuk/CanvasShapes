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

            this.startingCoordinates = [20, 20];
            this.endingCoordinates = [80, 80];

            this.elements.arc = new CanvasShapes.Circle(
                this.startingCoordinates, 10
            );
            this.elements.arc.setRelativeRendering(true);
            this.elements.arcStyle = new CanvasShapes.Style({
                strokeStyle: 'darkBlue',
                fillStyle: 'lightBlue',
                lineWidth: 5
            });
            this.elements.arcStyle.addToShapes(this.elements.arc);

            this.ringStartingCoordinates = [80, 20];
            this.ringEndingCoordinates = [20, 80];

            this.elements.ring = new CanvasShapes.Circle(
                this.ringStartingCoordinates, 10
            );
            this.elements.ring.setRelativeRendering(true);
            this.elements.ringStyle = new CanvasShapes.Style({
                strokeStyle: 'darkBlue',
                lineWidth: 5
            });
            this.elements.ringStyle.addToShapes(this.elements.ring);
        };

        Showcase.prototype.addAllShapes = function () {

            this.renderer.addShapes([
                this.elements.arc,
                this.elements.ring
            ]);
        };

        Showcase.prototype.setupMoving = function () {

            var that = this;

            that.elements.arc.move(10000, that.endingCoordinates, function () {
                that.elements.arc.move(
                    10000,
                    that.startingCoordinates,
                    function () {
                        that.setupMoving();
                    }
                );
            });

            that.elements.ring.move(10000, that.ringEndingCoordinates, function () {
                that.elements.ring.move(
                    10000,
                    that.ringStartingCoordinates,
                    function () {
                        that.setupMoving();
                    }
                );
            });
        };

        Showcase.prototype.setupEvents = function () {

            var that = this;

            this.elements.arc.on('mouseover', function (e) {
                that.elements.arcStyle.setDefinition({
                    strokeStyle: 'darkRed',
                    fillStyle: '#FFCDCD'
                });
                // just in case animation stops
                this.getSceneInterfaceHandlers().requestRendering(this);
                that.renderer.render();
            });

            this.elements.arc.on('mouseout', function (e) {
                that.elements.arcStyle.setDefinition({
                    strokeStyle: 'darkBlue',
                    fillStyle: 'lightBlue'
                });
                // just in case animation stops
                this.getSceneInterfaceHandlers().requestRendering(this);
                that.renderer.render();
            });

            this.elements.ring.on('mouseover', function (e) {
                that.elements.ringStyle.setDefinition({
                    strokeStyle: 'darkRed',
                    lineWidth: 5
                });
                // just in case animation stops
                this.getSceneInterfaceHandlers().requestRendering(this);
                that.renderer.render();
            });

            this.elements.ring.on('mouseout', function (e) {
                that.elements.ringStyle.setDefinition({
                    strokeStyle: 'darkBlue',
                    lineWidth: 5
                });
                // just in case animation stops
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
