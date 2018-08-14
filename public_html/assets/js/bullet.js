function Bullet() {
    'use strict';

    //------privatbereich-------

    var _width = 30,
        _height = 20,
        STEP = 5;

    // pattern Flyweight für die Shapes und Images.
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
                var offsetTop = o.getTop() +  66;
                var offsetLeft = o.isFlippedImage() ? o.getLeft() - 30 : o.getOffsetRight() + 20;
                _width = 97;
                _height = 26;
                break;
        }
        
        _sprite.shapes[bulletType].push({
            top         : offsetTop,
            left        : offsetLeft,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : o.isFlippedImage()
        });
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
}

Bullet.prototype = new Actor();
Bullet.prototype.constructor = Bullet;
