function Gun (player) {
    'use strict';
    
    var _width = 30,
        _height = 20,
        _top = 350,
        _left = 138,
        STEP = 4,
//        ALLOWED_DISTANCE_BULLET = 1000,
        _player = player,
        _leftBullet,
        _topBullet;

    var _sprite = {
        name : 'bullet',
        type : 'image',
        spriteSources  : ['assets/img/gamer/bullet.png'],
        shapes : [],// pattern Flyweight. Mehrere Objekte von gleichem Datentype, aber verschiedene Größen haben.
        frame : null
    };

    var audio = {
        url : 'assets/audio/shoot.ogg',
        data : undefined
    };
    
    audio.data = document.createElement('audio');

    audio.data.setAttribute('autobuffer', 'autobuffer');
    audio.data.setAttribute('src', audio.url);
    audio.data.load();
    
    function _getResources() {
        return _sprite;
    }

    /**
     * 
     * pattern Flyweight
     */
    function _shoot() {
        _leftBullet = _player.getLeft() + _player.getWidth();
        
        _topBullet = _player.getTop() + 36;
        
        _sprite.frame = MY_Game_Resources.get(_sprite.spriteSources);
        
        _sprite.shapes.push({
            top         : _topBullet,
            left        : (_player.isFlippedImage()) ? _leftBullet - _player.getWidth() - 20 : _leftBullet,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : (_player.isFlippedImage()) ? true : false
        });
        
        return _sprite;
    };
    
    function _refreshBullets() {
        for (var i = 0; i < _sprite.shapes.length; i++) {
            if (_sprite.shapes[i].left > MY_camera.xView + MY_Canvas.width || _sprite.shapes[i].left <= 0) {
                _sprite.shapes.splice(i,1);
            }
            else {
                if (_sprite.shapes[i].flipedImage) {
                    _sprite.shapes[i].left -= STEP;
                }
                else {
                    _sprite.shapes[i].left += STEP;
                }
            }
        }
    }

    this.get = function() {
        _refreshBullets();

        if (_sprite.shapes.length > 0) {
            return _sprite;
        }
        
        return null;
    };
  
    this.hasBullets = function() {
        return _sprite.shapes > 0 ? true : false;
    };
    
    this.getResources = function () {
        return _getResources();
    };
    
    this.shoot = function () {
        _shoot();
//
//        audio.data.currentTime = 0;
//        audio.data.play(0);
    };
    
    this.stopShoot = function() {
        //audio.data.pause(0);
    };

    this.hasClone = function() {
        return _sprite.shapes;
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
}

Gun.prototype = new Actor();
Gun.prototype.constructor = Gun;
