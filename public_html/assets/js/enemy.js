function Enemy(bullet) {
    'use strict';

    //------privatbereich-------
    var _width = 201,
        _height = 172,
        TOP_DEFAULT = 244,
        _top = TOP_DEFAULT,
        LEFT_DEFAULT = 800,
        _left = LEFT_DEFAULT,
        _indexPos = 0,
        STEP = 2,
        SPEED = 0.2,
        _direction = -1,
        _scoreDead = 0,
        _flipedImage = false,
        _bullet = bullet;

    var _sprite =  {
        name : 'enemies',
        type : 'image',
        spriteSources : [
            'assets/img/monster/monster1.png',
            'assets/img/monster/monster2.png',
            'assets/img/monster/monster3.png',
            'assets/img/monster/monster4.png',
            'assets/img/monster/monster5.png',
            'assets/img/monster/monster6.png',
            'assets/img/monster/monster7.png',
            'assets/img/monster/monster8.png',
            'assets/img/monster/monster9.png',
            'assets/img/monster/monster10.png',
            'assets/img/monster/monster11.png',
            'assets/img/monster/monster12.png'
        ],
        shapes : {
            enemy : [{
                width       : _width,
                height      : _height,
                top         : _top,
                left        : _left,
                flipedImage : false,
                useSlice    : false
            }],
            explosion : []
        },
        images : {
            enemy: null
        }
    };
    
    function _getResources() {
        return _sprite;
    }
    
    var _self = this;
    function _move() {
        _indexPos += SPEED;
        
        if (_left <= 0 || _left + _width >= MY_MapWidth) {
            _direction *= -1;
        }        
                
        _left += STEP * _direction;
        
        if (_direction === 1) {
            _flipedImage = true;// Bild umdrehen
        }
        else {
            _flipedImage = false;// Bild umdrehen
        }
        
        var r = Math.floor(Math.random() * 100);
        //Wie oft schießt er.
        if (r === 5 && (_left > MY_camera.xView - 100 && _left < MY_camera.xView + MY_camera.wView + 100)) {
            _bullet.addBullet(_self, 'enemy');
        }
    }

    //------öffentlichen Bereich-------

    this.getResources = function() {
        return _getResources();
    };
    
    this.get = function() {
        var index = Math.floor(_indexPos) % _sprite.spriteSources.length;
        
        _sprite.images.enemy = MY_Game_Resources.get(_sprite.spriteSources[index]);
        
        _sprite.shapes.enemy = [{
            sTop        : 0,//sTop Sourse Top
            sLeft       : 0,
            top         : _top,
            left        : _left,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : _flipedImage
        }];

        return _sprite;
    };

    this.move = function() {
        _move();
    };
    
    this.onCollision = function(callBack) {
        _left =  Math.floor(Math.random() * Math.floor(MY_MapWidth - _width));

        _scoreDead += 1;
    };
    
    this.getLeft = function() {
        return _left;
    };
    
    this.getTop = function() {
        return _top;
    };
    
    this.getOffsetRight = function() {
        return _left + _width;
    };
    
    this.isFlippedImage = function() {
        if (_direction < 0) {
            return true;
        }
        return false;
    };

    this.getScore = function() {
        return _scoreDead;
    };
    
    this.reset = function() {
        _scoreDead = 0;
    };
}

Enemy.prototype = new Actor();
Enemy.prototype.constructor = Enemy;