function Bullet() {
    'use strict';

    //------privatbereich-------

    var _width = 30,
        _height = 20,
        _bulletTop = 350,
        _bulletLeft = 138,
        STEP = 5,
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
            'assets/img/bullet_enemy2.png'
        ],
        shapes : {},
        images : {}
    };

    function _getResources() {
        return _sprite;
    }

    /**
     *
     * pattern Flyweight
     */
//    function _shoot() {
//        _sprite.images.bullet = MY_Game_Resources.get(_sprite.spriteSources[0]);
//        _sprite.images.fire = MY_Game_Resources.get(_sprite.spriteSources[1]);
//
//        _leftBullet = _player.getLeft() + _player.getWidth();
//
//        _topBullet = _player.getTop() + 24;
//
//        _sprite.shapes.bullet.push({
//            top         : _topBullet,
//            left        : (_player.isFlippedImage()) ? _leftBullet - _player.getWidth() - 28 : _leftBullet + 30,
//            width       : _width,
//            height      : _height,
//            useSlice    : false,
//            flipedImage : _player.isFlippedImage()
//        });
//
//        _leftFire = _player.getLeft() + _player.getWidth();
//
//        _topFire = _player.getTop();
//
//        _sprite.shapes.fire = [{
//            top         : (_player.isFlippedImage()) ? _topFire + 22 : _topFire + 18,
//            left        : (_player.isFlippedImage()) ? _leftFire - _player.getWidth() - 32 : _leftFire + 20,
//            width       : _width,
//            height      : _height,
//            useSlice    : false,
//            flipedImage : _player.isFlippedImage(),
//            fired       : true
//        }];
//
//        return _sprite;
//    };

    function _refreshBullets() {
        for (var o in _sprite.shapes) {
            if (_sprite.shapes.hasOwnProperty(o)) {
                for (var i = 0; i < _sprite.shapes[o].length; i++) {
                    if (_sprite.shapes[o][i].left > MY_camera.xView + MY_Canvas.width || _sprite.shapes[o][i].left <= 0) {
                        _sprite.shapes[o].splice(i,1);
                    }
                    else {
                        if (_sprite.shapes[o][i].flipedImage) {
                            _sprite.shapes[o][i].left -= STEP;
                        }
                        else {
                            _sprite.shapes[o][i].left += STEP;
                        }
                    }
                }
            }
        }
    }
    
    function _isEmpty(obj) { 
        for (var x in obj) { 
            return false;
        }
        return true;
    }

    //------öffentlichen Bereich-------
    /**
     *
     * @param object o - Objekt,dem gehört die Bullets
     * @param string bulletType
     */
    this.addBullet = function(o, bulletType) {
        if (_sprite.shapes[bulletType] === undefined) {
            _sprite.shapes[bulletType] = [];
        }
        
        switch (bulletType) {
            case 'bullet':
                _sprite.images[bulletType] = MY_Game_Resources.get(_sprite.spriteSources[0]);
                var offsetTop = o.isSitting() ? o.getTop() +  16 : o.getTop() + 22;
                var offsetLeft = o.isFlippedImage() ? o.getLeft() - 30 : o.getOffsetRight() + 20;
                _width = 30;
                _height = 20;
                break;
            case 'enemy':
                _sprite.images[bulletType] = MY_Game_Resources.get(_sprite.spriteSources[1]);
                var offsetTop = o.getTop() +  16;
                var offsetLeft = o.isFlippedImage() ? o.getLeft() - 30 : o.getOffsetRight() + 20;
                _width = 30;
                _height = 20;
        }
        
        _sprite.shapes[bulletType].push({
            top         : offsetTop,
            left        : offsetLeft,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : o.isFlippedImage()
        });

        console.log(_sprite);
        console.log(_sprite.shapes[bulletType]);
        console.log(offsetLeft);
        console.log(o.isFlippedImage());
         console.log(offsetTop);
          console.log(_width);
           console.log(_height);
        
    };

    this.get = function() {
        _refreshBullets();

        if (_isEmpty(_sprite.images)) {
            return null;
        }

        return _sprite;;
    };

    this.hasBullets = function() {
        return _sprite.shapes > 0;
    };

    this.getResources = function () {
        return _getResources();
    };

//    this.shoot = function () {
//        _shoot();
////
////        audio.data.currentTime = 0;
////        audio.data.play(0);
//    };

//    this.stopShoot = function() {
//        //audio.data.pause(0);
//    };

//    this.hasClone = function() {
//        return _sprite.shapes;
//    };

//    this.getLeft = function() {
//        return _left;
//    };
//
//    this.getTop = function() {
//        return _top;
//    };
//
//    this.getWidth = function() {
//        return _width;
//    };
//
//    this.getHeight = function() {
//        return _height;
//    };
}

Bullet.prototype = new Actor();
Bullet.prototype.constructor = Bullet;
