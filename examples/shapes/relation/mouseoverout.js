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

            this.elements.relation = new CanvasShapes.Relation(
                this.generator.bind(this)
            );
            this.elements.relation.setRelativeRendering(true);
            this.elements.relationStyle = new CanvasShapes.Style({
                strokeStyle: 'black',
                lineWidth: 3
            });
            this.elements.relationStyle.addToShapes(this.elements.relation);
        };

        Showcase.prototype.generator = function (x) {

            var func1, func2, func3, func4, func5,
                a = Math.floor(this.width / 2),
                b = Math.floor(this.width / 2),
                r = Math.floor(this.width / 4);

            // linear function
            func1 = x;

            // circle equation: (x - a)^2 + (y - b)^2 = r^2
            // it can be plotted using 2 functions
            func2 = Math.sqrt(r * r - (x - a) * (x - a)) + b;
            if (!Number.isFinite(func2)) {
                func2 = false;
            }
            func3 = -Math.sqrt(r * r - (x - a) * (x - a)) + b;
            if (!Number.isFinite(func3)) {
                func3 = false;
            }

            // sine
            func4 = this.height / 2 * Math.sin(x / (this.width / (2 * Math.PI))) + this.height / 2;

            return [func1, func2, func3, func4];
        };

        Showcase.prototype.addAllShapes = function () {

            this.renderer.addShapes([
                this.elements.relation
            ]);
        };

        Showcase.prototype.setupEvents = function () {

            var that = this;

            this.elements.relation.on('mouseover', function (e) {
                that.elements.relationStyle.setDefinition({
                    strokeStyle: 'red'
                }, undefined, true);
                this.getSceneInterfaceHandlers().requestRendering(this);
                that.renderer.render();
            });

            this.elements.relation.on('mouseout', function (e) {
                that.elements.relationStyle.setDefinition({
                    strokeStyle: 'black'
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
