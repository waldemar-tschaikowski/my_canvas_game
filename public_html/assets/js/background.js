function Background () {
    'use strict';
    
    var _width = 2560,
        _height = 500,
        _top = 0,
        _left = 0,
        _mapWidth = 4000,//2560
        _mapHeight = 500;

    var _sprite = {
        name : 'background',
        type : 'image',
        spriteSources  : ['assets/img/background.png'],
        shapes : {
            background : [{
                width       : _width,
                height      : _height,
                top         : _top,
                left        : _left,
                mapWidth    : _mapWidth,
                mapHeight   : _mapHeight
            }]
        },
        images : {
            background : null
        }
    };
    
    function _getResources() {
        return _sprite;
    }

    this.getResources = function() {
        return _getResources();
    };
    
    /**
     * Die Funktion move(), braucht man nicht, weil Background(Die Psotion) von Kamera abhängig ist.
     * 
     * @returns {Background._sprite}
     */
    this.get = function() {
        _sprite.images.background = MY_Game_Resources.get(_sprite.spriteSources[0]);
        
        _sprite.shapes.background = [{
            sTop        : MY_camera.yView,//sTop Sourse Top
            sLeft       : MY_camera.xView,
            top         : 0,
            left        : 0,
            width       : MY_camera.wView,
            height      : MY_camera.hView,
            useSlice    : true,
            flipedImage : false
        }];
        
        return _sprite;
    };
}

Background.prototype = new Actor();
Background.prototype.constructor = Background;