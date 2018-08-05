function Enemy() {
    var _width = 201,
        _height = 172,
        _top = 244,
        _left = 800,
        KEYDOWN_TIME = 6,
        indexMonsterPosition = 0,
        framesCounter = 0,
        STEP = 2,
        _impulse = 2,
        _scoreDead = 0;

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
        shapes : [{
            width       : _width,
            height      : _height,
            top         : _top,
            left        : _left,
            flipedImage : false,
            useSlice    : false
        }],
        frame : null
    };
    
    function _getResources () {
        return _sprite;
    }
    
    function _move() {
        if (framesCounter === KEYDOWN_TIME) {
            framesCounter = 0;

            indexMonsterPosition++;
            
            if (indexMonsterPosition >= _sprite.spriteSources.length) {
               indexMonsterPosition = 0;
            }
        }
        framesCounter++;
        
        _left -= STEP * _impulse;
        
        if (_left <= 0 || _left + _width >= MY_MapWidth) {
            _impulse *= -1;
        }
    }
    
    this.getResources = function() {
        return _getResources();
    };
    
    this.get = function() {
        _sprite.frame  = MY_Game_Resources.get(_sprite.spriteSources[indexMonsterPosition]);
        
        _sprite.shapes = [{
            sTop        : 0,//sTop Sourse Top
            sLeft       : 0,
            top         : _top,
            left        : _left,
            width       : _width,
            height      : _height,
            useSlice    : false,
            flipedImage : false
        }];

        return _sprite;
    };

    this.move = function() {
        _move();
    };
    
    this.onCollision = function(callBack) {
        _left =  Math.floor(Math.random() * Math.floor(MY_MapWidth - _width));
        
        if (_scoreDead === 9) {
            callBack(true);
        }
        _scoreDead += 1;
    };
    
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

    this.getScore = function() {
        return _scoreDead;
    };
    
    this.reset = function() {
        _scoreDead = 0;
    };
}

Enemy.prototype = new Actor();
Enemy.prototype.constructor = Enemy;