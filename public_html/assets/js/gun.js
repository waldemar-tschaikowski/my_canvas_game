function Gun(player) {
    'use strict';

    //------privatbereich-------

    var _width = 30,
        _height = 20,
        _top = 350,
        _left = 138,
        STEP = 5,
        _player = player,
        _leftBullet,
        _topBullet,
        _leftFire,
        _topFire;

    // pattern Flyweight. Mehrere Objekte von gleichem Datentype, aber verschiedene Größen haben.
    var _sprite = {
        name : 'bullet',
        type : 'image',
        spriteSources  : [
            'assets/img/bullet.png',
            'assets/img/fire.png'
        ],
        shapes : {
            bullet : [],
            fire : [] 
        },
        images : {
            bullet : null,
            fire : null
        }
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
        _sprite.images.bullet = MY_Game_Resources.get(_sprite.spriteSources[0]);
        _sprite.images.fire = MY_Game_Resources.get(_sprite.spriteSources[1]);
        
        _leftBullet = _player.getLeft() + _player.getWidth();
        
        _topBullet = _player.getTop() + 24;
        
        _sprite.shapes.bullet.push({
            top         : _topBullet,
            left        : (_player.isFlippedImage()) ? _leftBullet - _player.getWidth() - 28 : _leftBullet + 30,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : _player.isFlippedImage()
        });

        _leftFire = _player.getLeft() + _player.getWidth();

        _topFire = _player.getTop();

        _sprite.shapes.fire = [{
            top         : (_player.isFlippedImage()) ? _topFire + 22 : _topFire + 18,
            left        : (_player.isFlippedImage()) ? _leftFire - _player.getWidth() - 32 : _leftFire + 20,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : _player.isFlippedImage(),
            fired       : true
        }];        
        
        return _sprite;
    };
    
    function _refreshBullets() {
        for (var i = 0; i < _sprite.shapes.bullet.length; i++) {
            if (_sprite.shapes.bullet[i].left > MY_camera.xView + MY_Canvas.width || _sprite.shapes.bullet[i].left <= 0) {
                _sprite.shapes.bullet.splice(i,1);
            }
            else {
                if (_sprite.shapes.bullet[i].flipedImage) {
                    _sprite.shapes.bullet[i].left -= STEP;
                }
                else {
                    _sprite.shapes.bullet[i].left += STEP;
                }
            }
        }
    }

    //------öffentlichen Bereich-------

    this.get = function() {
        _refreshBullets();
        
        if (_sprite.shapes.bullet.length > 0) {
            if (_sprite.shapes.fire !== undefined && _sprite.shapes.fire[0].fired) {
                _sprite.shapes.fire[0].fired = false;
            }
            else {
                delete(_sprite.images.fire);
                delete(_sprite.shapes.fire);
            }            

            return _sprite;
        }
        
        return null;
    };
  
    this.hasBullets = function() {
        return _sprite.shapes > 0;
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
