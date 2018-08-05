function Hurdle () {
    var _width = 100,
        _height = 60,
        TOP_DEFAULT = 370,
        _top = TOP_DEFAULT,
        LEFT_DEFAULT = 800,
        _left = LEFT_DEFAULT,
        STEP = 2,
        _impulse = 2;
    
    var _sprite = {
        name    : 'hurdle',
        type    : 'image',
        spriteSources     : ['assets/img/scheisse.png'],
        shapes    : [{
            left        : _left,
            top         : _top,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : false
        }],
        frame   : null
    };
    
    function _getResources () {
        return _sprite;
    }
    
    function _move () {
        _left -= STEP * _impulse;
        
        if (_left < 0 || _left + _width >= MY_MapWidth) {
            _impulse *= -1;
        }
    }
    
    this.getResources = function() {
        return _getResources();
    };    

    this.get = function() {
        _sprite.frame = MY_Game_Resources.get(_sprite.spriteSources[0]);
        _sprite.shapes[0].left = _left;
        
        return _sprite;
    };
    
    this.move = function() {
        _move();
    };
    
//    this.setImpulse = function(i) {
//        _impulse = i;
//    };
//    
//    this.setDefaultImpulse = function () {
//        _impulse = STEP;
//    };
    
    this.getLeft = function() {
        return _left;
    };
    
    this.getTop = function() {
        return _top;
    };
    
    this.getWidth = function() {
        return _width;
    };
    
    this.getHeight = function() {
        return _height;
    };
    
    this.reset = function() {
        _top = TOP_DEFAULT;
        _left = LEFT_DEFAULT;
    };
}

Hurdle.prototype = new Actor();
Hurdle.prototype.constructor = Hurdle;