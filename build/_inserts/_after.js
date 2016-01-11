
    if (typeof(module) !== 'undefined' && module.exports) {
        // Publish as node.js module
        module.exports = CanvasShapes;
    } else  if (typeof define === 'function' && define.amd) {
        // Publish as AMD module
        define(function () { return CanvasShapes; });
    } else {
        // Publish as global (in browsers)
        var _previousRoot = _global.CanvasShapes;

        // `noConflict()` - (browser only) to reset global 'CanvasShapes' var
        CanvasShapes.noConflict = function() {
            _global.CanvasShapes = _previousRoot;
            return CanvasShapes;
        };

        _global.CanvasShapes = CanvasShapes;
    }
}).call(this);
