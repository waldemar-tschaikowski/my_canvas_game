function Hurdle () {
    'use strict';

    //------privatbereich-------

    var _width = 80,
        _height = 55,
        TOP_DEFAULT = 370,
        _top = TOP_DEFAULT,
        LEFT_DEFAULT = 800,
        _left = LEFT_DEFAULT,
        STEP = 4,
        _direction = -1;
    
    var _sprite = {
        name            : 'hurdle',
        type            : 'image',
        spriteSources   : ['assets/img/hurdle.png'],
        shapes : {
            hurdle : [{
                left        : _left,
                top         : _top,
                width       : _width,
                height      : _height,
                useSlice    : false,
                flipedImage : false
            }]
        },
        images : {
            hurdle : null
        }
    };
    
    function _getResources () {
        return _sprite;
    }
    
    function _move () {
        if (_left < 0 || _left + _width >= MY_MapWidth) {
            _direction *= -1;
        }
        
        _left += STEP * _direction;
    }

    //------öffentlichen Bereich-------

    this.getResources = function() {
        return _getResources();
    };    

    this.get = function() {
        _sprite.images.hurdle = MY_Game_Resources.get(_sprite.spriteSources[0]);
        _sprite.shapes.hurdle[0].left = _left;
        
        return _sprite;
    };
    
    this.move = function() {
        _move();
    };
    
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
        _left = LEFT_DEFAULT * 2;
        _direction = 1;
    };
}

Hurdle.prototype = new Actor();
Hurdle.prototype.constructor = Hurdle;