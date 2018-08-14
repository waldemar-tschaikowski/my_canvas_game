function Gun(bullet) {
    'use strict';

    //------privatbereich-------

    var _width = 30,
        _height = 20,
        _top = 350,
        _left = 138,
        _bullet = bullet;

    // pattern Flyweight. Mehrere Objekte von gleichem Datentype, aber verschiedene Größen haben.
    var _sprite = {
        name : 'bullet',
        type : 'image',
        spriteSources  : [
            'assets/img/fire.png'
        ],
        shapes : {
            fire : []
        },
        images : {
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

    /*
     * @param objekt o
     */
    function _shoot(o) {
        audio.data.currentTime = 0;
        audio.data.play(0);

        _sprite.images.fire = MY_Game_Resources.get(_sprite.spriteSources[0]);
        
        var _offsetTop = o.isSitting() ?  o.getTop() + 14 : o.getTop() + 20;
        var _offsetLeft = o.isFlippedImage() ? o.getLeft() - 32 : o.getOffsetRight() + 20;
        
        _sprite.shapes.fire = [{
            top         : _offsetTop,
            left        : o.isRunning() ? _offsetLeft += 10 : _offsetLeft,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : o.isFlippedImage(),
            fired       : true
        }];
        
        _bullet.addBullet(o, 'bullet');
    };

    //------öffentlichen Bereich-------

    this.get = function() {
        if (_sprite.shapes.fire.length > 0 && _sprite.shapes.fire[0].fired) {
            _sprite.shapes.fire[0].fired = false;
        }
        else {
            _sprite.images.fire = [];
            _sprite.shapes.fire = [];
        }            

        if (_sprite.images.fire) {
            return _sprite;
        }

        return null;
    };
  
    this.hasBullets = function() {
        return _sprite.shapes > 0;
    };
    
    this.getResources = function() {
        return _getResources();
    };
    
    this.shoot = function(o) {
        _shoot(o);
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
